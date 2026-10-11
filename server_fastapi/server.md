Here is a **FastAPI + Socket.IO starter template** for real-time communication (e.g. trading dashboard, live charts, alerts, execute-trade events).

### 1. Install Dependencies

```bash
pip install fastapi uvicorn python-socketio
```

For production ASGI support:

```bash
pip install "python-socketio[asgi]"
```

---

# Project Structure

```text
project/
│
├── main.py
```

---

# 2. FastAPI + Socket.IO Server (`main.py`)

```python
import socketio
from fastapi import FastAPI
import uvicorn
import random
import asyncio

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

# FastAPI app
fastapi_app = FastAPI()

# Combine FastAPI + Socket.IO
app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=fastapi_app
)


# -------------------------
# FastAPI Routes
# -------------------------

@fastapi_app.get("/")
async def root():
    return {"message": "FastAPI + Socket.IO running"}


# -------------------------
# Socket Events
# -------------------------

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

    await sio.emit(
        'server_message',
        {'msg': 'Connected successfully'},
        room=sid
    )


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


# Custom event example
@sio.event
async def execute_trade(sid, data):
    print("Trade Request:", data)

    # Simulated processing
    result = {
        "status": "success",
        "symbol": data.get("symbol"),
        "lot_size": data.get("lot_size"),
        "price": round(random.uniform(100, 110), 2)
    }

    await sio.emit(
        'trade_result',
        result,
        room=sid
    )


# Live price stream example
async def price_feed():
    while True:
        price = round(random.uniform(100, 105), 2)

        await sio.emit(
            'price_update',
            {
                'symbol': 'BTCUSD',
                'price': price
            }
        )

        await asyncio.sleep(1)


@fastapi_app.on_event("startup")
async def startup():
    asyncio.create_task(price_feed())


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

---

# 3. Simple Frontend Test (`client.html`)

Open this in browser.

```html
<!DOCTYPE html>
<html>
<head>
    <title>SocketIO Test</title>
</head>
<body>

<h2>FastAPI Socket.IO Test</h2>

<button onclick="sendTrade()">Execute Trade</button>

<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>

<script>
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
        console.log("Connected:", socket.id);
    });

    socket.on("server_message", (data) => {
        console.log(data);
    });

    socket.on("price_update", (data) => {
        console.log("Price:", data);
    });

    socket.on("trade_result", (data) => {
        console.log("Trade Result:", data);
    });

    function sendTrade() {
        socket.emit(
            "execute_trade",
            {
                symbol: "BTCUSD",
                lot_size: 0.1
            }
        );
    }
</script>

</body>
</html>
```

---

# 4. Run Server

```bash
python main.py
```

Server:

```text
http://localhost:8000
```

---

### Event Flow

```text
Frontend
    │
    ├── connect ─────────────→ FastAPI SocketIO
    │
    ├── execute_trade ───────→ Backend
    │                          process trade
    │
    ├── trade_result ←──────── Backend
    │
    └── price_update ←──────── live stream
```

### Typical Trading Use Case

For your trading terminal architecture:

* **REST API (FastAPI routes)**

  * login
  * load symbols
  * fetch history
  * settings/config

* **Socket.IO (Realtime)**

  * live candles / ticks
  * order execution response
  * alerts
  * account updates
  * AI signals
  * latency-sensitive events

This setup usually gives **10–50ms local latency** and avoids HTTP polling.


You can expand the `execute_trade()` event to receive and validate those parameters.

Replace this part:

```python
result = {
    "status": "success",
    "symbol": data.get("symbol"),
    "lot_size": data.get("lot_size"),
    "price": round(random.uniform(100, 110), 2)
}
```

with something more structured like this:

```python
@sio.event
async def execute_trade(sid, data):

    print("Trade Request:", data)

    # Receive parameters
    action = data.get("action")
    trade_type = data.get("trade_type")
    sl_value = data.get("sl_value")
    tp_value = data.get("tp_value")
    entry_price = data.get("entry_price")
    entry_time = data.get("entry_time")
    trade_id = data.get("trade_id")
    asset_name = data.get("asset_name")
    lot_size = data.get("lot_size")

    # Example validation
    allowed_actions = [
        "long",
        "short",
        "close",
        "modify_position",
        "update_sl",
        "update_sl_tp"
    ]

    if action not in allowed_actions:
        await sio.emit(
            "trade_result",
            {
                "status": "error",
                "message": "Invalid action"
            },
            room=sid
        )
        return

    # Simulated broker execution
    result = {
        "status": "success",

        "trade_id": trade_id,
        "asset_name": asset_name,
        "action": action,
        "trade_type": trade_type,

        "entry_price": entry_price,
        "entry_time": entry_time,

        "lot_size": lot_size,
        "sl_value": sl_value,
        "tp_value": tp_value,

        "execution_price": round(
            random.uniform(100, 110), 2
        ),

        "message": f"{action} executed"
    }

    await sio.emit(
        "trade_result",
        result,
        room=sid
    )
```

---

### Frontend Example Payload

Your frontend can send:

```javascript
socket.emit(
    "execute_trade",
    {
        action: "long",
        trade_type: "main_trade",

        sl_value: 0.1,
        tp_value: 0.3,

        entry_price: 105.25,
        entry_time: Date.now(),

        trade_id: "056545",
        asset_name: "BTCUSD",

        lot_size: 0.01
    }
);
```

---

Example backend received object:

```json
{
  "action": "long",
  "trade_type": "main_trade",
  "sl_value": 0.1,
  "tp_value": 0.3,
  "entry_price": 105.25,
  "entry_time": 1748600000,
  "trade_id": "056545",
  "asset_name": "BTCUSD",
  "lot_size": 0.01
}
```

Example server response:

```json
{
  "status": "success",
  "trade_id": "056545",
  "asset_name": "BTCUSD",
  "action": "long",
  "trade_type": "main_trade",
  "entry_price": 105.25,
  "entry_time": 1748600000,
  "lot_size": 0.01,
  "sl_value": 0.1,
  "tp_value": 0.3,
  "execution_price": 106.44,
  "message": "long executed"
}
```

For a real trading terminal, a cleaner pattern is usually:

```text
execute_trade      -> request
trade_accepted     -> broker/API accepted
trade_filled       -> filled
trade_modified     -> SL/TP changed
trade_closed       -> closed
trade_error        -> failure
```

instead of sending everything back through a single `trade_result` event. This scales better for your dual-timeframe / auto-trading architecture.
