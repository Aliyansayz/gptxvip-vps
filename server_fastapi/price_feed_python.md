# Price Feed Architecture Explained

Based on your frontend code (`liveDataFetchMode.ts` and `mt5_data_api/index.ts`) and the backend reference (`server.md`), here is a complete explanation of how your price feed should be structured.

## 1. How to handle initial data vs. live data?

**The best practice is a two-step approach:**

1. **Initial History (OHLC All At Once):** 
   When the chart or trading dashboard first loads, you should fetch the last 100-300 candles **all at once** using a standard REST API (e.g., `GET /history?symbol=EURUSD`). This allows the chart library (like Lightweight Charts or TradingView) to render the history instantly. 
2. **Live Price Feed (Tick by Tick):**
   Immediately after the history is loaded, connect to the WebSocket (`ws://localhost:8000/ws/market_feed`). Over this socket, you send live price updates as they happen (e.g., every 0.5 seconds or per tick). 

**Why not send 300 candles over WebSocket?**
WebSockets are optimized for low-latency, continuous small streams of data. Sending a massive payload of historical data over the socket upon connection can cause lag and complicates the live-feed logic. Keep history on REST, and live updates on WebSockets.

## 2. Key observation about your Frontend vs. Backend

Your `server.md` example uses **Socket.IO** (`python-socketio`), which is a specific framework. 
However, your frontend (`mt5_data_api/index.ts`) uses **Native WebSockets**:
```typescript
this.ws = new WebSocket(this.url);
```
**This means your FastAPI backend should NOT use `python-socketio`.** Instead, it must use FastAPI's built-in `WebSocket` routing to be compatible with your frontend.

## 3. Frontend Data Contract

Your frontend sends this on connect:
```json
{
  "symbol_id": "...",
  "time_interval": "...",
  "time_frequency": "...",
  "latency_rate": 500
}
```
And it expects to receive live data in this format (`liveDataFetchMode.ts`):
```json
{
  "type": "tick",
  "data": {
    "price": 1.0543,
    "old_price": 1.0540,
    "volume": 12,
    "side": "buy",
    "epoch": 1678901234
  }
}
```

## 4. `price_feed.py` Implementation Overview

The provided `price_feed.py` script implements a native FastAPI WebSocket server that:
1. Listens on `/ws/market_feed`.
2. Accepts the connection and waits for the frontend's config message.
3. Spawns an asynchronous task to send live tick data matching the expected JSON format.
4. Correctly handles the 30-second `{"type": "ping"}` messages that your frontend sends.

You can run the script using `uvicorn price_feed:app --reload` to test it directly with your frontend.
