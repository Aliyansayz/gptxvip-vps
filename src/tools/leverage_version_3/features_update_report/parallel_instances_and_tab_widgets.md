# Isolated Parallelization: Multi-Instance Tab Architecture for Leverage Trading Engine V3

This documentation explores the technical design, architectural path, state isolation strategies, and performance considerations required to run **multiple concurrent and completely isolated instances** of the **Leverage Trading Version 3 Engine** inside tabbed user interface components.

---

## 1. Architectural Concept: Scope Isolation

Currently, the trading engine maintains its core variables (simulation index, active trades, configuration parameters, and chart stream indicators) via global Zustand stores (such as `useTradingSlice`, `useDataSlice`, and `useIndicatorsStore`). 

To run multiple tabs concurrently (e.g., Tab 1 simulating Gold on 5s, Tab 2 simulating NASDAQ100 on 1m with custom ATR bands), the static global hook model must be transitioned into a **Context-Bound Multi-Instance Store Architecture**.

```
                   [ Tabbed Interface Container ]
          _______________________|_______________________
         |                       |                       |
     [ Tab 1 ]               [ Tab 2 ]               [ Tab 3 ]
  (Gold - 5s Alpha)     (NASDAQ100 - 10s Alpha)  (Silver - 1m Alpha)
         |                       |                       |
 [Context Provider 1]    [Context Provider 2]    [Context Provider 3]
         |                       |                       |
 +------------------+    +------------------+    +------------------+
 | Isolated Store   |    | Isolated Store   |    | Isolated Store   |
 |  - useTrading    |    |  - useTrading    |    |  - useTrading    |
 |  - useData       |    |  - useData       |    |  - useData       |
 |  - Live Loop     |    |  - Live Loop     |    |  - Live Loop     |
 +------------------+    +------------------+    +------------------+
```

---

## 2. Technical Implementation: The Context-Store Pattern

Instead of exporting a single hook instance directly from Zustand, we define a **Store Creator** and pass its instance down through a standard React Context provider. This provides clean TypeScript typing, automatic cleanup, and 100% state encapsulation per tab.

### A. Context Definition & Provider Setup
```typescript
import React, { createContext, useContext, useRef } from 'react';
import { createTradingStore, TradingStoreType } from '../stores/useTradingSlice';
import { createDataStore, DataStoreType } from '../stores/useDataSlice';

interface InstanceState {
  tradingStore: TradingStoreType;
  dataStore: DataStoreType;
}

const InstanceContext = createContext<InstanceState | null>(null);

export const TradingInstanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Creating ref-based isolated store engines so they persist across local re-renders
  const storeRef = useRef<InstanceState | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = {
      tradingStore: createTradingStore(),
      dataStore: createDataStore()
    };
  }

  return (
    <InstanceContext.Provider value={storeRef.current}>
      {children}
    </InstanceContext.Provider>
  );
};

// Specialized custom hooks bound to the closest tab boundary
export const useInstanceTrading = <T>(selector: (state: any) => T): T => {
  const context = useContext(InstanceContext);
  if (!context) throw new Error("useInstanceTrading must be used inside a TradingInstanceProvider");
  return context.tradingStore(selector);
};
```

---

## 3. High-Quality Tab Controller Layout (UI Components)

The platform always initializes in the **Default Mode** (a single-instance view). To enter the multi-tab workspace, users click the **"Parallel Mode"** button located near the **"Full View"** option.

Once activated, the Multi-Tab Controller surfaces browser-like tabs with a **`+`** sign to open a new instance. It dynamically manages the active tab index, adding new tabs with independent configurations, and deleting redundant simulation environments. A successful initialization and a neat, clean UI with parallelization is our first priority.

