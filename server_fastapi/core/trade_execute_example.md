


```python
if __name__ == "__main__":
    import time

    trade_exec = TradeExecutor()
    trade_exec.initialize_mt5()

    symbol = "EURUSD" #"AUDUSD" #"EURUSD" #"GBPUSD" #"EURUSD"
    lot_size = 0.01
    strategy_id = 'playground_demo_v2'
    trade_type = 'buy'
    magic_id_demo =  12345678  # Predefined magic integer

    # Task A
    broker_symbol = trade_exec.get_broker_symbol(symbol)

    # Task B
    buy_price, sell_price = trade_exec.fetch_symbol_price(broker_symbol)
    entry_price = buy_price if trade_type == 'buy' else sell_price
    stop_loss_price = entry_price + 0.0010 if trade_type == 'buy' else entry_price - 0.0010
    point = mt5.symbol_info(broker_symbol).point
    stop_loss_price = round(entry_price - 20 * point, mt5.symbol_info(broker_symbol).digits)


    # Task C
    lot_size =  trade_exec.get_lot_size(symbol, stop_loss_price, risk_per_trade=0.005, trade_type=trade_type)

    trade_status = trade_exec.verify_trade_active(symbol=broker_symbol, magic_id=magic_id_demo)
    
    if trade_status is False:
            
            # Task D
            trade_exec.open_mt5_live_trade_with_sl_tp_values(symbol=broker_symbol, trade_type='buy', sl_price=stop_loss_price, sl_pips=None, tp_pips=None, lot_size=lot_size, magic_id=magic_id_demo)
            time.sleep(1)

            current_price = mt5.symbol_info_tick(broker_symbol).bid
            point = mt5.symbol_info(broker_symbol).point
            
            new_sl = round(current_price - 30 * point, mt5.symbol_info(broker_symbol).digits)
            print(f"Updating stop loss to {new_sl} using inbuilt method...")
            
            # Task E
            updated = trade_exec.update_stop_loss(new_sl_price=new_sl, symbol=broker_symbol, magic_id=magic_id_demo)
            # print(f"Stop loss update result: {updated}")
            time.sleep(10)
            print("Closing position using inbuilt method...")

            status_list =  trade_exec.get_live_trade_status(magic=magic_id_demo)
            status = status_list[0]
            print("Profit is :-",status['profit'])


            # Task F
            trade_exec.close_position(symbols=[broker_symbol])

```