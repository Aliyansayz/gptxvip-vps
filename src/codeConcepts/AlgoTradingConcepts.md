# Algo Trading: Indicator Concepts

This guide walks through the adaptive K-means Supertrend implementation in [AlgoTrading.md](./AlgoTrading.md). The Code Concepts course uses the same learning path in [the Algo Trading curriculum JSON](../../public/code_concepts/algo_trading/index.json).

The supplied file contains Python source despite its <code>.md</code> extension. It combines volatility measurement, trend state, momentum, divergence, clustering, and signal filters. This guide separates those ideas so each can be understood before reading the full function.

## What the indicator does

For each OHLC bar, the implementation:

1. Calculates True Range and smooths it into ATR.
2. Fits three volatility groups to a rolling window of past ATR values.
3. Blends the current ATR with its nearest cluster center to make an adaptive ATR.
4. Uses adaptive ATR to set and trail Supertrend bands.
5. Tracks momentum and delayed swing-pivot divergence.
6. Emits at most one buy or sell signal per trend leg after confirmation and risk filters.

The code calculates ATR, swing pivots, and K-means volatility regimes. It does **not** calculate relative price range or ADX. Those are useful companion concepts and possible extensions.

---

## Basic concepts

### 1. Relative range and price location

“Relative range price” can refer to two different normalizations, so keep these separate:

**Relative range size** compares a bar's high-low range with the instrument's price:

~~~text
range_percent = 100 × (high - low) / close
~~~

For example, a $2 range on a $100 instrument is 2%. This is a single-bar range and does not account for a gap from the previous close. ATR% is a smoothed, gap-aware alternative: <code>100 × ATR / close</code>.

**Close location within the bar** says where the close landed between that bar's low and high:

~~~text
close_location = (close - low) / (high - low)
~~~

It is 0 when the close equals the low, 1 when it equals the high, and between 0 and 1 otherwise. If <code>high == low</code>, handle the division by returning a missing value or a chosen neutral value.