```tsx
import React, { useState } from 'react';
import { TradingInstanceProvider } from './TradingInstanceProvider';
import { TradingToolsLab } from '../TradingToolsLab';
import { Plus, X, MonitorPlay, Settings2 } from 'lucide-react';

interface TabInstance {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
}

export const MultiInstanceDashboard: React.FC = () => {
  const [tabs, setTabs] = useState<TabInstance[]>([
    { id: 'tab-1', name: 'NASDAQ Scalper', asset: 'nasdaq100', timeframe: '5s' },
    { id: 'tab-2', name: 'Gold Volatility Swing', asset: 'gold', timeframe: '1m' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([...tabs, {
      id: newId,
      name: `Sandbox #${tabs.length + 1}`,
      asset: 'gold',
      timeframe: '5s'
    }]);
    setActiveTabId(newId);
  };

  const removeTab = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Maintain at least one active instance
    const filtered = tabs.filter(t => t.id !== idToRemove);
    setTabs(filtered);
    if (activeTabId === idToRemove) {
      setActiveTabId(filtered[0].id);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Tab bar header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[80%]">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer duration-150 text-xs font-semibold uppercase tracking-wider border transition-all select-none ${
                  isActive 
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400' 
                    : 'bg-zinc-800/40 border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                <MonitorPlay size={12} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} />
                <span>{tab.name} ({tab.asset.toUpperCase()})</span>
                {tabs.length > 1 && (
                  <X 
                    size={11} 
                    onClick={(e) => removeTab(tab.id, e)}
                    className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors ml-1"
                  />
                )}
              </div>
            );
          })}
          
          <button 
            onClick={addTab}
            className="flex items-center justify-center p-1.5 rounded bg-zinc-800 hover:bg-cyan-950 hover:text-cyan-400 border border-zinc-700/50 hover:border-cyan-800/40 duration-150 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <Settings2 size={12} className="text-zinc-400" />
          <span>Parallel Tabs Active: {tabs.length}</span>
        </div>
      </div>

      {/* Render Workspace with Provider Encapsulation */}
      <div className="flex-1 overflow-hidden relative">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div 
              key={tab.id} 
              className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Force recreate or suspend evaluation on mount/destruction */}
              {isActive && (
                <TradingInstanceProvider>
                  <TradingToolsLab />
                </TradingInstanceProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

## 4. Performance & Processing Optimization

Running up to 10 separate simulation loops inside a single browser tab can strain CPU resources. To maintain a lock-step **60 FPS environment**, we follow strict computational guidelines:

1.  **Lazy Simulation Clocking (Background Suspend)**:
    Only the *active* tab should process full rendering updates (such as generating high-frequency canvas renders, drawing candlestick patterns, and checking trades on every tick).
    *   **Inactive Tabs:** Their execution tickers are throttled down to a low-frequency state check (e.g., calculating indicators once every 2-5 seconds rather than every frame).
2.  **Shared Worker Indicators**:
    Computing sophisticated indicators (like Smoothed Heikin Ashi, ATR Bands, and Linear Regression formulas) over 1000-candle arrays should be offloaded to a shared Web Worker. This prevents main-thread layout thrashing.
3.  **Canvas Rendering Recycling**:
    Ensure the HTML5 Canvas uses clean draw loops and fully detaches event listeners when a tab is hidden, preventing ghost memory leaks.
4.  **Memoized Store Contexts**:
    Trading instances should be strongly memoized using `useMemo` so that parent state re-renders (like switching the active tab) don't unmount and recreate child contexts.

---

## 5. Serializing Configured Workspaces (JSON Schema)

Users can export their complete multi-tab layout as a unified JSON config file. This ensures they can easily restore their testing environments. Moving the `Load Config` and `Export Config` buttons outside the individual tab parameters limits (to the global navigation bar or Simulator Controls layer) ensures users are saving their **entire workspace**, not just a fragmented piece.

```json
{
  "workspaceName": "HFT Nasdaq & Precious Metals Suite",
  "lastActiveTab": "tab-1",
  "timestamp": "2026-06-15T15:46:00Z",
  "instances": [
    {
      "tabId": "tab-1",
      "tabName": "Nasdaq Alpha Volatility",
      "config": {
        "asset": "nasdaq100",
        "timeframe": "5s",
        "primaryIndicator": "stochastic_alpha",
        "indicators": {
          "stochastic": { "kPeriod": 14, "dPeriod": 3 },
          "stopLoss": { "type": "atrSmoothBands", "period": 7, "multiplier": 2.7 }
        },
        "tradeControl": {
          "autoEntry": "alpha",
          "riskRewardRatio": 1.5,
          "leverageMode": true
        }
      }
    },
    {
      "tabId": "tab-2",
      "tabName": "Gold Smooth Swing",
      "config": {
        "asset": "gold",
        "timeframe": "1m",
        "primaryIndicator": "ma_crossover_alpha",
        "indicators": {
          "movingAverage": { "fast": 10, "slow": 20 },
          "stopLoss": { "type": "fixed", "pips": 45.0 }
        },
        "tradeControl": {
          "autoEntry": "beta",
          "riskRewardRatio": 2.0,
          "leverageMode": true
        }
      }
    }
  ]
}
```
