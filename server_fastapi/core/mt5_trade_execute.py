import MetaTrader5 as mt5


class MT5Symbols:
    """Utility class for resolving broker symbols in MetaTrader 5."""

    def __init__(self):
        self.symbols = []
        if self.initialize_mt5():
            self.symbols = mt5.symbols_get() or []

    def initialize_mt5(self):
        if not mt5.initialize():
            print("MetaTrader 5 initialization failed:", mt5.last_error())
            return False
        return True

    def get_broker_symbol(self, query: str):
        """
        Resolve broker symbol using description OR symbol name.

        Examples:
        - "Euro vs US Dollar" -> EURUSD
        - "EURUSD" -> EURUSD
        - "eur" -> EURUSD
        - "gold" -> XAUUSD

        :param query: Description or symbol text
        :return: Broker symbol name or None
        """
        query = query.lower().strip()

        exact_symbol = None
        exact_description = None
        partial_match = None

        for s in self.symbols:
            name = s.name.lower()
            desc = (s.description or "").lower()

            # Highest priority: exact symbol match
            if query == name:
                exact_symbol = s.name
                break

            # Second: exact description match
            if query == desc:
                exact_description = s.name

            # Third: partial match
            if query in name or query in desc:
                partial_match = s.name

        return exact_symbol or exact_description or partial_match