Both are descriptive features. A close near a bar's high does not by itself prove that the next bar will rise. The supplied indicator does not calculate either formula. For the difference between a simple range and ATR, see [TradingView's ATR guide](https://www.tradingview.com/support/solutions/43000501823-average-true-range-atr/) and [ATR% definition](https://www.tradingview.com/support/solutions/43000734653-how-are-adr-and-atr-calculated/).

### 2. Average True Range (ATR)

The high-low range misses gaps. True Range compares three distances and keeps the largest:

~~~text
TR = max(
    high - low,
    abs(high - previous_close),
    abs(low - previous_close)
)
~~~

ATR smooths these non-negative True Range values. In the supplied code, <code>_rma</code> first seeds the average with a simple moving average, then applies Wilder smoothing:

~~~text
ATR[t] = ATR[t-1] + (TR[t] - ATR[t-1]) / period
~~~

ATR has price units: an ATR of 2.5 means recent true movement averaged about 2.5 price units per bar. ATR measures movement size, not direction. In this indicator, ATR is both the basis for the Supertrend band distance and the input to volatility clustering.

### 3. Average Directional Index (ADX)

ADX estimates how strong a trend is, without saying whether it points up or down. The related +DI and −DI lines provide directional context; ADX is smoothed from their directional-movement comparison.

In a rule, ADX can answer “is there a meaningful trend?” The Supertrend direction or +DI/−DI comparison can answer “which direction?” Common example thresholds such as 20 or 25 are conventions, not universal cutoffs; they should be evaluated for the market and timeframe.

ADX is not implemented in the supplied function. Its presence in this course explains how it differs from ATR and how it could be tested as an additional filter. See [TradingView's ADX explanation and calculation](https://www.tradingview.com/support/solutions/43000589099-average-directional-index-adx/).

### 4. Pivots: swing points versus pivot levels

The word “pivot” is used for two different tools:

- A **swing pivot** is a local high or low. A high is surrounded by lower highs; a low is surrounded by higher lows. It needs bars on both sides.
- A **classic pivot level** is a calculated support/resistance price, often derived from a previous session's high, low, and close.

The source uses swing pivots, not classic pivot levels. In <code>_divergence_states</code>, <code>pivot = i - pivot_len</code> points to an earlier candidate. The right-side bars through <code>i</code> confirm whether it is a local extreme. Price and the oscillator are then compared with the previous pivot to detect bullish or bearish divergence.

This means the pivot is only known after <code>pivot_len</code> bars have arrived. A backtest must make the signal available at the confirmation bar, not pretend it was known at the historical pivot bar. See [TradingView's swing pivot definition](https://www.tradingview.com/support/solutions/43000589195-pivot-points-high-low/).

### 5. Machine-learning clustering

Clustering is an **unsupervised** learning method: it groups input values by similarity without examples labeled “correct answer.” It does not automatically predict future returns.

Here, the values are past ATR readings. The algorithm divides them into three groups. Because ATR describes movement size, the groups are interpreted as relatively low, middle, and high volatility. These labels are relative to the rolling training window; they are not fixed categories shared across assets.

### 6. K-means clustering

K-means repeats two steps:

1. Assign each input to its nearest center.
2. Move each center to the mean of its assigned inputs.

It stops when centers barely move or it reaches an iteration limit. In <code>_kmeans3</code>, the input is one-dimensional ATR, there are three centers, assignments use absolute distance, and the centers are sorted so cluster 0/1/2 remain low/middle/high.

In <code>_adaptive_volatility</code>, the code fits on <code>atr[i - training_period:i]</code>. Python excludes the right endpoint, so the current ATR is not part of its own training sample. The current ATR is then assigned to its closest center. <code>centroid_weight</code> controls how much the adaptive ATR is pulled toward that center.

---

## Intermediate: follow the indicator pipeline

### 1. ATR becomes a trend-band distance

For each ready bar, the code builds preliminary Supertrend bands around the high-low midpoint:

~~~text
midpoint = (high + low) / 2
upper = midpoint + multiplier × adaptive_ATR
lower = midpoint - multiplier × adaptive_ATR
~~~

The stateful update trails the active bands. A close crossing the opposite active band changes direction. <code>confirmation_bars</code> requires a direction to persist before <code>Confirmed_Trend</code> is set to +1 or -1; 0 means wait.

### 2. Momentum is a separate input

<code>_oscillator</code> supports two sources:

- **MPO:** sums candle bodies (<code>close - open</code>) over a window and normalizes by the sum of their absolute sizes. The result is centered around zero.
- **RSI source:** calculates a Wilder-smoothed RSI and subtracts 50, centering neutral momentum around zero.

The result is EMA-smoothed. A positive value indicates positive measured momentum; the code requires it to exceed <code>momentum_threshold</code> for a long entry, and to fall below its negative for a short entry.

### 3. Divergence compares pivots

Bullish divergence requires price to make a lower swing low while the oscillator makes a higher low. Bearish divergence requires a higher swing high while the oscillator makes a lower high.

The source stores the most recent pivot price and oscillator value, then keeps a divergence state for <code>divergence_ttl</code> bars. With <code>enable_adaptive_shrink</code> enabled, an opposing divergence blocks an entry in this implementation. Despite its name, this parameter does not shrink the Supertrend bands.

### 4. Read entry flags as a series of gates

A signal is considered only after the adaptive ATR and oscillator are available, K-means reports convergence, ATR values are positive, and the trend has been confirmed. The remaining checks can reject an entry when:

- current True Range is too large versus the previous ATR (<code>max_shock_ratio</code>);
- close is too far from the active band in ATR units (<code>max_entry_risk_atr</code>);
- an enabled low-volatility filter sees regime 0;
- divergence opposes the trend;
- momentum does not clear the threshold.

The code permits one signal per Supertrend leg. <code>allow_initial_entry=False</code> also means the initial trend does not enable an entry until a later direction change.

---

## Advanced: evaluate the method and its limits

### Rolling K-means is relative and can move

Each bar refits three centers over a moving ATR sample. A new sample, outlier, or different training-period length can move the centers and change regime labels. A “high” regime means high relative to that recent sample, not necessarily high compared with another asset or another year.

The implementation has useful safeguards—finite-value filtering, ordered centers, a convergence tolerance, and an iteration limit—but clustering can still be unstable when ATR values are tightly grouped or an extreme value stretches the sample. Track cluster counts and convergence in diagnostics before relying on the regime label.

### Keep timestamps causal

The K-means training window excludes the current ATR, avoiding self-inclusion while assigning the current bar. Swing-pivot logic also waits for right-side bars; this is causal only if divergence is emitted at that later confirmation bar. A chart may draw a confirmed pivot back on its historical bar, but a backtest must not trade as though the pivot was known then.

The function calculates flags using the current bar's close and OHLC. A backtest should define when the bar is complete, when an order can first be submitted, and what fill price is plausible. Include fees, spread, slippage, and rejected or partial orders in strategy evaluation.

### ADX and relative-range features are extensions

An ADX filter could be tested to separate stronger trends from weak or range-bound periods. It should not be interpreted as direction. Relative range size or close location could be tested as extra features, but they are not inputs to this implementation. When combining features in K-means, normalize them deliberately: raw ATR, percentages, and close-location values have different units and scales, so distance could otherwise be dominated by the largest-valued feature.

Treat every extension as a hypothesis. Compare it with the existing rule using walk-forward or out-of-sample data, and measure the effect after realistic execution costs.

---

## Quick reference

| Concept | What it measures | Used by this code? |
| --- | --- | --- |
| Relative range size / ATR% | Range relative to price | No |
| Close location in range | Close position between bar low and high | No |
| True Range / ATR | Gap-aware movement size and its smoothed average | Yes |
| ADX | Trend strength, not direction | No |
| Swing pivots | Delayed local highs/lows used for divergence | Yes |
| Classic pivot levels | Calculated support/resistance levels | No |
| K-means | Groups past ATR values into three volatility regimes | Yes |

## Interactive visual labs

The Algo Trading topic includes visual, control-driven activities in Code Concepts:

- **Explore Bar Range and True Range:** switches between contained and gap candles, and recomputes range percentage, close location, True Range, and one ATR smoothing update.
- **Separate Trend Strength from Direction:** switches between rising, falling, and choppy market sketches to compare ADX with +DI/−DI. The displayed DMI values are labeled illustrative.
- **Reveal the Bars Needed to Confirm a Pivot:** changes the pivot window and reveals right-side bars so confirmation delay is visible.
- **Run K-means on a Window of ATR Values:** steps through nearest-center assignments and centroid updates, then classifies a separate current ATR.
- **Adjust Volatility and Audit the Entry Gates:** changes ATR and the band multiplier and toggles trend confirmation and entry guards.

Each activity uses the shared Code Concepts simulation runner for navigation, reset, and the explanatory theory pane. The visual itself uses responsive SVG and native controls, so the diagrams stay tied to the selected example.

## Useful additions for a later lesson pass

- **Walk-forward backtest lab:** move a training/test split through a price series and reveal how fees, spread, and slippage change the result.
- **Cluster stability lab:** compare three-cluster assignments as the training window, outlier handling, and feature scaling change.
- **Position-sizing lab:** turn stop distance in ATR units and an account-risk budget into a position size.
- **Pivot look-ahead audit:** compare the historical point where a pivot is drawn with the later bar where it was actually confirmed.

## Reference

- [TradingView: Average True Range](https://www.tradingview.com/support/solutions/43000501823-average-true-range-atr/)
- [TradingView: ATR%](https://www.tradingview.com/support/solutions/43000734653-how-are-adr-and-atr-calculated/)
- [TradingView: Average Directional Index](https://www.tradingview.com/support/solutions/43000589099-average-directional-index-adx/)
- [TradingView: Pivot Points High Low](https://www.tradingview.com/support/solutions/43000589195-pivot-points-high-low/)
- [scikit-learn: Clustering and K-means](https://scikit-learn.org/stable/modules/clustering.html)
