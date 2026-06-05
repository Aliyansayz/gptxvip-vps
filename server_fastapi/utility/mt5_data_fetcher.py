import MetaTrader5 as mt5
import pandas as pd
from datetime import datetime


def get_broker_symbol(query: str):
    """Resolve a broker symbol by exact/partial name or description."""
    query = query.lower().strip()

    exact_symbol = None
    exact_description = None
    partial_match = None

    for s in mt5.symbols_get():
        name = s.name.lower()
        desc = (s.description or "").lower()

        if query == name:
            exact_symbol = s.name
            break

        if query == desc:
            exact_description = s.name

        if query in name or query in desc:
            partial_match = s.name

    return exact_symbol or exact_description or partial_match


def fetch_ticks(symbol: str, count: int = 10000):
    """Fetch raw MT5 ticks for symbol up to current time."""
    resolved_symbol = get_broker_symbol(symbol)
    if not resolved_symbol:
        raise ValueError(f"Could not resolve symbol for query: {symbol}")

    if not mt5.symbol_select(resolved_symbol, True):
        raise RuntimeError(f"Failed to select {resolved_symbol}, error={mt5.last_error()}")

    ticks = mt5.copy_ticks_from(resolved_symbol, datetime.now(), count, mt5.COPY_TICKS_ALL)
    if ticks is None:
        raise RuntimeError(f"copy_ticks_from failed, error={mt5.last_error()}")

    return resolved_symbol, pd.DataFrame(ticks)


def ticks_to_timeframe(df_ticks: pd.DataFrame, timeframe: str = "1s") -> pd.DataFrame:
    """
    Convert tick dataframe to customizable timeframe bars using mid-price OHLC.
    Supports pandas frequency strings (e.g., '1s', '30s', '500ms') 
    as well as fractional strings like '0.5ms' and '0.5s'.
    """
    if df_ticks.empty:
        return pd.DataFrame()

    # Pandas frequency standard requires integer values. 
    # Map common fractional timeframes to their micro/milli equivalents.
    tf_mapping = {
        "0.5ms": "500us", # 0.5 milliseconds = 500 microseconds
        "0.5s": "500ms"   # 0.5 seconds = 500 milliseconds
    }
    
    clean_tf = timeframe.lower().replace(" ", "")
    resample_freq = tf_mapping.get(clean_tf, clean_tf)

    df = df_ticks.copy()

    if "time_msc" in df.columns:
        df["timestamp"] = pd.to_datetime(df["time_msc"], unit="ms", utc=True)
    else:
        df["timestamp"] = pd.to_datetime(df["time"], unit="s", utc=True)

    df = df.sort_values("timestamp").set_index("timestamp")
    df["mid"] = (df["bid"] + df["ask"]) / 2.0

    # Resample using the mapped frequency
    bars = df["mid"].resample(resample_freq).ohlc()
    bars["tick_volume"] = df["mid"].resample(resample_freq).size()

    if "volume" in df.columns:
        bars["volume"] = df["volume"].resample(resample_freq).sum()

    if "spread" not in df.columns:
        df["spread"] = df["ask"] - df["bid"]
        
    bars["avg_spread"] = df["spread"].resample(resample_freq).mean()

    # Drop intervals where there were no ticks
    return bars.dropna(subset=["open", "high", "low", "close"])


class DataFetcher:

    def __init__(self, primary_timeframe , secondary_timeframe = None, tertiary_timeframe = None):
        """Initialize DataFetcher with primary and optional secondary timeframes.
        Accepts fractional timeframes like '0.5ms' and '0.5s'.
        And '1s', '30s', '500ms' as pandas frequency strings.
        
        Args:
            primary_timeframe (str): Primary timeframe for fetching data.
            secondary_timeframe (str, optional): Secondary timeframe for fetching data. Defaults to None.
        """
        self.primary_timeframe = primary_timeframe
        self.secondary_timeframe = secondary_timeframe
        self.tertiary_timeframe = tertiary_timeframe

    def fetch_price_ticks_data(self, symbol: str, tick_count: int = 10000):
        """Fetch data for the given symbol at the specified timeframes."""
        _, ticks_df = fetch_ticks(symbol, tick_count)
        return ticks_df

    def fetch_data_primary(self, symbol: str, tick_count: int = 10000):
        """Fetch data for the given symbol at the specified timeframes."""
        _, ticks_df = fetch_ticks(symbol, tick_count)
        primary_data  = ticks_to_timeframe(ticks_df, timeframe=self.primary_timeframe)
        return primary_data

    def fetch_data_secondary(self, symbol: str, tick_count: int = 10000):
        """Fetch data for the given symbol at the specified timeframes."""
        _, ticks_df = fetch_ticks(symbol, tick_count)
        secondary_data = ticks_to_timeframe(ticks_df, timeframe=self.secondary_timeframe)
        return secondary_data

    def fetch_data_tertiary(self, symbol: str, tick_count: int = 10000):
        """Fetch data for the given symbol at the specified timeframes."""
        _, ticks_df = fetch_ticks(symbol, tick_count)
        tertiary_data = ticks_to_timeframe(ticks_df, timeframe=self.tertiary_timeframe)
        return tertiary_data

    def fetch_data_multiple(self, symbol: str):
        """Fetch data for the given symbol at the specified timeframes."""
        primary_data = None
        secondary_data = None
        tertiary_data = None
        if self.primary_timeframe:
            _, ticks_df_p = fetch_ticks(symbol, self.primary_timeframe)
            primary_data  = ticks_to_timeframe(ticks_df_p, timeframe=self.primary_timeframe)
        if self.secondary_timeframe:
            _, ticks_df_s  = fetch_ticks(symbol, self.secondary_timeframe)
            secondary_data = ticks_to_timeframe(ticks_df_s, timeframe=self.secondary_timeframe)
        if self.tertiary_timeframe:
            _, ticks_df_t  = fetch_ticks(symbol, self.tertiary_timeframe)
            tertiary_data = ticks_to_timeframe(ticks_df_t, timeframe=self.tertiary_timeframe)
        return primary_data, secondary_data, tertiary_data


