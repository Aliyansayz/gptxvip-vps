# Partial Close Execution Example

This example demonstrates how to use `TradeExecutor` to open a trade and subsequently perform a partial close (e.g., closing 70% of the position while keeping the remaining 30% active).

It heavily utilizes the newly added `closepartialtrade` method, which automatically handles MetaTrader 5 broker constraints (like `volume_step` and `volume_min`) to ensure the leftover fraction is valid.

```python
if __name__ == "__main__":
    import time
    from mt5_trade_execute import TradeExecutor
    import MetaTrader5 as mt5

    # Initialize the MT5 Trade Executor
    trade_exec = TradeExecutor()
    trade_exec.initialize_mt5()

    symbol = "EURUSD"
    trade_type = 'buy'
    magic_id_demo = 12345678  # Predefined magic integer
    
    # We want to close 70% of the position
    partial_close_limit = 0.7 

    # Task A: Resolve Broker Symbol
    broker_symbol = trade_exec.get_broker_symbol(symbol)

    # Task B: Fetch Prices and Calculate Initial Stop Loss
    buy_price, sell_price = trade_exec.fetch_symbol_price(broker_symbol)
    entry_price = buy_price if trade_type == 'buy' else sell_price
    
    point = mt5.symbol_info(broker_symbol).point
    stop_loss_price = round(entry_price - 20 * point, mt5.symbol_info(broker_symbol).digits)

    # Task C: Define Lot Size
    # We explicitly set it to 0.03 lots to perfectly demonstrate the rounding logic
    # where exactly closing 70% is mathematically impossible due to step increments (0.01).
    lot_size = 0.03

    # Check if a trade is already active for this magic ID
    trade_status = trade_exec.verify_trade_active(symbol=broker_symbol, magic_id=magic_id_demo)
    
    if trade_status is False:
        
        # Task D: Open a new live trade
        print(f"Opening a new {trade_type} trade for {lot_size} lots...")
        trade_exec.open_mt5_live_trade_with_sl_tp_values(
            symbol=broker_symbol, 
            trade_type=trade_type, 
            sl_price=stop_loss_price, 
            sl_pips=None, 
            tp_pips=None, 
            lot_size=lot_size, 
            magic_id=magic_id_demo
        )
        
        # Wait a moment for the order to be processed
        time.sleep(2)

        # Task E: Verify Trade is Live
        status_list = trade_exec.get_live_trade_status(magic=magic_id_demo)
        if status_list and len(status_list) > 0:
            status = status_list[0]
            print(f"Trade opened successfully. Current Profit: {status['profit']}, Volume: {status['volume']}")

            print("Waiting 5 seconds before partial close...")
            time.sleep(5)

            # Task F: Execute Partial Close
            print(f"Executing partial close. Closing {partial_close_limit * 100}% of the trade...")
            closed_success, vol_closed, vol_kept = trade_exec.closepartialtrade(magic_id=magic_id_demo, symbol=broker_symbol, partial_limit=partial_close_limit)
            print(f"Partial close result -> Success: {closed_success}, Closed Volume: {vol_closed}, Kept Volume: {vol_kept}")

            time.sleep(2)

            # Task G: Verify Remaining Trade Volume
            new_status_list = trade_exec.get_live_trade_status(magic=magic_id_demo)
            if new_status_list and len(new_status_list) > 0:
                new_status = new_status_list[0]
                print(f"Partial close successful. Remaining active trade volume: {new_status['volume']}")
            else:
                print("Trade fully closed or not found.")
        else:
            print("Failed to find the newly opened live trade.")
```
