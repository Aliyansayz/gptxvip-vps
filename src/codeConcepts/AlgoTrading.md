
import numpy as np
import pandas as pd
from typing import Literal




def _rma(values: np.ndarray, period: int) -> np.ndarray:
    """
    Wilder's Moving Average (RMA).

    Used mainly for ATR and RSI calculations.
    Starts with an SMA seed, then applies Wilder smoothing.
    """

    result = np.full(len(values), np.nan)

    valid = np.flatnonzero(np.isfinite(values))

    if len(valid) < period:
        return result

    first = valid[0]
    seed = first + period - 1

    # Initial SMA
    result[seed] = values[first:seed + 1].mean()

    # Wilder smoothing
    for i in range(seed + 1, len(values)):
        result[i] = (
            result[i - 1]
            + (values[i] - result[i - 1]) / period
        )

    return result



def _oscillator(
    open_: np.ndarray,
    close: np.ndarray,
    index,
    source: str,
    mpo_len: int,
    rsi_period: int,
    smooth: int,
) -> np.ndarray:
    """
    Returns a centered momentum oscillator.

    source="MPO"
        Range is roughly -50 to +50.

    source="RSI"
        RSI is shifted by -50, so:
        RSI 50 -> 0
        RSI 70 -> +20
        RSI 30 -> -20

    Final oscillator is EMA-smoothed.
    """

    if source == "MPO":

        # Candle body momentum
        body = pd.Series(
            close - open_,
            index=index,
        )

        numerator = (
            body
            .rolling(mpo_len)
            .sum()
            .to_numpy()
        )

        denominator = (
            body
            .abs()
            .rolling(mpo_len)
            .sum()
            .to_numpy()
        )

        raw = np.divide(
            50 * numerator,
            denominator,
            out=np.zeros(len(close)),
            where=denominator > 0,
        )

        raw[~np.isfinite(denominator)] = np.nan

    else:

        # Price change
        change = np.r_[
            np.nan,
            np.diff(close),
        ]

        gains = np.maximum(
            change,
            0,
        )

        losses = np.maximum(
            -change,
            0,
        )

        # Wilder average gains/losses
        gain = _rma(
            gains,
            rsi_period,
        )

        loss = _rma(
            losses,
            rsi_period,
        )

        total = gain + loss

        # Center RSI around zero
        raw = np.divide(
            100 * gain,
            total,
            out=np.zeros(len(close)),
            where=total > 0,
        ) - 50

        raw[~np.isfinite(total)] = np.nan

        raw[total == 0] = 0

    # Smooth oscillator with EMA
    oscillator = (
        pd.Series(
            raw,
            index=index,
        )
        .ewm(
            span=smooth,
            adjust=False,
        )
        .mean()
        .to_numpy()
    )

    return oscillator




def _kmeans3(
    values: np.ndarray,
    seeds: tuple[float, float, float],
    max_iter: int = 100,
):
    """
    1D K-Means clustering into 3 ordered volatility groups.

    Returns:
        centers     -> [low, mid, high]
        counts      -> number of values in each cluster
        converged   -> whether clustering converged
        iterations  -> iterations used
    """

    values = np.asarray(values, dtype=float)

    # Remove invalid values
    values = values[np.isfinite(values)]

    if len(values) == 0:
        return (
            np.array([np.nan, np.nan, np.nan]),
            np.zeros(3, dtype=int),
            False,
            0,
        )

    low = values.min()
    high = values.max()

    # Initial cluster centers
    centers = low + (
        high - low
    ) * np.asarray(seeds, dtype=float)

    tolerance = (
        1e-8
        * max(
            float(np.abs(values).max()),
            np.finfo(float).tiny,
        )
    )

    converged = False

    for iteration in range(1, max_iter + 1):

        # Distance of every value to every centroid
        distances = np.abs(
            values[:, None] - centers
        )

        # Closest cluster
        labels = distances.argmin(axis=1)

        updated = centers.copy()

        # Recalculate cluster centers
        for cluster in range(3):

            members = values[
                labels == cluster
            ]

            if len(members) > 0:
                updated[cluster] = members.mean()

        # Always keep order:
        # 0 = Low
        # 1 = Mid
        # 2 = High
        updated.sort()

        # Check convergence
        if np.max(
            np.abs(updated - centers)
        ) <= tolerance:

            centers = updated
            converged = True
            break

        centers = updated

    # Final labels using final centroids
    labels = np.abs(
        values[:, None] - centers
    ).argmin(axis=1)

    counts = np.bincount(
        labels,
        minlength=3,
    )

    return (
        centers,
        counts,
        converged,
        iteration,
    )


