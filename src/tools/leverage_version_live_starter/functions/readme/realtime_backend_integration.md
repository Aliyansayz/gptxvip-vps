# Real-Time Integration Guide: Frontend with Python Backend (Flask / FastAPI)

This guide outlines how to replace the client-side local data simulation in **Leverage Trading Version 3** with a real-time Python backend (using FastAPI or Flask).

To achieve the required **500 millisecond latency** reliably, we use WebSockets. When the user sets the mode to **'Live Market Feed'** inside **Data Layer Config -> Data Settings**, the frontend will negotiate a connection using specific parameters (`symbol_id`, `time_interval`, `time_frequency`, and `latency_rate`), and the backend will start streaming data directly into the `alpha` data source.

## 1. System Architecture

```text
  +-------------------------------------------------------------+
  |               PYTHON BACKEND (FastAPI / Flask)              |
  |                                                             |
  |  +-------------------+        +--------------------------+  |
  |  | WebSocket Router  | <----> |   Live Feed Engine       |  |
  |  +---------+---------+        |  (500ms loop & latency)  |  |
  +------------|------------------+------------+-------------+--+
               |                               ^
               | WebSockets (500ms Updates)    | Config: symbol_id, interval, 
               v                               | frequency, latency_rate (500ms)
  +------------+-------------------------------+----------------+
  |            FRONTEND ('alpha' Data Source inside V3)         |
  |                                                             |
  |   - Mode: 'Live Market Feed'                                |
  |   - simulated_aggregate_alpha.ts processes inbound ticks    |
  +-------------------------------------------------------------+
```

## 2. Python Backend (FastAPI Example)

For high-performance, strictly timed Sub-500ms execution, **FastAPI** with native WebSockets is highly recommended over standard Flask HTTP polling, though the logic pattern remains identical if you prefer `Flask-SocketIO`. 

WebSocket can also auto reconnect

Auto reconnect is not exclusive to Socket.IO.

You can implement it yourself in React/TS.

Example:

function connect() {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
        console.log("connected");
    };

    ws.onclose = () => {
        console.log("reconnecting...");
        setTimeout(connect, 2000);
    };

    ws.onerror = () => {
        ws.close();
    };
}

connect();

This gives:

Reconnect
Retry delay
Full control
Still raw WebSocket latency


Create a file named `app.py` in your backend server:

```python
import asyncio
import random
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

# Store active assets configurations matching frontend
ASSETS = {
    "GOLD": {"decimals": 2, "price": 2045.50, "volatility": 0.001},
    "BTC": {"decimals": 2, "price": 64000.0, "volatility": 0.004},
    "ETH": {"decimals": 2, "price": 3100.0, "volatility": 0.005},
    "AAPL": {"decimals": 2, "price": 175.00, "volatility": 0.002}
}

def generate_next_tick(current_price, volatility):
    """Simulates realistic Geometric Brownian Motion step."""
    change_percent = (random.random() - 0.5) * volatility
    next_price = current_price * (1 + change_percent)
    return max(0.01, next_price)

@app.websocket("/ws/market_feed")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # 1. Await Configuration Parameters from Frontend
    config_data = await websocket.receive_json()
    
    # Extract 'Data Settings' parameters dispatched by the client
    symbol_id = config_data.get("symbol_id", "BTC")
    time_interval = config_data.get("time_interval", "1m")
    time_frequency = config_data.get("time_frequency", "tick")
    latency_rate_ms = int(config_data.get("latency_rate", 500))
    
    latency_sec = latency_rate_ms / 1000.0 # Convert 500ms to 0.5s

    if symbol_id not in ASSETS:
        await websocket.send_json({"error": "Invalid symbol_id"})
        await websocket.close()
        return
        
    print(f"Client Connected: {symbol_id} | Interval: {time_interval} | Freq: {time_frequency} | Latency: {latency_rate_ms}ms")
    
    config = ASSETS[symbol_id]

    try:
        while True:
            # Stochastic Price Move
            old_price = config["price"]
            new_price = round(generate_next_tick(old_price, config["volatility"]), config["decimals"])
            config["price"] = new_price
            
            # Simulated Trade Details
            is_buy = new_price >= old_price or random.random() > 0.45
            trade_volume = round(random.random() * 5.0, 3)
            
            # Payload packet sent matching frontend 'alpha' data source requirements
            payload = {
                "symbol_id": symbol_id,
                "price": new_price,
                "old_price": old_price,
                "volume": trade_volume,
                "side": "BUY" if is_buy else "SELL",
                "timestamp": time.strftime("%H:%M:%S", time.localtime()),
                "epoch": int(time.time() * 1000) # JS compatible timestamp
            }
            
            # Emit globally to connected socket client
            await websocket.send_json({"type": "tick", "data": payload})
            
            # Hard delay enforcing the specific latency rate requirement (e.g., 500ms)
            await asyncio.sleep(latency_sec)
            
    except WebSocketDisconnect:
        print(f"Client disconnected from {symbol_id} stream.")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 3. Frontend Modifications (`alpha` Data Source)

To tie the existing dashboard code with the FastAPI backend, you should handle this cleanly inside your Leverage V3 data source structure.

### Hooking into "Data Layer Config > Data Settings mode change"

When the UI mode changes to **'Live Market Feed'**, you initialize the WebSocket with the required parameters (passing `symbol_id`, `time_interval`, `time_frequency`, and `latency_rate`) instead of starting the local interval simulator.

```typescript
// Inside: src/tools/leverage_version_3/functions/api/data_source/simulated_aggregate_alpha.ts