class TradeExecutor:
    """
    A class for executing trades in MetaTrader 5.
    """
    def __init__(self, lot_size=0.01, magic_id=None):
        self.mt5_initialized = False
        self.symbol = None
        self.lot_size = lot_size
        self.magic_id = magic_id

    def initialize_mt5(self):
        """Initialize MetaTrader 5 connection."""
        if not mt5.initialize():
            print("❌ Failed to initialize MetaTrader 5")
            return False
        self.mt5_initialized = True
        return True


    def _validate_symbol_info(self, symbol):
            """Validate and prepare symbol for trading."""
            sinfo = mt5.symbol_info(symbol)
            if sinfo is None:
                print(f"❌ Symbol info not available for {symbol}")
                return None

            # Ensure symbol is visible in Market Watch
            if not getattr(sinfo, 'visible', False):
                if not mt5.symbol_select(symbol, True):
                    print(f"⚠️ Could not select symbol {symbol}")

            return sinfo

    def _normalize_volume(self, volume, sinfo):
        """Normalize volume according to broker constraints."""
        vol_min = getattr(sinfo, 'volume_min', 0.01) or 0.01
        vol_step = getattr(sinfo, 'volume_step', 0.01) or 0.01

        if volume < vol_min:
            return vol_min

        # Quantize to valid step
        steps = int((volume - vol_min) / vol_step)
        normalized = vol_min + steps * vol_step
        return round(normalized, 2)


    def open_mt5_live_trade(self, symbol, trade_type='long', sl_pips=100, lot_size=0.1, magic_id=None):
            """
            Open a live trade with pip-based SL/TP and magic ID support.
            """
            if not self.mt5_initialized:
                if not self.initialize_mt5():
                    return False

            sinfo = self._validate_symbol_info(symbol)
            if not sinfo:
                return False

            tick = mt5.symbol_info_tick(symbol)
            if not tick:
                print(f"❌ Cannot get market tick for {symbol}")
                return False

            price = tick.ask if trade_type == "long" else tick.bid
            order_type = mt5.ORDER_TYPE_BUY if trade_type == "long" else mt5.ORDER_TYPE_SELL

            volume = lot_size
            volume = self._normalize_volume(volume, sinfo)

            point = getattr(sinfo, 'point', 0.00001)
            digits = getattr(sinfo, 'digits', 5) or 5

            sl_offset = (sl_pips or 20) * point
            # tp_offset = (tp_pips or 20) * point

            if trade_type == "long":
                sl_price = price - sl_offset
                # tp_price = price + tp_offset
            else:
                sl_price = price + sl_offset
                # tp_price = price - tp_offset

            sl_price, tp_price = self._enforce_stop_distance(sinfo, tick, trade_type, sl_price, tp_price)

            price = round(price, digits)
            sl_price = round(sl_price, digits) if sl_price else None
            tp_price = round(tp_price, digits) if tp_price else None

            magic_number = magic_id if magic_id is not None else self._get_magic_number()

            base_request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": volume,
                "type": order_type,
                "price": price,
                "sl": sl_price,
                "tp": tp_price,
                "deviation": 20,
                "magic": magic_number,
                "comment": f"Python trade {trade_type}",
                "type_time": mt5.ORDER_TIME_GTC,
            }

            success, result = self._try_order_with_filling_modes(base_request, sinfo)

            if not success:
                if result:
                    retcode = getattr(result, 'retcode', 'unknown')
                    comment = getattr(result, 'comment', 'no comment')
                    print(f"❌ Failed to place order for {self.symbol}. retcode={retcode}, comment={comment}")
                else:
                    print(f"❌ Failed to place order for {self.symbol}. mt5.order_send() returned None. last_error={mt5.last_error()}")

            return success


    def open_mt5_live_trade_with_sl_tp_values(self, symbol=None, trade_type='buy', sl_pips=None, tp_pips=None,  sl_price=None, tp_price=None, lot_size=None, magic_id=None):
        """
        Open a live trade with explicit SL/TP price values and magic ID support.
        """
        symbol = symbol or self.symbol
        if not self.mt5_initialized:
            if not self.initialize_mt5():
                return False

        sinfo = self._validate_symbol_info(symbol)
        if not sinfo:
            return False

        tick = mt5.symbol_info_tick(symbol)
        if not tick:
            print(f"❌ Cannot get market tick for {symbol}")
            return False

        price = tick.ask if trade_type == "buy" else tick.bid
        order_type = mt5.ORDER_TYPE_BUY if trade_type == "buy" else mt5.ORDER_TYPE_SELL

        volume = lot_size or self.lot_size
        volume = self._normalize_volume(volume, sinfo)

        digits = getattr(sinfo, 'digits', 5) or 5
        price = round(price, digits)
        point = mt5.symbol_info(symbol).point

        if sl_pips is not None:
            sl_offset = (sl_pips or 20) * point
            if trade_type == "long":
                sl_price = price - sl_offset
            else:
                sl_price = price + sl_offset

        if tp_pips is not None:
            tp_offset = (tp_pips or 20) * point
            if trade_type == "long":
                tp_price = price + tp_offset
            else:
                tp_price = price - tp_offset
        

        sl_price = round(sl_price, digits) if sl_price else None
        tp_price = round(tp_price, digits) if tp_price else None

        magic_number = magic_id if magic_id is not None else self._get_magic_number()



        base_request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": volume,
            "type": order_type,
            "price": price,
            # "sl": sl_price,
            # "tp": tp_price,
            "deviation": 20,
            "magic": magic_number,
            "comment": f"Python trade {trade_type}",
            "type_time": mt5.ORDER_TIME_GTC,
        }
        
        if sl_price is not None: base_request.update({ "sl": sl_price })

        if tp_price is not None: base_request.update({"tp": tp_price})

        success, result = self._try_order_with_filling_modes(base_request, sinfo)
        if not success:
            if result:
                retcode = getattr(result, 'retcode', 'unknown')
                comment = getattr(result, 'comment', 'no comment')
                print(f"❌ Failed to place order for {symbol}. retcode={retcode}, comment={comment}")
            else:
                print(f"❌ Failed to place order for {symbol}. mt5.order_send() returned None. last_error={mt5.last_error()}")

        return success
    
    def add_magic_id(self, magic_id):
        """Add magic ID to tracked list."""
        normalized_id = self._normalize_magic_id(magic_id)
        # if normalized_id not in self.strategy_active_trades_magic_ids:
        #     self.strategy_active_trades_magic_ids.append(normalized_id)

    def _try_order_with_filling_modes(self, base_request, sinfo):
        """Try order with multiple filling modes."""

        # Determine filling mode preference
        ex_mode = getattr(sinfo, 'trade_exemode', None)
        candidates = []

        if ex_mode in (2, 3):  # Market/Exchange
            candidates = [mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK, mt5.ORDER_FILLING_RETURN]
        elif ex_mode in (0, 1):  # Request/Instant
            candidates = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]
        else:
            candidates = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]

        # Try broker's preferred mode first
        preferred = getattr(sinfo, 'filling_mode', None)
        if preferred and preferred in candidates:
            candidates.remove(preferred)
            candidates.insert(0, preferred)

        last_result = None
        for mode in candidates:
            request = dict(base_request)
            request["type_filling"] = mode
            result = mt5.order_send(request)
            last_result = result

            if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                mode_name = {
                    mt5.ORDER_FILLING_RETURN: "RETURN",
                    mt5.ORDER_FILLING_IOC: "IOC",
                    mt5.ORDER_FILLING_FOK: "FOK"
                }.get(mode, str(mode))

                ticket = getattr(result, 'order', None)
                print(f"✅ Order placed for {self.symbol} with filling {mode_name}: Ticket {ticket}")

                # Handle magic ID tracking
                magic_added = request.get('magic', None)
                if magic_added is None:
                    magic_added = self._get_magic_number()
                magic_added = self._normalize_magic_id(magic_added)
                self.add_magic_id(magic_added)
                return True, result

        # Final fallback without explicit filling
        request = dict(base_request)
        if 'type_filling' in request:
            del request['type_filling']

        result = mt5.order_send(request)
        if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
            ticket = getattr(result, 'order', None)
            print(f"✅ Order placed for {self.symbol} without explicit filling mode: Ticket {ticket}")

            magic_added = request.get('magic', None)
            if magic_added is None:
                magic_added = self._get_magic_number()
            magic_added = self._normalize_magic_id(magic_added)
            self.add_magic_id(magic_added)
            return True, result

        return False, last_result or result


    # SL/TP modification methods
    def update_stop_loss(self, symbol, new_sl_price, ticket=None, magic_id=None):
        """Update stop loss for positions with magic ID support."""
        symbol = symbol or self.symbol
        positions = mt5.positions_get()
        if not positions:
            print("No open positions to update.")
            return False

        updated = False
        target_positions = []

        if magic_id is not None:
            n_magic = self._normalize_magic_id(magic_id)
            target_positions = [p for p in positions if getattr(p, 'magic', None) == n_magic and (ticket is None or p.ticket == ticket)]
        else:
            target_positions = [p for p in positions if p.symbol == symbol and (ticket is None or p.ticket == ticket)]

        for position in target_positions:
            
            request = {
                "action": mt5.TRADE_ACTION_SLTP,
                "position": position.ticket,
                "sl": new_sl_price,
                "tp": position.tp,
                "symbol": position.symbol,
                "magic": position.magic,
                "comment": "SL updated by script",
            }
            
            result = mt5.order_send(request)
            if result is None:
                print(f"❌ update_stop_loss: mt5.order_send returned None. last_error={mt5.last_error()}")
                continue

            if getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                print(f"✅ Stop loss updated for {position.symbol}, Ticket: {position.ticket}")
                updated = True
            else:
                retcode = getattr(result, 'retcode', 'unknown')
                comment = getattr(result, 'comment', 'no comment')
                print(f"❌ Failed to update SL for {position.symbol}. retcode={retcode}, comment={comment}")

        return updated


    def get_live_trade_status(self, ticket: int = None, magic: int = None):
    
        """
        Returns live trade status by ticket or magic number.
        """

        if not self.mt5_initialized:
            if not self.initialize_mt5():
                return {"error": "MT5 not initialized"}

        if ticket is None and magic is None:
            return {"error": "Provide either ticket or magic"}

        # Fetch positions
        if ticket is not None:
            positions = mt5.positions_get(ticket=ticket)
        else:
            positions = mt5.positions_get(magic=magic)

        if not positions:
            return {"status": "No active position found"}

        results = []

        for pos in positions:
            trade_info = {
                "symbol": pos.symbol,
                "ticket": pos.ticket,
                "magic": pos.magic,
                "type": "BUY" if pos.type == mt5.POSITION_TYPE_BUY else "SELL",
                "volume": pos.volume,
                "open_price": pos.price_open,
                "current_price": pos.price_current,
                "profit": pos.profit,
                "swap": pos.swap,
                # "commission": pos.commission,
                "total_profit": pos.profit + pos.swap, #+ pos.commission,
                "time_open": pos.time
            }
        

            results.append(trade_info)

        return results


    def modify_mt5_sl_tp(self, new_sl_price=None, new_tp_price=None, ticket=None, magic_id=None):
        """Modify both stop loss and take profit with magic ID support."""
        positions = mt5.positions_get()
        if not positions:
            print("No open positions to modify.")
            return False

        modified = False
        target_positions = []

        if magic_id is not None:
            n_magic = self._normalize_magic_id(magic_id)
            target_positions = [p for p in positions if getattr(p, 'magic', None) == n_magic and (ticket is None or p.ticket == ticket)]
        else:
            target_positions = [p for p in positions if p.symbol == self.symbol and (ticket is None or p.ticket == ticket)]

        for position in target_positions:
            request = {
                "action": mt5.TRADE_ACTION_SLTP,
                "position": position.ticket,
                "sl": new_sl_price if new_sl_price is not None else position.sl,
                "tp": new_tp_price if new_tp_price is not None else position.tp,
                "symbol": position.symbol,
                "magic": position.magic,
                "comment": "SL/TP modified by script",
            }

            result = mt5.order_send(request)
            if result is None:
                print(f"❌ modify_mt5_sl_tp: mt5.order_send returned None. last_error={mt5.last_error()}")
                continue

            if getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                print(f"✅ SL/TP modified for {self.symbol}, Ticket: {position.ticket}")
                modified = True
            else:
                retcode = getattr(result, 'retcode', 'unknown')
                comment = getattr(result, 'comment', 'no comment')
                print(f"❌ Failed to modify SL/TP for {self.symbol}. retcode={retcode}, comment={comment}")

        return modified



    # def _try_order_with_filling_modes(self, base_request, sinfo):
    #         """Try order with multiple filling modes."""

    #         # Determine filling mode preference
    #         ex_mode = getattr(sinfo, 'trade_exemode', None)
    #         candidates = []

    #         if ex_mode in (2, 3):  # Market/Exchange
    #             candidates = [mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK, mt5.ORDER_FILLING_RETURN]
    #         elif ex_mode in (0, 1):  # Request/Instant
    #             candidates = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]
    #         else:
    #             candidates = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]

    #         # Try broker's preferred mode first
    #         preferred = getattr(sinfo, 'filling_mode', None)
    #         if preferred is not None and preferred in candidates:
    #             candidates.remove(preferred)
    #             candidates.insert(0, preferred)

            
    #         last_result = None
    #         for mode in candidates:
    #             request = dict(base_request)
    #             request["type_filling"] = mode
    #             result = mt5.order_send(request)
    #             last_result = result

    #             if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
    #                 mode_name = {
    #                     mt5.ORDER_FILLING_RETURN: "RETURN",
    #                     mt5.ORDER_FILLING_IOC: "IOC",
    #                     mt5.ORDER_FILLING_FOK: "FOK"
    #                 }.get(mode, str(mode))

    #                 ticket = getattr(result, 'order', None)
    #                 print(f"✅ Order placed for {symbol} with filling {mode_name}: Ticket {ticket}")

    #                 # Handle magic ID tracking
    #                 # magic_added = request.get('magic', None)
    #                 # if magic_added is None:
    #                 #     magic_added = self._get_magic_number()
                    
    #                 magic_added = self._normalize_magic_id(magic_added)
    #                 self.add_magic_id(magic_added)
    #                 return True, result

    #         # Final fallback without explicit filling
    #         request = dict(base_request)
    #         if 'type_filling' in request:
    #             del request['type_filling']

    #         result = mt5.order_send(request)
    #         if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
    #             ticket = getattr(result, 'order', None)
    #             print(f"✅ Order placed for {symbol} without explicit filling mode: Ticket {ticket}")

    #             magic_added = request.get('magic', None)
    #             if magic_added is None:
    #                 magic_added = self._get_magic_number()
    #             magic_added = self._normalize_magic_id(magic_added)
    #             self.add_magic_id(magic_added)
    #             return True, result

    #         return False, last_result or result


    # Magic ID management methods
    def _normalize_magic_id(self, magic_id):
        """Normalize magic_id to an integer (accepts int, numeric string or arbitrary string)."""
        if magic_id is None:
            return None
        if isinstance(magic_id, int):
            return magic_id
        try:
            return int(magic_id)
        except Exception:
            return abs(hash(str(magic_id))) % 1000000


    def remove_magic_id(self, magic_id):
        """Remove magic ID from tracked list."""
        try:
            normalized_id = self._normalize_magic_id(magic_id)
            if normalized_id in self.strategy_active_trades_magic_ids:
                self.strategy_active_trades_magic_ids.remove(normalized_id)
        except Exception as e:
            print(f"⚠️ Error removing magic ID: {e}")

    def close_position(self, symbols=None, ticket=None, magic_id=None):
        """Close positions with multiple filling mode attempts. Supports filtering by symbol(s) and/or magic_id."""
        if symbols is None and magic_id is None:
            symbols = [self.symbol]

        positions = mt5.positions_get()
        if not positions:
            print("No open positions to close.")
            return False

        if magic_id is not None:
            n_magic = magic_id # self._normalize_magic_id(magic_id)
            target_positions = [p for p in positions if getattr(p, 'magic', None) == n_magic and (ticket is None or p.ticket == ticket) ]

        else:
            target_positions = [p for p in positions if p.symbol == self.symbol and (ticket is None or p.ticket == ticket)]


        closed_any = False
        for position in target_positions:
            # Filter by symbol(s) and/or magic_id
            match_symbol = symbols is None or position.symbol in symbols
            match_magic  = magic_id is None or self._normalize_magic_id(position.magic) == self._normalize_magic_id(magic_id)
            if match_symbol and match_magic:
                close_type = mt5.ORDER_TYPE_SELL if position.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
                tick = mt5.symbol_info_tick(position.symbol)
                if not tick:
                    print(f"⚠️ Cannot get tick for {position.symbol}")
                    continue

                price = tick.bid if position.type == mt5.ORDER_TYPE_BUY else tick.ask

                base_request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": position.symbol,
                    "volume": position.volume,
                    "type": close_type,
                    "position": position.ticket,
                    "price": price,
                    "deviation": 20,
                }

                fill_modes = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]
                closed = False
                last_result = None

                for mode in fill_modes:
                    request = dict(base_request)
                    request["type_filling"] = mode
                    result = mt5.order_send(request)
                    last_result = result

                    if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                        mode_name = {
                            mt5.ORDER_FILLING_RETURN: "RETURN",
                            mt5.ORDER_FILLING_IOC: "IOC",
                            mt5.ORDER_FILLING_FOK: "FOK"
                        }.get(mode, str(mode))
                        print(f"✅ Position {position.ticket} for {position.symbol} closed with filling {mode_name}")
                        self.remove_magic_id(position.magic)
                        closed = True
                        closed_any = True
                        break

                if not closed:
                    request = dict(base_request)
                    result = mt5.order_send(request)
                    if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                        print(f"✅ Position {position.ticket} for {position.symbol} closed without explicit filling")
                        self.remove_magic_id(position.magic)
                        closed_any = True
                    else:
                        if result:
                            retcode = getattr(result, 'retcode', 'unknown')
                            comment = getattr(result, 'comment', 'no comment')
                            print(f"❌ Failed to close position {position.ticket} for {position.symbol}. retcode={retcode}, comment={comment}")
                        else:
                            print(f"❌ Failed to close position {position.ticket}. mt5.order_send() returned None. last_error={mt5.last_error()}")

        return closed_any


    def ispartialtradeeligible(self, lot_size_close, lot_size_keep, actual_lot_size, symbol=None):
        symbol = symbol or self.symbol
        sinfo = mt5.symbol_info(symbol)
        if not sinfo:
            return False
            
        vol_min = getattr(sinfo, 'volume_min', 0.01) or 0.01
        vol_step = getattr(sinfo, 'volume_step', 0.01) or 0.01
        
        # Must sum up correctly
        if round(lot_size_close + lot_size_keep, 5) != round(actual_lot_size, 5):
            return False
            
        # Check close eligibility
        if lot_size_close < vol_min:
            return False
        
        # Check keep eligibility
        if lot_size_keep > 0 and lot_size_keep < vol_min:
            return False
            
        # Check steps
        close_steps = round(lot_size_close / vol_step, 5)
        if abs(close_steps - round(close_steps)) > 1e-4:
            return False
            
        if lot_size_keep > 0:
            keep_steps = round(lot_size_keep / vol_step, 5)
            if abs(keep_steps - round(keep_steps)) > 1e-4:
                return False
                
        return True

    def adjustpartialtradelotsizes(self, actual_lot_size, lot_size_close, lot_size_keep, partial_limit, symbol=None):
        symbol = symbol or self.symbol
        sinfo = mt5.symbol_info(symbol)
        if not sinfo:
            return None, None
            
        vol_min = getattr(sinfo, 'volume_min', 0.01) or 0.01
        vol_step = getattr(sinfo, 'volume_step', 0.01) or 0.01
        import math
        
        # Calculate ideal keep
        ideal_keep = actual_lot_size * (1.0 - partial_limit)
        
        # Ceiling keep to next volume step
        adjusted_keep = math.ceil(ideal_keep / vol_step) * vol_step
        
        # Ensure keep is at least vol_min (if we are trying to keep anything)
        if adjusted_keep < vol_min and ideal_keep > 0:
            adjusted_keep = vol_min
            
        # Now derive close
        adjusted_close = actual_lot_size - adjusted_keep
        
        # Rounding to correct precision
        digits = 2  # usually 2 for lot sizes
        if vol_step == 0.001: digits = 3
        elif vol_step == 0.01: digits = 2
        elif vol_step == 0.1: digits = 1
        
        adjusted_close = round(adjusted_close, digits)
        adjusted_keep = round(adjusted_keep, digits)
        
        # Check if close is eligible
        if adjusted_close < vol_min:
            return None, None
            
        return adjusted_close, adjusted_keep

    def closepartialtrade(self, magic_id, symbol, partial_limit):
        if not self.mt5_initialized:
            if not self.initialize_mt5():
                return False, 0.0, 0.0

        positions = mt5.positions_get()
        if not positions:
            print("No open positions to close.")
            return False, 0.0, 0.0

        n_magic = self._normalize_magic_id(magic_id)
        target_positions = [p for p in positions if getattr(p, 'magic', None) == n_magic and p.symbol == symbol]

        closed_any = False
        total_closed = 0.0
        total_kept = 0.0
        
        for position in target_positions:
            actual_lot_size = position.volume
            
            # Target sizes
            ideal_lot_size_close = actual_lot_size * partial_limit
            ideal_lot_size_keep = actual_lot_size - ideal_lot_size_close
            
            # Check eligibility
            if self.ispartialtradeeligible(ideal_lot_size_close, ideal_lot_size_keep, actual_lot_size, symbol):
                adj_close = ideal_lot_size_close
                adj_keep = ideal_lot_size_keep
            else:
                # Adjust sizes
                adj_close, adj_keep = self.adjustpartialtradelotsizes(
                    actual_lot_size, ideal_lot_size_close, ideal_lot_size_keep, partial_limit, symbol
                )
                
                if adj_close is None or adj_keep is None:
                    print(f"❌ Cancel process: Could not find eligible partial close lot sizes for {symbol} Ticket {position.ticket}.")
                    continue
                    
                if not self.ispartialtradeeligible(adj_close, adj_keep, actual_lot_size, symbol):
                    print(f"❌ Cancel process: Adjusted sizes ({adj_close}, {adj_keep}) still not eligible for {symbol}.")
                    continue

            # Send close order
            close_type = mt5.ORDER_TYPE_SELL if position.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
            tick = mt5.symbol_info_tick(position.symbol)
            if not tick:
                print(f"⚠️ Cannot get tick for {position.symbol}")
                continue

            price = tick.bid if position.type == mt5.ORDER_TYPE_BUY else tick.ask

            base_request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": position.symbol,
                "volume": adj_close,
                "type": close_type,
                "position": position.ticket,
                "price": price,
                "deviation": 20,
            }

            fill_modes = [mt5.ORDER_FILLING_RETURN, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_FOK]
            closed = False

            for mode in fill_modes:
                request = dict(base_request)
                request["type_filling"] = mode
                result = mt5.order_send(request)

                if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                    mode_name = {
                        mt5.ORDER_FILLING_RETURN: "RETURN",
                        mt5.ORDER_FILLING_IOC: "IOC",
                        mt5.ORDER_FILLING_FOK: "FOK"
                    }.get(mode, str(mode))
                    print(f"✅ Partial Position {position.ticket} for {position.symbol} closed with filling {mode_name}. Closed {adj_close}, Kept {adj_keep}")
                    closed = True
                    closed_any = True
                    total_closed += adj_close
                    total_kept += adj_keep
                    break

            if not closed:
                request = dict(base_request)
                result = mt5.order_send(request)
                if result and getattr(result, 'retcode', None) == getattr(mt5, 'TRADE_RETCODE_DONE', 10009):
                    print(f"✅ Partial Position {position.ticket} for {position.symbol} closed without explicit filling. Closed {adj_close}, Kept {adj_keep}")
                    closed_any = True
                    total_closed += adj_close
                    total_kept += adj_keep
                else:
                    retcode = getattr(result, 'retcode', 'unknown') if result else 'unknown'
                    comment = getattr(result, 'comment', 'no comment') if result else mt5.last_error()
                    print(f"❌ Failed to partial close position {position.ticket} for {position.symbol}. retcode={retcode}, comment={comment}")

        return closed_any, total_closed, total_kept


    def fetch_symbol_price(self, symbol: str):

        symbol = self.get_broker_symbol(symbol)
        tick = mt5.symbol_info_tick(symbol)
        if not tick:
            error_msg = "Cannot get market tick data"
            print(f"❌ {error_msg}")
            return None, None

        buy_price = tick.ask
        sell_price = tick.bid

        return buy_price, sell_price


    def get_lot_size(self, symbol, stop_loss_price, risk_per_trade=0.005, trade_type='buy'):
        
        symbol = self.get_broker_symbol(symbol)

        entry_price = None
        buy_price, sell_price = self.fetch_symbol_price(symbol)
        

        if trade_type.lower() == 'buy':
            entry_price = buy_price
        elif trade_type.lower() == 'sell':
            entry_price = sell_price
        if entry_price is None:
            tick = mt5.symbol_info_tick(symbol)
            entry_price = tick.ask

        symbol_info  = mt5.symbol_info(symbol)
        account_info = mt5.account_info()
        balance = account_info.balance 
        sl_distance_points = abs(stop_loss_price - entry_price)

        tick_value = symbol_info.trade_tick_value
        tick_size = symbol_info.trade_tick_size
        risk_amount =  balance * risk_per_trade
        point =  symbol_info.point
        # tick_value = tick_info['tick_value']
        # tick_size  = tick_info['tick_size']
        # risk_amount = tick_info['risk_amount']
        # print("risk_amount", risk_amount)
        value_per_point_per_lot = tick_value / tick_size
        lot_size = risk_amount / (sl_distance_points * value_per_point_per_lot)
        lot_size = round(lot_size, 2)  # Round to 2 decimals (common for Forex)
        return lot_size


    def get_account_balance(self):

        symbol = self.mt5_symbol.get_broker_symbol(symbol)
        symbol_info  = mt5.symbol_info(symbol)
        account_info = mt5.account_info()
        balance = account_info.balance
        return balance
        
    def get_broker_symbol(self, query: str):
            """
            Resolve broker symbol using description OR symbol name.

            Examples:
            - "Euro vs US Dollar" -> EURUSD
            - "EURUSD" -> EURUSD
            - "eur" -> EURUSD
            - "gold" -> XAUUSD

            :param query: Description or symbol text
            :return: Broker symbol name or None
            """
            query = query.lower().strip()

            exact_symbol = None
            exact_description = None
            partial_match = None

            for s in mt5.symbols_get(): #mt5.symbols:
                name = s.name.lower()
                desc = (s.description or "").lower()

                # Highest priority: exact symbol match
                if query == name:
                    exact_symbol = s.name
                    break

                # Second: exact description match
                if query == desc:
                    exact_description = s.name

                # Third: partial match
                if query in name or query in desc:
                    partial_match = s.name

            return exact_symbol or exact_description or partial_match

    def _enforce_stop_distance(self, sinfo, tick, trade_type, sl_price, tp_price):
        """
        Enforce broker minimum stop distance requirements.
        """
        point = getattr(sinfo, 'point', 0.00001)
        stops_level_pts = getattr(sinfo, 'trade_stops_level', 0) or 0
        min_distance = stops_level_pts * point

        if not min_distance or min_distance == 0:
            min_distance = 0.00050  # 5 pips default safety for 5-digit FX

        digits = getattr(sinfo, 'digits', 5) or 5
        bid = getattr(tick, 'bid', None)
        ask = getattr(tick, 'ask', None)

        try:
            if trade_type == 'buy':
                if sl_price is not None and bid is not None:
                    max_allowed_sl = bid - min_distance
                    sl_price = min(sl_price, max_allowed_sl)

                if tp_price is not None and ask is not None:
                    min_allowed_tp = ask + min_distance
                    tp_price = max(tp_price, min_allowed_tp)

            else:  # sell
                if sl_price is not None and ask is not None:
                    min_allowed_sl = ask + min_distance
                    sl_price = max(sl_price, min_allowed_sl)

                if tp_price is not None and bid is not None:
                    max_allowed_tp = bid - min_distance
                    tp_price = min(tp_price, max_allowed_tp)

            if sl_price is not None:
                sl_price = round(sl_price, digits)
            if tp_price is not None:
                tp_price = round(tp_price, digits)

        except Exception as e:
            print(f"⚠️ Warning: Failed to apply stop distance enforcement: {e}")

        return sl_price, tp_price


    # Trade verification methods
    def verify_trade_active(self, symbol: str, magic_id=None) -> bool:
        """
        Check whether there's an active position for the given symbol and magic_id.
        Returns True if at least one matching position exists, False otherwise.
        """
        try:
            if symbol is None:
                return False

            if magic_id is None:
                positions = mt5.positions_get(symbol=symbol)
                return bool(positions)

            n_magic = self._normalize_magic_id(magic_id)
            positions = mt5.positions_get(symbol=symbol)
            if not positions:
                return False

            for pos in positions:
                if getattr(pos, 'magic', None) == n_magic:
                    return True
            return False
        except Exception as e:
            print(f"❌ Error verifying active trade: {e}")
            return False

    def shutdown(self):
        """Shutdown MT5 connection."""
        try:
            mt5.shutdown()
            self.mt5_initialized = False
            print("✅ MT5 connection shut down")
        except Exception as e:
            print(f"⚠️ Error during MT5 shutdown: {e}")