# ============================================================
# DIVERGENCE
# ============================================================

def _divergence_states(
    high: np.ndarray,
    low: np.ndarray,
    oscillator: np.ndarray,
    pivot_len: int,
    ttl: int,
) -> np.ndarray:

    size = len(high)
    states = np.zeros(size, dtype=int)

    last_low_pivot = None
    last_high_pivot = None

    state = 0
    state_bar = -ttl

    for i in range(size):

        pivot = i - pivot_len

        if pivot >= pivot_len and np.isfinite(oscillator[pivot]):

            nearby_lows = np.r_[
                low[pivot - pivot_len:pivot],
                low[pivot + 1:i + 1],
            ]

            nearby_highs = np.r_[
                high[pivot - pivot_len:pivot],
                high[pivot + 1:i + 1],
            ]

            bullish = False
            bearish = False

            # Bullish divergence
            if np.all(low[pivot] < nearby_lows):

                if last_low_pivot is not None:
                    prev_price, prev_momentum = last_low_pivot

                    bullish = (
                        low[pivot] < prev_price
                        and oscillator[pivot] > prev_momentum
                    )

                last_low_pivot = (
                    low[pivot],
                    oscillator[pivot],
                )

            # Bearish divergence
            if np.all(high[pivot] > nearby_highs):

                if last_high_pivot is not None:
                    prev_price, prev_momentum = last_high_pivot

                    bearish = (
                        high[pivot] > prev_price
                        and oscillator[pivot] < prev_momentum
                    )

                last_high_pivot = (
                    high[pivot],
                    oscillator[pivot],
                )

            if bullish or bearish:

                if bullish and bearish:
                    state = 0
                elif bullish:
                    state = 1
                else:
                    state = -1

                state_bar = i

        # Expire old divergence
        if i - state_bar >= ttl:
            state = 0

        states[i] = state

    return states


# ============================================================
# K-MEANS VOLATILITY
# ============================================================

def _adaptive_volatility(
    atr: np.ndarray,
    atr_period: int,
    training_period: int,
    centroid_seeds,
    max_iter: int,
    centroid_weight: float,
):

    size = len(atr)

    adaptive_atr = np.full(size, np.nan)
    regime = np.full(size, -1, dtype=int)
    converged = np.zeros(size, dtype=bool)

    start = atr_period - 1 + training_period

    for i in range(start, size):

        # Previous ATR values only
        window = atr[i - training_period:i]

        centers, _, ok, _ = _kmeans3(
            window,
            centroid_seeds,
            max_iter,
        )

        # 0 = Low
        # 1 = Mid
        # 2 = High
        cluster = int(
            np.abs(centers - atr[i]).argmin()
        )

        adaptive_atr[i] = (
            (1.0 - centroid_weight) * atr[i]
            + centroid_weight * centers[cluster]
        )

        regime[i] = cluster
        converged[i] = ok

    return adaptive_atr, regime, converged


# ============================================================
# ADAPTIVE K-MEANS SUPERTREND
# ============================================================