def main():
    symbol_query = "XAUUSD"
    tick_count = 20000

    if not mt5.initialize():
        raise RuntimeError(f"initialize() failed, error={mt5.last_error()}")

    try:
        symbol, ticks_df = fetch_ticks(symbol_query, tick_count)
        
        # Generate varied timeframes
        bars_0_5ms = ticks_to_timeframe(ticks_df, timeframe="0.5ms") # 0.5 Milliseconds
        bars_500ms = ticks_to_timeframe(ticks_df, timeframe="0.5s")  # 0.5 Seconds (500ms)
        bars_1s    = ticks_to_timeframe(ticks_df, timeframe="1s")    # 1 Second
        bars_30s   = ticks_to_timeframe(ticks_df, timeframe="30s")   # 30 Seconds

        print(f"Symbol: {symbol}")
        print(f"Raw ticks fetched: {len(ticks_df)}")
        print("-" * 50)
        
        print("\nLast 5 bars -> [0.5 ms] Timeframe:")
        print(bars_0_5ms.tail(5))
        
        print("\nLast 5 bars -> [0.5 sec] Timeframe:")
        print(bars_500ms.tail(5))

        print("\nLast 5 bars -> [1 sec] Timeframe:")
        print(bars_1s.tail(5))
        
        print("\nLast 5 bars -> [30 sec] Timeframe:")
        print(bars_30s.tail(5))

    finally:
        mt5.shutdown()






import MetaTrader5 as mt5
import pandas as pd
from datetime import datetime


def get_broker_symbol(query: str):
    """Resolve a broker symbol by exact/partial name or description."""
    query = query.lower().strip()

    exact_symbol = None
    exact_description = None
    partial_match = None

    for s in mt5.symbols_get():
        name = s.name.lower()
        desc = (s.description or "").lower()

        if query == name:
            exact_symbol = s.name
            break

        if query == desc:
            exact_description = s.name

        if query in name or query in desc:
            partial_match = s.name

    return exact_symbol or exact_description or partial_match


def fetch_ticks(symbol: str, count: int = 10000):
    """Fetch raw MT5 ticks for symbol up to current time."""
    resolved_symbol = get_broker_symbol(symbol)
    if not resolved_symbol:
        raise ValueError(f"Could not resolve symbol for query: {symbol}")

    if not mt5.symbol_select(resolved_symbol, True):
        raise RuntimeError(f"Failed to select {resolved_symbol}, error={mt5.last_error()}")

    ticks = mt5.copy_ticks_from(resolved_symbol, datetime.now(), count, mt5.COPY_TICKS_ALL)
    if ticks is None:
        raise RuntimeError(f"copy_ticks_from failed, error={mt5.last_error()}")

    return resolved_symbol, pd.DataFrame(ticks)


def ticks_to_1s(df_ticks: pd.DataFrame) -> pd.DataFrame:
    """Convert tick dataframe to 1-second bars using mid-price OHLC."""
    if df_ticks.empty:
        return pd.DataFrame()

    df = df_ticks.copy()

    if "time_msc" in df.columns:
        df["timestamp"] = pd.to_datetime(df["time_msc"], unit="ms", utc=True)
    else:
        df["timestamp"] = pd.to_datetime(df["time"], unit="s", utc=True)

    df = df.sort_values("timestamp").set_index("timestamp")
    df["mid"] = (df["bid"] + df["ask"]) / 2.0

    bars_1s = df["mid"].resample("1s").ohlc()
    bars_1s["tick_volume"] = df["mid"].resample("1s").size()

    if "volume" in df.columns:
        bars_1s["volume"] = df["volume"].resample("1s").sum()

    if "spread" not in df.columns:
        df["spread"] = df["ask"] - df["bid"]
    bars_1s["avg_spread"] = df["spread"].resample("1s").mean()

    return bars_1s.dropna(subset=["open", "high", "low", "close"])


# def main():
#     symbol_query = "XAUUSD"
#     tick_count = 20000

#     if not mt5.initialize():
#         raise RuntimeError(f"initialize() failed, error={mt5.last_error()}")

#     try:
#         symbol, ticks_df = fetch_ticks(symbol_query, tick_count)
#         bars_1s = ticks_to_1s(ticks_df)

#         print(f"Symbol: {symbol}")
#         print(f"Raw ticks fetched: {len(ticks_df)}")
#         print("\nLast 10 x 1-second bars:")
#         print(bars_1s.tail(10))

#     finally:
#         mt5.shutdown()



if __name__ == "__main__":
    main()