# if __name__ == "__main__":
#     import time


# if __name__ == "__main__":
#     import time

#     trade_exec = TradeExecutor()
#     trade_exec.initialize_mt5()

#     symbol = "EURUSD" #"AUDUSD" #"EURUSD" #"GBPUSD" #"EURUSD"
#     lot_size = 0.01
#     strategy_id = 'playground_demo_v2'
#     trade_type = 'buy'
#     magic_id_demo =  12345678  # Predefined magic integer

#     # Task A
#     broker_symbol = trade_exec.get_broker_symbol(symbol)

#     # Task B
#     buy_price, sell_price = trade_exec.fetch_symbol_price(broker_symbol)
#     entry_price = buy_price if trade_type == 'buy' else sell_price
#     stop_loss_price = entry_price + 0.0010 if trade_type == 'buy' else entry_price - 0.0010
#     point = mt5.symbol_info(broker_symbol).point
#     stop_loss_price = round(entry_price - 20 * point, mt5.symbol_info(broker_symbol).digits)


#     # Task C
#     lot_size =  trade_exec.get_lot_size(symbol, stop_loss_price, risk_per_trade=0.005, trade_type=trade_type)

#     trade_status = trade_exec.verify_trade_active(symbol=broker_symbol, magic_id=magic_id_demo)
    
#     if trade_status is False:
            
#             # Task D
#             trade_exec.open_mt5_live_trade_with_sl_tp_values(symbol=broker_symbol, trade_type='buy', sl_price=stop_loss_price, sl_pips=None, tp_pips=None, lot_size=lot_size, magic_id=magic_id_demo)
#             time.sleep(1)

#             current_price = mt5.symbol_info_tick(broker_symbol).bid
#             point = mt5.symbol_info(broker_symbol).point
            
#             new_sl = round(current_price - 30 * point, mt5.symbol_info(broker_symbol).digits)
#             print(f"Updating stop loss to {new_sl} using inbuilt method...")
            
#             # Task E
#             updated = trade_exec.update_stop_loss(new_sl_price=new_sl, symbol=broker_symbol, magic_id=magic_id_demo)
#             # print(f"Stop loss update result: {updated}")
#             time.sleep(10)
#             print("Closing position using inbuilt method...")

#             status_list =  trade_exec.get_live_trade_status(magic=magic_id_demo)
#             status = status_list[0]
#             print("Profit is :-",status['profit'])


#             # Task F
#             trade_exec.close_position(symbols=[broker_symbol])