def adaptive_kmeans_supertrend(
    df: pd.DataFrame,
    *,
    atr_period: int = 10,
    multiplier: float = 1.66,
    training_period: int = 150,

    centroid_seeds: tuple[float, float, float] = (
        0.25,
        0.50,
        0.75,
    ),

    max_iter: int = 100,
    centroid_weight: float = 1.0,

    source: Literal["MPO", "RSI"] = "MPO",

    mpo_len: int = 6,
    oscillator_smooth: int = 7,
    rsi_period: int = 14,

    pivot_len: int = 2,
    divergence_ttl: int = 10,

    enable_adaptive_shrink: bool = True,

    confirmation_bars: int = 2,
    momentum_threshold: float = 0.0,

    filter_low_volatility: bool = False,

    max_shock_ratio: float | None = 3.0,
    max_entry_risk_atr: float | None = 4.0,

    allow_initial_entry: bool = False,

) -> dict[str, pd.Series]:

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    source = source.upper()

    if source not in {"MPO", "RSI"}:
        raise ValueError(
            "source must be 'MPO' or 'RSI'"
        )

    required = {"open", "high", "low", "close"}

    if not required <= set(df.columns):
        raise ValueError(
            "df requires open, high, low and close columns"
        )

    # --------------------------------------------------------
    # OHLC
    # --------------------------------------------------------

    open_, high, low, close = (
        df[["open", "high", "low", "close"]]
        .to_numpy(float)
        .T
    )

    size = len(df)

    # Only outputs we actually need
    st = np.full(size, np.nan)

    st_trend = np.zeros(
        size,
        dtype=int,
    )

    confirmed_trend = np.zeros(
        size,
        dtype=int,
    )

    volatility_regime = np.full(
        size,
        -1,
        dtype=int,
    )

    buy = np.zeros(
        size,
        dtype=bool,
    )

    sell = np.zeros(
        size,
        dtype=bool,
    )

    # --------------------------------------------------------
    # Empty DataFrame
    # --------------------------------------------------------

    if size == 0:

        values = {
            "ST": st,
            "ST_Trend": st_trend,
            "Confirmed_Trend": confirmed_trend,
            "Volatility_Regime": volatility_regime,
            "Buy": buy,
            "Sell": sell,
        }

        return {
            key: pd.Series(
                value,
                index=df.index,
                name=key,
            )
            for key, value in values.items()
        }

    # --------------------------------------------------------
    # ATR
    # --------------------------------------------------------

    previous_close = np.r_[
        close[0],
        close[:-1],
    ]

    true_range = np.maximum.reduce([
        high - low,
        np.abs(high - previous_close),
        np.abs(low - previous_close),
    ])

    atr = _rma(
        true_range,
        atr_period,
    )

    # --------------------------------------------------------
    # Momentum
    # --------------------------------------------------------

    oscillator = _oscillator(
        open_,
        close,
        df.index,
        source,
        mpo_len,
        rsi_period,
        oscillator_smooth,
    )

    # --------------------------------------------------------
    # K-means volatility
    # --------------------------------------------------------

    adaptive_atr, volatility_regime, kmeans_ok = (
        _adaptive_volatility(
            atr,
            atr_period,
            training_period,
            centroid_seeds,
            max_iter,
            centroid_weight,
        )
    )

    # --------------------------------------------------------
    # Divergence
    # --------------------------------------------------------

    divergence = _divergence_states(
        high,
        low,
        oscillator,
        pivot_len,
        divergence_ttl,
    )

    # --------------------------------------------------------
    # Stateful Supertrend
    # --------------------------------------------------------

    upper = np.nan
    lower = np.nan

    direction = 0
    direction_run = 0

    entered_this_leg = False
    entry_allowed = allow_initial_entry

    # --------------------------------------------------------
    # Main loop
    # --------------------------------------------------------

    for i in range(size):

        if not np.isfinite(adaptive_atr[i]):
            continue

        old_direction = direction

        midpoint = (
            high[i] + low[i]
        ) / 2.0

        new_upper = (
            midpoint
            + multiplier * adaptive_atr[i]
        )

        new_lower = (
            midpoint
            - multiplier * adaptive_atr[i]
        )

        # ----------------------------------------------------
        # Supertrend
        # ----------------------------------------------------

        if direction == 0:

            upper = new_upper
            lower = new_lower

            direction = (
                1
                if close[i] >= midpoint
                else -1
            )

        else:

            if (
                new_upper < upper
                or close[i - 1] > upper
            ):
                upper = new_upper

            if (
                new_lower > lower
                or close[i - 1] < lower
            ):
                lower = new_lower

            if (
                direction == -1
                and close[i] > upper
            ):
                direction = 1

            elif (
                direction == 1
                and close[i] < lower
            ):
                direction = -1

        # ----------------------------------------------------
        # Direction change
        # ----------------------------------------------------

        changed = (
            old_direction != 0
            and direction != old_direction
        )

        if direction == old_direction:
            direction_run += 1
        else:
            direction_run = 1

        if changed:
            entered_this_leg = False
            entry_allowed = True

        # ----------------------------------------------------
        # Confirmation
        # ----------------------------------------------------

        confirmed = (
            direction
            if direction_run >= confirmation_bars
            else 0
        )

        st[i] = (
            lower
            if direction == 1
            else upper
        )

        st_trend[i] = direction
        confirmed_trend[i] = confirmed

        # ----------------------------------------------------
        # Basic readiness
        # ----------------------------------------------------

        if not (
            np.isfinite(oscillator[i])
            and atr[i] > 0
            and adaptive_atr[i] > 0
            and kmeans_ok[i]
            and confirmed != 0
        ):
            continue

        # ----------------------------------------------------
        # Shock filter
        # ----------------------------------------------------

        if (
            i > 0
            and np.isfinite(atr[i - 1])
            and atr[i - 1] > 0
        ):
            shock_ratio = (
                true_range[i]
                / atr[i - 1]
            )
        else:
            shock_ratio = np.nan

        shock_ok = (
            max_shock_ratio is None
            or (
                np.isfinite(shock_ratio)
                and shock_ratio
                <= max_shock_ratio
            )
        )

        # ----------------------------------------------------
        # Entry distance / risk
        # ----------------------------------------------------

        if direction == 1:
            risk = close[i] - lower
        else:
            risk = upper - close[i]

        risk_ok = (
            risk > 0
            and (
                max_entry_risk_atr is None
                or risk
                <= max_entry_risk_atr * atr[i]
            )
        )

        # ----------------------------------------------------
        # Opposing divergence
        # ----------------------------------------------------

        opposing_divergence = (
            enable_adaptive_shrink
            and divergence[i] == -direction
        )

        # ----------------------------------------------------
        # Volatility filter
        #
        # 0 = Low
        # 1 = Mid
        # 2 = High
        # ----------------------------------------------------

        volatility_ok = (
            not filter_low_volatility
            or volatility_regime[i] > 0
        )

        # ----------------------------------------------------
        # Final entry condition
        # ----------------------------------------------------

        can_enter = (
            shock_ok
            and risk_ok
            and not opposing_divergence
            and volatility_ok
        )

        long_ok = (
            can_enter
            and direction == 1
            and oscillator[i]
            > momentum_threshold
        )

        short_ok = (
            can_enter
            and direction == -1
            and oscillator[i]
            < -momentum_threshold
        )

        # One signal per Supertrend leg
        if (
            entry_allowed
            and not entered_this_leg
        ):

            if long_ok:
                buy[i] = True
                entered_this_leg = True

            elif short_ok:
                sell[i] = True
                entered_this_leg = True

    # --------------------------------------------------------
    # Pandas output
    # --------------------------------------------------------

    values = {
        "st": st,
        "direction": st_trend,
        "active_trend": confirmed_trend,
        "vol_regime": volatility_regime,
        "buy": buy,
        "sell": sell,
    }

    return {
        key: pd.Series(
            value,
            index=df.index,
            name=key,
        )
        for key, value in values.items()
    }


"""

Confirmed_Trend
---------------
 1 = BUY-side trend confirmed
-1 = SELL-side trend confirmed
 0 = WAIT


Volatility_Regime
-----------------
-1 = WAIT — not ready
 0 = QUIET — normally avoid
 1 = GOOD — normal active market
 2 = FAST — strong volatility, acceptable but higher risk
"""


"""

result = adaptive_kmeans_supertrend(
    df,
    source="MPO",
    confirmation_bars=2,
    enable_adaptive_shrink=True,
    filter_low_volatility=True,
)

# Latest and previous direction
latest_direction = int(result["ST_Trend"].iloc[-1])
previous_direction = int(result["ST_Trend"].iloc[-2])

# Direction changes
bullish_flip = previous_direction == -1 and latest_direction == 1
bearish_flip = previous_direction == 1 and latest_direction == -1

# Filtered entry signals
buy_signal = bool(result["Buy"].iloc[-1])
sell_signal = bool(result["Sell"].iloc[-1])

# Latest indicator values
supertrend = result["ST"].iloc[-1]
volatility = int(result["Volatility_Regime"].iloc[-1])
confirmed_direction = int(result["Confirmed_Trend"].iloc[-1])


"""