let marketSocket: WebSocket | null = null;

export function startAlphaDataSource(config: {
  mode: 'Local Simulation' | 'Live Market Feed',
  symbol_id: string,
  time_interval: string,      // e.g., '1m', '5m'
  time_frequency: string,     // e.g., 'tick', 'candle'
  latency_rate: number        // e.g., 500 (in milliseconds)
  livedataprovider: string  // defaut to mt5_data
}, onTickCallback: (tickData: any) => void) {
  
  // Cleanup any lingering connection before establishing a new configuration
  if (marketSocket) {
    marketSocket.close();
  }

  if (config.mode === 'Live Market Feed') {
    // --- FASTAPI / FLASK WEBSOCKET CONNECTIONS ---
    marketSocket = new WebSocket("ws://localhost:8000/ws/market_feed");

    marketSocket.onopen = () => {
      console.log("Connected to Python Live Market Feed backend.");
      // Send parameters strictly upon connection
      marketSocket?.send(JSON.stringify({
        symbol_id: config.symbol_id,
        time_interval: config.time_interval,
        time_frequency: config.time_frequency,
        latency_rate: config.latency_rate // e.g., 500 passed from config
      }));
    };

    marketSocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      
      if (response.type === 'tick') {
         const tick = response.data;
         // Process the 500ms tick via the existing robust 'alpha' pipeline replacing random walk
         onTickCallback({
           price: tick.price,
           oldPrice: tick.old_price,
           volume: tick.volume,
           side: tick.side,
           time: tick.epoch,
         });
      }
    };

    marketSocket.onerror = (err) => {
      console.error("Live Market Feed network error:", err);
    };

    marketSocket.onclose = () => {
      console.log("Live Market Feed connection securely closed.");
    };

  } else {
    // ... (Fallback to your prior existing Local Simulation logic) ...
  }
}

export function stopAlphaDataSource() {
  if (marketSocket) {
    marketSocket.close();
    marketSocket = null;
  }
}
```

## 4. Setup and Installation

Follow these steps to run the complete environment:

**Step 1: Install Dependencies**
Install FastAPI, Uvicorn, and standard Websockets (Python 3.8+ recommended):
```bash
pip install fastapi uvicorn websockets
```

*(Note: If sticking strictly to Flask, you would instead `pip install flask flask-socketio eventlet`)*

**Step 2: Launch Python Server**
Run your Python file:
```bash
python app.py
```

**Step 3: Run the Leverage V3 Panel**
Inside the application, navigate to **Data Layer Config > Data Settings**. 
Change the mode to **Live Market Feed**, supply your desired target asset symbol, intervals, and enforce the latency slider/setting to `500` (ms). Upon submission, the app will directly attach to your backend utilizing the `alpha` parameters.
