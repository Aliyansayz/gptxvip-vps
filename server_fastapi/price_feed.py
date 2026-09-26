import asyncio
import json
import re
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from starlette.concurrency import run_in_threadpool
import uvicorn
from utility.mt5_data_fetcher import DataFetcher, fetch_latest_tick

app = FastAPI()

# Store active connections to broadcast or manage them
active_connections = set()

async def live_price_stream(websocket: WebSocket, config: dict):
    """
    Background task that sends live ticks to the connected client.
    It reads 'latency_rate' from the config to determine update frequency.
    """
    symbol = config["symbol_id"]
    try:
        latency_rate_ms = int(config.get("latency_rate", 500))
    except (TypeError, ValueError):
        latency_rate_ms = 500
    latency_rate_ms = max(100, min(latency_rate_ms, 5000))
    sleep_time = latency_rate_ms / 1000.0
    last_epoch = None
    last_price = None

    try:
        while True:
            tick = await run_in_threadpool(fetch_latest_tick, symbol)
            bid = float(tick.bid or 0)
            ask = float(tick.ask or 0)
            current_price = (bid + ask) / 2 if bid and ask else float(tick.last or bid or ask)
            epoch_time = int(getattr(tick, "time_msc", 0) or (tick.time * 1000))

            # Avoid repeating the same stale broker tick as if it were new data.
            if epoch_time == last_epoch:
                await asyncio.sleep(sleep_time)
                continue
            last_epoch = epoch_time
            side = "buy" if int(tick.flags) & 32 else "sell" if int(tick.flags) & 64 else "unknown"
            volume = int(getattr(tick, "volume_real", 0) or getattr(tick, "volume", 0) or 0)

            tick_payload = {
                "type": "tick",
                "data": {
                    "price": current_price,
                    "old_price": last_price if last_price is not None else current_price,
                    "volume": volume,
                    "side": side,
                    "epoch": epoch_time,
                    "source": "mt5",
                    "symbol": symbol,
                }
            }

            await websocket.send_json(tick_payload)
            last_price = current_price
            await asyncio.sleep(sleep_time)

    except asyncio.CancelledError:
        # Task was cancelled (client disconnected)
        pass
    except Exception as e:
        print(f"Error in stream for {symbol}: {e}")
        try:
            await websocket.send_json({"type": "error", "message": "The broker feed is unavailable."})
            await websocket.close(code=1011)
        except Exception:
            pass

@app.websocket("/ws/market_feed")
async def websocket_market_feed(websocket: WebSocket):
    """
    Native WebSocket endpoint matching the frontend's `mt5_data_api/index.ts`
    """
    await websocket.accept()
    active_connections.add(websocket)
    stream_task = None
    
    try:
        # 1. Wait for the initial configuration message sent by frontend onopen
        initial_msg = await websocket.receive_text()
        config = json.loads(initial_msg)
        if not isinstance(config, dict):
            await websocket.send_json({"type": "error", "message": "A valid symbol_id is required."})
            await websocket.close(code=1008)
            return
        symbol = config.get("symbol_id")
        if not isinstance(symbol, str) or not symbol.strip() or len(symbol.strip()) > 64:
            await websocket.send_json({"type": "error", "message": "A valid symbol_id is required."})
            await websocket.close(code=1008)
            return
        config["symbol_id"] = symbol.strip()
        print(f"Client connected with config: {config}")

        # 2. Start the background streaming task based on the config
        stream_task = asyncio.create_task(live_price_stream(websocket, config))

        # 3. Listen for incoming messages (like the 30s ping from frontend)
        while True:
            msg_text = await websocket.receive_text()
            try:
                msg_data = json.loads(msg_text)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "WebSocket messages must contain valid JSON."})
                await websocket.close(code=1003)
                break

            if not isinstance(msg_data, dict):
                await websocket.send_json({"type": "error", "message": "WebSocket messages must be JSON objects."})
                await websocket.close(code=1003)
                break

            if msg_data.get("type") == "ping":
                # Frontend sends { "type": "ping" } every 30 seconds
                # You can respond with a pong if needed, or just ignore to keep connection alive
                # await websocket.send_json({"type": "pong"})
                pass

    except WebSocketDisconnect:
        print("Client disconnected")
    except (json.JSONDecodeError, TypeError):
        await websocket.close(code=1003)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.discard(websocket)
        if stream_task and not stream_task.done():
            stream_task.cancel()
            try:
                await stream_task
            except asyncio.CancelledError:
                pass


# --- REST route for fetching historical OHLC ---
@app.get("/api/historical_data")
async def get_historical_data(
    symbol: str = Query(..., min_length=1, max_length=64),
    limit: int = Query(300, ge=1, le=1000),
    time_interval: str = Query("1s", min_length=1, max_length=12),
):
    """
    REST endpoint to fetch initial OHLC candles for the chart.
    This should be called ONCE before connecting to the WebSocket.
    """
    symbol = symbol.strip()
    if not symbol:
        raise HTTPException(status_code=422, detail="A symbol is required")
    if not re.fullmatch(r"(?:0\.5(?:ms|s)|[1-9]\d*(?:ms|s|m|h|d|w))", time_interval.lower()):
        raise HTTPException(status_code=422, detail="Unsupported time_interval")

    try:
        fetcher = DataFetcher(primary_timeframe=time_interval)
        df = await run_in_threadpool(fetcher.fetch_data_primary, symbol, min(limit * 100, 100000))
        
        candles = []
        if df is None or df.empty:
            raise HTTPException(status_code=503, detail="No historical ticks are available for this symbol")

        df = df.tail(limit)
        for timestamp, row in df.iterrows():
            candles.append({
                "time": int(timestamp.timestamp()), # epoch in seconds
                "open": round(row["open"], 5),
                "high": round(row["high"], 5),
                "low": round(row["low"], 5),
                "close": round(row["close"], 5),
                "volume": int(row.get("volume", row.get("tick_volume", 0)))
            })
        
        return {"symbol": symbol, "data": candles}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching historical data: {e}")
        raise HTTPException(status_code=503, detail="Historical market data is unavailable") from e

if __name__ == "__main__":
    uvicorn.run("price_feed:app", host="0.0.0.0", port=8000, reload=True)
