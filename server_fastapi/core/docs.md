# MT5 Trade Execute Documentation

This module (`mt5_trade_execute.py`) provides robust utility classes to interact with MetaTrader 5 (MT5) for resolving symbols, opening trades, managing stop losses/take profits, calculating risk, and closing positions.

## `MT5Symbols`
Utility class for resolving broker symbols in MetaTrader 5.

### Methods
- `__init__()`: Initializes the MT5 connection and fetches all available symbols.
- `initialize_mt5()`: Attempts connection to the MT5 terminal.
- `get_broker_symbol(query: str)`: Resolves a symbol description or partial name to the exact broker symbol (e.g., "gold" -> "XAUUSD" or "Euro vs US Dollar" -> "EURUSD").

---

## `TradeExecutor`
A comprehensive class for executing and managing trades.

### Initialization & Setup
- `__init__(lot_size=0.01, magic_id=None)`: Initializes the executor with a default lot size and an optional magic ID.
- `initialize_mt5()`: Connects to MT5 terminal.
- `_validate_symbol_info(symbol)`: Validates if a symbol is tradable and visible in Market Watch.
- `_normalize_volume(volume, sinfo)`: Normalizes trade volume based on the broker's minimum volume and volume steps constraints for a specific symbol.

### Opening Trades
- `open_mt5_live_trade(symbol, trade_type, sl_pips, lot_size, magic_id)`: Opens a live trade (buy/sell) using pip-based offsets for Stop Loss. It includes logic for enforcing broker stop distances.
- `open_mt5_live_trade_with_sl_tp_values(...)`: Opens a trade using explicit price values for SL and TP rather than pip offsets. 
- `_try_order_with_filling_modes(base_request, sinfo)`: A fallback mechanism that iterates over various filling modes (`IOC`, `FOK`, `RETURN`) to guarantee order execution based on the broker's execution mode constraints.

### Trade Modification & Management
- `update_stop_loss(symbol, new_sl_price, ticket=None, magic_id=None)`: Updates the stop loss for an active position, filterable by ticket or magic ID.
- `modify_mt5_sl_tp(new_sl_price, new_tp_price, ticket=None, magic_id=None)`: Modifies both SL and TP for open positions.
- `get_live_trade_status(ticket=None, magic=None)`: Retrieves real-time status (profit, open price, volume, etc.) for live trades.
- `verify_trade_active(symbol: str, magic_id=None) -> bool`: Checks if an active position exists for a given symbol and magic ID.

### Closing Trades
- `close_position(symbols=None, ticket=None, magic_id=None)`: Closes positions. Iterates through multiple filling modes to ensure successful market closure, supporting filtering by symbol(s) and/or magic ID.

### Account & Risk Utilities
- `fetch_symbol_price(symbol)`: Fetches current bid and ask prices.
- `get_lot_size(symbol, stop_loss_price, risk_per_trade, trade_type)`: Calculates dynamic lot size based on a defined risk percentage, stop loss distance, and current account balance.
- `shutdown()`: Safely shuts down the MT5 connection.
