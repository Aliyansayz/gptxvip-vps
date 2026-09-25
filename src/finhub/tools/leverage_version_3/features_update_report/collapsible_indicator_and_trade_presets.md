# Collapsible Indicator & Trade Config Presets Menu

This document details the architectural approach for introducing a robust, collapsible indicator parameters and trade configuration preset menu into the Leverage Trading Version 3 Engine. This system enables users to save, manage, and seamlessly switch between custom indicator configurations and trade panel settings without manually tweaking complex setups repeatedly.

---

## 1. Core Feature Concept

As indicators grow in complexity (e.g., Smoothed Heikin Ashi combined with Stochastic and dynamic ATR Stops) and trade settings require careful tuning (risk/reward, leverage), adjusting parameters across different timeframes can become tedious. The **Collapsible Indicator & Trade Config Presets Menu** serves as a lightweight, floating or inline widget that:
- Captures the current configuration of all visual indicators, trade-active indicators, and trading panel settings (e.g., risk/reward ratios, leverage, take profit/stop loss rules).
- Serializes that state into a browser session storage or local storage.
- Allows 1-click loading of predefined complex configurations.

### Key Capabilities
- **Quick Save**: "Save Preset" button captures the current configuration (Stochastic periods, Moving Average windows, ATR Multipliers, Trade Panel Settings like Risk/Reward 6:1).
- **Confirmation Flow**: Re-loading a preset triggers a confirmation prompt to prevent accidental overrides during an active backtest loop.
- **Unified Workspace Association**: The saved presets integrate directly with the new global 'Load Config' and 'Export Config' flows, meaning users can export their presets alongside their trading history.

---

## 2. User Interface Blueprint

The UI should use a collapsible `Accordion` or `Dropdown` pattern, minimizing screen real-estate overhead while keeping powerful configurations easily accessible.

```tsx
<div className="preset-menu-container flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
  {/* Header & Toggle */}
  <div className="flex items-center justify-between p-2 cursor-pointer" onClick={toggleMenu}>
    <span className="text-sm font-semibold text-zinc-300">Indicator & Trade Config Presets</span>
    <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
  </div>

  {/* Expanded Content */}
  {isOpen && (
    <div className="p-3 bg-zinc-950 border-t border-zinc-800">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {presets.map((preset) => (
          <button 
            key={preset.id}
            onClick={() => confirmLoadPreset(preset)}
            className="text-xs bg-zinc-800 hover:bg-cyan-900 text-zinc-300 hover:text-cyan-300 py-1 px-2 rounded text-left truncate transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
        <input 
          type="text" 
          placeholder="New preset name..." 
          className="flex-1 bg-zinc-900 text-xs px-2 py-1 rounded border border-zinc-700"
        />
        <button 
          onClick={savePreset}
          className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-400 px-3 py-1 rounded text-xs font-bold transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )}
</div>
```

---

## 3. Data Structure & State Management

To seamlessly integrate this within the global Load/Export configuration, we define a standard structure that persists alongside the `useTradingSlice` or config state.

```typescript
export interface IndicatorAndTradePreset {
  id: string;            // unique identifier (uuid or timestamp)
  name: string;          // User-defined name (e.g., "Volatile Gold Scalping + 2.0 R/R")
  assetTarget?: string;  // Optional hint for which asset this works best on
  config: {
    indicators: Record<string, any>;   // All indicator settings
    tradeControl: Record<string, any>; // Stop loss multipliers, targets, risk/reward, leverage, take profit bounds
  };
}
```

### Browser Session Persistence

When "Save Preset" is clicked, it writes to `sessionStorage` (or `localStorage` if long-term persistence is desired), merging with any existing array of presets. 

When a user uses the new **Outer Layer Export Config Button**, the `exportBacktestJSON` function will query this `sessionStorage` key and serialize the `IndicatorAndTradePreset` array into the root of the JSON file, ensuring user knowledge isn't lost during machine migration. 
