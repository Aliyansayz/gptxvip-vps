import asyncio
import json
import random
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from utility.mt5_data_fetcher import DataFetcher

app = FastAPI()

# Store active connections to broadcast or manage them
active_connections = set()

async def live_price_stream(websocket: WebSocket, config: dict):
    """
    Background task that sends live ticks to the connected client.
    It reads 'latency_rate' from the config to determine update frequency.
    """
    symbol = config.get("symbol_id", "UNKNOWN")
    latency_rate_ms = config.get("latency_rate", 500)
    sleep_time = latency_rate_ms / 1000.0

    current_price = 100.0

    try:
        while True:
            # Generate simulated tick data
            old_price = current_price
            # Random walk for price
            current_price += random.uniform(-0.05, 0.05)
            current_price = round(current_price, 5)
            
            volume = random.randint(1, 50)
            side = random.choice(["buy", "sell"])
            epoch_time = int(time.time() * 1000) # Milliseconds timestamp

            tick_payload = {
                "type": "tick",
                "data": {
                    "price": current_price,
                    "old_price": old_price,
                    "volume": volume,
                    "side": side,
                    "epoch": epoch_time
                }
            }

            await websocket.send_json(tick_payload)
            await asyncio.sleep(sleep_time)

    except asyncio.CancelledError:
        # Task was cancelled (client disconnected)
        pass
    except Exception as e:
        print(f"Error in stream for {symbol}: {e}")

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
        print(f"Client connected with config: {config}")

        # 2. Start the background streaming task based on the config
        stream_task = asyncio.create_task(live_price_stream(websocket, config))

        # 3. Listen for incoming messages (like the 30s ping from frontend)
        while True:
            msg_text = await websocket.receive_text()
            msg_data = json.loads(msg_text)

            if msg_data.get("type") == "ping":
                # Frontend sends { "type": "ping" } every 30 seconds
                # You can respond with a pong if needed, or just ignore to keep connection alive
                # await websocket.send_json({"type": "pong"})
                pass

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
        if stream_task and not stream_task.done():
            stream_task.cancel()


# --- REST route for fetching historical OHLC ---
@app.get("/api/historical_data")
async def get_historical_data(symbol: str, limit: int = 300, time_interval:str= "1s"):
    """
    REST endpoint to fetch initial OHLC candles for the chart.
    This should be called ONCE before connecting to the WebSocket.
    """
    try:
        fetcher = DataFetcher(primary_timeframe=time_interval)
        # Fetching enough ticks to cover `limit` bars. 
        # A rough estimate: 100 ticks per minute. So limit * 100
        df = fetcher.fetch_data_primary(symbol, tick_count=limit * 100)
        
        candles = []
        if df is not None and not df.empty:
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
    except Exception as e:
        print(f"Error fetching historical data: {e}")
        return {"symbol": symbol, "data": []}



# --- Optional REST route for fetching historical OHLC ---
@app.get("/api/historical_data")
async def get_historical_data_random(symbol: str, limit: int = 300):
    """
    REST endpoint to fetch initial OHLC candles for the chart.
    This should be called ONCE before connecting to the WebSocket.
    """
    # Mock data generation
    candles = []
    base_price = 100.0
    now = int(time.time())
    for i in range(limit, 0, -1):
        open_p = base_price + random.uniform(-0.1, 0.1)
        high_p = open_p + random.uniform(0, 0.2)
        low_p = open_p - random.uniform(0, 0.2)
        close_p = open_p + random.uniform(-0.1, 0.1)
        
        candles.append({
            "time": now - (i * 60), # 1 minute intervals
            "open": round(open_p, 5),
            "high": round(high_p, 5),
            "low": round(low_p, 5),
            "close": round(close_p, 5),
            "volume": random.randint(100, 1000)
        })
        base_price = close_p
        
    return {"symbol": symbol, "data": candles}

if __name__ == "__main__":
    uvicorn.run("price_feed:app", host="0.0.0.0", port=8000, reload=True)
