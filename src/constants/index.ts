import {
  TrendingUp,
  Shield,
  Target,
  Zap,
  BarChart3,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Network,
  Sun,
  Moon,
  Home,
  Menu,
  X,
  Activity,
  ListChecks,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Scissors,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const singleTradeSnippets = [
  {
    id: "entry",
    name: "Entry Condition",
    description:
      'Evaluates entry signals for a specific symbol. Returns "long", "short", or False.',
    code: `def _check_entry_condition(self, symbol):
    """
    Evaluates entry signals for a specific symbol.
    """
    signal = self.engine.get_signal(symbol)
    if signal > self.threshold:
        return "long"
    elif signal < -self.threshold:
        return "short"
    return False`,
  },
  {
    id: "sl-tp",
    name: "Set SL/TP",
    description:
      "Sets the SL and TP levels for the given symbol. Returns True if successful.",
    code: `def _set_stop_loss_take_profit(self, symbol):
    """
    Sets the SL and TP levels for the given symbol.
    """
    try:
        atr = self.indicators.get_atr(symbol)
        self.risk_manager.set_levels(symbol, sl=atr*2, tp=atr*4)
        return True
    except Exception:
        return False`,
  },
  {
    id: "exit",
    name: "Exit Condition",
    description:
      "Checks if the current trade for the symbol should be closed based on direction.",
    code: `def _check_exit_condition(self, symbol, trade_direction):
    """
    Checks if the current trade for the symbol should be closed.
    """
    pnl = self.portfolio.get_pnl(symbol)
    if trade_direction == "long" and pnl < -self.max_loss:
        return True
    if trade_direction == "short" and pnl < -self.max_loss:
        return True
    return False`,
  },
  {
    id: "flip",
    name: "Flip Position",
    description:
      "Closes current trade and opens a new one in the opposite direction.",
    code: `def _open_next_trade_on_exit(self, symbol, current_direction):
    """
    Closes current trade and opens new one in opposite direction.
    """
    if current_direction == "short":
        self.executor.flip_position(symbol, to="long")
        return "close_and_long"
    else:
        self.executor.flip_position(symbol, to="short")
        return "close_and_short"`,
  },
  {
    id: "update",
    name: "Update SL/TP",
    description:
      "Updates the stop loss and take profit levels dynamically based on volatility.",
    code: `def _update_sl_tp(self, symbol):
    """
    Updates the stop loss and take profit levels dynamically.
    """
    new_volatility = self.indicators.get_volatility(symbol)
    self.risk_manager.adjust_levels(symbol, new_volatility)`,
  },
];

export const multipleTradeSnippets = [
  {
    id: "instant",
    name: "Instant Entry",
    description: "Evaluates immediate entry signals based on raw price action.",
    code: `def _check_instant_trade_entry_condition(self, price_data):
    rsi = self.indicators.calculate_rsi(price_data)
    if rsi < 30 and self.price_action.is_bullish_engulfing():
        return True, "Oversold condition + Bullish Engulfing"
    return False, None`,
  },
  {
    id: "delayed",
    name: "Delayed Entry",
    description:
      "Checks if a secondary trade should be opened based on existing trade performance.",
    code: `def _check_delayed_trade_entry_condition(self, active_trades):
    for trade in active_trades:
        if trade.pnl_percentage > 2.5:
            return True, f"Scaling in: Trade {trade.id} is in profit"
    return False, None`,
  },
  {
    id: "time-exit",
    name: "Time-Based Exit",
    description: "Enforces time-based liquidation rules.",
    code: `def _check_trades_exit_time_based(self, trade):
    duration = self.current_time - trade.entry_time
    if duration > self.config.max_hold_time:
        return True, "Max hold time reached"
    return False, None`,
  },
  {
    id: "indicator-exit",
    name: "Indicator Exit",
    description: "Monitors technical indicators for exit signals.",
    code: `def _check_trades_exit_indicator_based(self, price_data):
    macd_signal = self.indicators.get_macd_crossover(price_data)
    if macd_signal == "BEARISH":
        return True, "MACD Bearish Crossover detected"
    return False, None`,
  },
];

export const cointegrationSnippets = [
  {
    id: "coint-init",
    name: "Initialization",
    description:
      "Sets up the CointegrationTradeLogicManager with parameters for symbols, thresholds, and risk limits.",
    code: `class CointegrationTradeLogicManager:
    """Manage live mean-reversion trades for a cointegrated symbol pair.

    Runs on each new bar (call \`evaluate_logic(df)\`).  The decision flow:

    1. **Cointegration re-check** — every \`coint_recheck_interval\` seconds,
       re-run the Engle-Granger test.  If the pair is no longer cointegrated,
       close all positions.
    2. **Spread & Z-score** — compute the hedge-ratio spread and its rolling
       Z-score (window=50).
    3. **Close conditions** — close existing trades on:
       - Mean reversion (\`|Z| ≤ exit_z\`).
       - Time expiry (\`> time_exit_seconds\`).
       - Z-score blowout (\`|Z| > zscore_stop_loss\`).
       - Cointegration breakdown.
    4. **Open conditions** (only if no trades active):
       - \`Z > entry_z\`  → SHORT spread (sell sym1, buy sym2).
       - \`Z < -entry_z\` → LONG spread  (buy sym1, sell sym2).
    """

    def __init__(
        self,
        symbol_1: str,
        symbol_2: str,
        lot_size: float = 0.01,
        entry_z: float = 2.0,
        exit_z: float = 0.5,
        zscore_stop_loss: float = 3.0,
        pvalue_threshold: float = 0.05,
        coint_recheck_interval: int = 300,
        time_exit_seconds: int = 120,
    ):
        self.symbol_1 = symbol_1
        self.symbol_2 = symbol_2
        self.lot_size = lot_size

        self.entry_z = entry_z
        self.exit_z = exit_z
        self.zscore_stop_loss = zscore_stop_loss
        self.pvalue_threshold = pvalue_threshold
        self.coint_recheck_interval = coint_recheck_interval
        self.time_exit_seconds = time_exit_seconds

        self.active_trades: dict[int, dict] = {}
        self.executor = TradeExecutor(lot_size=lot_size)
        self.executor.initialize_mt5()

        self.is_cointegrated = False
        self.last_coint_check = 0.0

    @staticmethod
    def generate_magic_id() -> int:
        """Generate a random 6-digit magic ID for MT5 order tracking."""
        return random.randint(100_000, 999_999)`,
  },
  {
    id: "coint-analysis",
    name: "Analysis & Math",
    description:
      "Handles the Engle-Granger test, spread calculation, and Z-Score computation.",
    code: `    def check_cointegration(self, df: pd.DataFrame) -> bool:
        """Run the Engle-Granger cointegration test on the pair."""
        score, pvalue, _ = coint(df["price_1"], df["price_2"])
        print(f"Cointegration test p-value: {pvalue:.5f}")

        self.is_cointegrated = pvalue < self.pvalue_threshold
        return self.is_cointegrated

    def compute_spread(self, df: pd.DataFrame) -> tuple[pd.Series, float]:
        """Compute the hedge-ratio spread between the two price series."""
        x = df["price_2"]
        y = df["price_1"]

        beta = np.polyfit(x, y, 1)[0]
        spread = y - beta * x

        return spread, beta

    def compute_zscore(self, spread: pd.Series) -> float | None:
        """Compute the rolling Z-score of the spread at the latest bar."""
        rolling_mean = spread.rolling(window=50).mean()
        rolling_std = spread.rolling(window=50).std()

        if rolling_std.iloc[-1] == 0:
            return None

        z = (spread.iloc[-1] - rolling_mean.iloc[-1]) / rolling_std.iloc[-1]
        return z`,
  },
  {
    id: "coint-management",
    name: "Trade Management",
    description:
      "Executes the opening and closing of spread trades across both legs simultaneously.",
    code: `    def _close_trades(self, zscore: float, current_time: float) -> None:
        """Evaluate and execute close conditions for all active trades."""
        trades_to_remove = []

        for magic_id, trade_info in self.active_trades.items():
            open_time = trade_info["open_time"]
            close_trade = False

            # Mean reversion exit
            if abs(zscore) <= self.exit_z:
                print(f"[{magic_id}] Mean reversion exit")
                close_trade = True

            # Time exit
            if current_time - open_time > self.time_exit_seconds:
                print(f"[{magic_id}] Time exit")
                close_trade = True

            # Z-score stop-loss (blowout)
            if abs(zscore) > self.zscore_stop_loss:
                print(f"[{magic_id}] Z-score stop-loss exit (|Z|={abs(zscore):.2f})")
                close_trade = True

            # Emergency exit (cointegration breaks)
            if not self.is_cointegrated:
                print(f"[{magic_id}] Cointegration broken → force exit")
                close_trade = True

            if close_trade:
                self.executor.close_position([self.symbol_1], magic_id)
                self.executor.close_position([self.symbol_2], magic_id)
                trades_to_remove.append(magic_id)

        for magic_id in trades_to_remove:
            del self.active_trades[magic_id]

    def _open_spread_trade(self, direction: str) -> None:
        """Open a spread trade (both legs) in the given direction."""
        magic_id = self.generate_magic_id()

        if direction == "short_spread":
            sym1_side, sym2_side = "sell", "buy"
        else:
            sym1_side, sym2_side = "buy", "sell"

        print(f"{direction.upper().replace('_', ' ')}")

        self.executor.open_mt5_live_trade_with_sl_tp_values(
            symbol=self.symbol_1, trade_type=sym1_side,
            lot_size=self.lot_size, magic_id=magic_id,
        )

        self.executor.open_mt5_live_trade_with_sl_tp_values(
            symbol=self.symbol_2, trade_type=sym2_side,
            lot_size=self.lot_size, magic_id=magic_id,
        )

        self.active_trades[magic_id] = {
            "trade_type": direction,
            "open_time": time.time(),
        }`,
  },
  {
    id: "coint-evaluate",
    name: "Main Logic Loop",
    description:
      "The primary evaluation loop called on each new bar to process data and trigger actions.",
    code: `    def evaluate_logic(self, df: pd.DataFrame) -> None:
        """Evaluate the full trading decision flow on new data."""
        if df is None or len(df) < 100:
            return

        current_time = time.time()

        # Re-check cointegration periodically
        if current_time - self.last_coint_check > self.coint_recheck_interval:
            self.check_cointegration(df)
            self.last_coint_check = current_time

        if not self.is_cointegrated:
            print("Pair NOT cointegrated → skipping trades")
            return

        spread, beta = self.compute_spread(df)
        zscore = self.compute_zscore(spread)

        if zscore is None:
            return

        print(f"Z-Score: {zscore:.2f}")

        # Close conditions
        self._close_trades(zscore, current_time)

        # Open conditions (only if flat)
        if len(self.active_trades) > 0:
            return

        if zscore > self.entry_z:
            self._open_spread_trade("short_spread")
        elif zscore < -self.entry_z:
            self._open_spread_trade("long_spread")`,
  },
  {
    id: "coint-entry-point",
    name: "Script Entry Point",
    description:
      "Initializes the data fetcher, defines symbols, and starts the scanner.",
    code: `if __name__ == "__main__":
    fetcher = DataFetcher(primary_timeframe="1s")

    symbols = ["EURUSD", "GBPUSD", "USDCHF", "AUDUSD",
               "NZDUSD", "USDCAD", "EURGBP", "EURJPY"]

    scanner = CointegrationScanner(symbols, fetcher)
    best_pairs = scanner.scan()`,
  },
];

export const keyTerms = [
  {
    term: "Cointegration",
    definition:
      "A statistical property of a collection of time series variables. If two or more series are themselves non-stationary, but a linear combination of them is stationary, then the series are said to be cointegrated.",
    example:
      "A drunk person walking a dog on a leash. They wander randomly, but the distance between them is bounded.",
  },
  {
    term: "Correlation",
    definition:
      "A statistical measure that expresses the extent to which two variables are linearly related (meaning they change together at a constant rate).",
    example: "Ice cream sales and temperature are positively correlated.",
  },
  {
    term: "Stochastic Momentum",
    definition:
      "An indicator that compares a particular closing price of a security to a range of its prices over a certain period of time. It's used to generate overbought and oversold trading signals.",
    example:
      "A stochastic oscillator reading above 80 indicates overbought, below 20 indicates oversold.",
  },
  {
    term: "Multi Timeframe Analysis",
    definition:
      "The process of viewing the same currency pair (or asset) under different time frames (e.g., 1-hour, 4-hour, Daily) to determine the larger trend and find better entry/exit points.",
    example:
      "Checking the Daily chart for a bullish trend, then using the 15-minute chart to find a dip to buy.",
  },
  {
    term: "Filled / Unfilled (Orders)",
    definition:
      "A filled order is an order that has been executed. An unfilled order is an order that has not yet been executed, usually because the specified price has not been reached (limit order) or there is insufficient liquidity.",
    example:
      "Placing a limit buy at $100. If price hits $100 and there's a seller, it's filled. If price stays at $105, it remains unfilled.",
  },
  {
    term: "Floor Latency",
    definition:
      "The time delay experienced in trading systems between the moment an order is generated and the moment it is received and processed by the exchange.",
    example:
      "A high-frequency trading firm co-locates its servers next to the exchange to reduce floor latency from 5 milliseconds to 1 microsecond.",
  },
  {
    term: "Market Microstructure",
    definition:
      "The study of how financial markets operate, focusing on the behavior of participants, the trading mechanisms, and the rules that govern the exchange of assets. It deals with order books, bid-ask spreads, and liquidity.",
    example:
      "Analyzing how a large block order impacts the bid-ask spread and temporarily moves the price.",
  },
  {
    term: "Regime Detection (Trend Based / Range Based)",
    definition:
      "The process of identifying the current market environment. A trend-based regime is characterized by sustained directional movement. A range-based regime is characterized by price oscillating between established support and resistance levels.",
    example:
      "Using ADX (Average Directional Index) to determine if the market is trending (ADX > 25) or ranging (ADX < 25) to select the appropriate trading strategy.",
  },
  {
    term: "Hedging",
    definition:
      "A risk management strategy employed to offset losses in investments by taking an opposite position in a related asset.",
    example:
      "Buying a stock and simultaneously buying a put option on that same stock to protect against a downside move.",
  },
];

export * from './codeConcepts';

export const sidebarItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    subItems: [
      { id: "liquidity-depth", label: "Liquidity Depth" },
      { id: "order-book-lab", label: "Order Book Lab" },
    ],
  },
  {
    id: "trading-tools",
    label: "Trading Tools Lab",
    icon: Target,
    subItems: [
       { id: "leverage-view-v3", label: "Leverage Trading Version 3" },
       { id: "leverage-view-live-starter", label: "Leverage Version Live Starter" }
    ]
  },
  {
    id: "archive-tools",
    label: "Archive Tools",
    icon: Target,
    subItems: [
       { id: "leverage-view-v2", label: "Leverage Trading Version 2" },
       { id: "lab-view", label: "Starter Edition Tools" },
       { id: "leverage-view", label: "Leverage Trading Version 1 (Legacy)" }
    ]
  },
  {
    id: "trade-type",
    label: "Trade Type",
    icon: Target,
    subItems: [
      { id: "single", label: "One Trade at a Time" },
      { id: "multiple", label: "Multiple Trades at a Time" },
      { id: "breakeven", label: "Breakeven & Partial Position" },
      { id: "hedge", label: "Hedge Trade" },
    ],
  },
  {
    id: "cointegration",
    label: "Cointegration Trading",
    icon: Activity,
    subItems: [
      { id: "coint-overview", label: "Overview" },
      { id: "coint-rules", label: "Trading Rules" },
      { id: "coint-pipeline", label: "Checking Pipeline" },
      { id: "coint-examples", label: "Pair Examples" },
      { id: "coint-actions", label: "Action & Exit Tables" },
      { id: "coint-code", label: "Code Snippets" },
    ],
  },
  {
    id: "key-terms",
    label: "Key Terms",
    icon: BookOpen,
    subItems: [{ id: "terms-list", label: "Dictionary" }],
  },
  {
    id: "map",
    label: "Documentation Map",
    icon: Network,
    subItems: [
      { id: "doc-map", label: "Map Overview" },
      { id: "project-journey", label: "Project Journey" },
    ],
  },
  {
    id: "dev-labs-workspace",
    label: "Dev Labs and Agent Workspace",
    icon: Zap,
  },
  {
    id: "core-concepts",
    label: "Core Concepts",
    icon: Lightbulb,
  },
  {
    id: "math-primer",
    label: "Math Primer",
    icon: Lightbulb,
  },
  { id: "overview", label: "Strategy Overview", icon: BarChart3 },
];
