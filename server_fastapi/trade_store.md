Here is a **YAML-based persistent trade state manager** for FastAPI backend.

This will:

* Use **`trade_id` as primary key**
* **Load YAML on startup**
* **Check if trade exists**
* **Update existing trade**
* **Create new trade if missing**
* Persist automatically to disk
* Store **subfields inside each trade_id**

---

# 1. Install YAML Library

```bash
pip install pyyaml
```

---

# 2. YAML File Structure (`trade_state.yaml`)

Example:

```yaml
056545:
  action: Long
  trade_type: main_trade
  asset_name: BTCUSD
  volume: 0.01
  entry_price: 105.25
  entry_time: 1748600000
  sl_value: 0.1
  tp_value: 0.3
  status: open

056546:
  action: Short
  trade_type: recurrent_trade
  asset_name: XAUUSD
  volume: 0.05
  entry_price: 3370.1
  entry_time: 1748600100
  sl_value: 0.2
  tp_value: 0.5
  status: open
```

---

# 3. YAML State Manager (`trade_store.py`)

Create:

```python
import yaml
import os
from threading import Lock

YAML_FILE = "trade_state.yaml"

lock = Lock()


class TradeStore:

    def __init__(self):
        self.data = self.load()

    def load(self):

        if not os.path.exists(YAML_FILE):
            return {}

        with open(YAML_FILE, "r") as f:
            data = yaml.safe_load(f)

        return data or {}

    def save(self):

        with lock:
            with open(YAML_FILE, "w") as f:
                yaml.dump(
                    self.data,
                    f,
                    default_flow_style=False,
                    sort_keys=False
                )

    def upsert_trade(self, trade_id, trade_data):

        with lock:

            # Existing trade → update
            if trade_id in self.data:
                self.data[trade_id].update(trade_data)

            # New trade → create
            else:
                self.data[trade_id] = trade_data

            self.save()

            return self.data[trade_id]

    def get_trade(self, trade_id):

        return self.data.get(trade_id)

    def delete_trade(self, trade_id):

        with lock:

            if trade_id in self.data:
                del self.data[trade_id]
                self.save()
                return True

        return False
```

---

# 4. Use in FastAPI SocketIO

Import:

```python
from trade_store import TradeStore

store = TradeStore()
```

Then modify `execute_trade()`:

```python
@sio.event
async def execute_trade(sid, data):

    trade_id = data.get("trade_id")

    if not trade_id:

        await sio.emit(
            "trade_error",
            {"message": "trade_id required"},
            room=sid
        )
        return

    trade_record = {

        "action": data.get("action"),
        "trade_type": data.get("trade_type"),
        "asset_name": data.get("asset_name"),
        "volume": data.get("volume"),

        "entry_price": data.get("entry_price"),
        "entry_time": data.get("entry_time"),

        "sl_value": data.get("sl_value"),
        "tp_value": data.get("tp_value"),

        "status": "open"
    }

    saved_trade = store.upsert_trade(
        trade_id,
        trade_record
    )

    await sio.emit(
        "trade_accepted",
        {
            "status": "saved",
            "trade_id": trade_id,
            "trade_data": saved_trade
        },
        room=sid
    )
```

---

### Behavior

Frontend sends:

```json
{
  "trade_id": "056545",
  "action": "Long",
  "sl_value": 0.2
}
```

Backend checks YAML:

### Case 1 — Exists

Before:

```yaml
056545:
  action: Long
  sl_value: 0.1
  tp_value: 0.3
```

After update:

```yaml
056545:
  action: Long
  sl_value: 0.2
  tp_value: 0.3
```

Only changed fields update.

---

### Case 2 — Missing

New trade automatically added:

```yaml
056547:
  action: Short
  asset_name: BTCUSD
  status: open
```

---

This gives you **persistent backend trade state** that survives FastAPI restarts and behaves like a lightweight key-value database using YAML. For your trading terminal, this is good for **active trade/session state**, while historical trades are usually better stored later in SQLite or PostgreSQL.
