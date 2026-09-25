# CandlestickSimulator

**File Location:** `src/finhub/tools/leverage_version_3/components/CandlestickSimulator/index.tsx`

## Overview
The `CandlestickSimulator` is the primary interactive visualization and control dashboard for the Leverage Trading Version 3 tool. It encapsulates the main rendering canvas and houses the extensive multi-tab configuration panel that drives the simulation and live trading functionalities.

## Main Configuration Tabs
The simulator features a comprehensive lower panel containing "Trading & Controls" along with numerous advanced settings tabs. Users can switch between these tabs dynamically:

1. **Trading & Controls (`trading`)** 
   - Provides manual execution controls (Buy/Sell/Exit).
   - Contains the `TradingConfiguration` sub-component and the `ManualControls`.
2. **Trade Settings (`settings`)**
   - General rules for entries and exits.
3. **Leverage Mode (`leverage`)**
   - Configures leverage strategies mapping dynamically with asset alpha data.
4. **Account Settings (`account`)**
   - Manages simulated equity, risk profiles, and balance limits.
5. **Visibility (`visibility`)**
   - Toggles visual overlays for the main chart and indicator panes.
6. **Indicator Log (`indicatorLog`)**
   - Displays real-time debugging information of indicator states.
7. **HFT Mode (`hftMode`)**
   - Settings for High-Frequency Trading latency constraints and conditions.
8. **Time Filter (`timeFilter`)**
   - Restricts trading activity based on specified operational hours.
9. **SL Modifiers (`stopLossModifier`)**
   - Advanced Stop Loss and Take Profit trailing logic.
10. **Dev Console (`consoleLog`)**
    - Technical logging for developer and debugging purposes.

## Key Sub-Components Included
- `CandlestickSimulatorCanvas` (The actual chart renderer)
- `SimulatorControls` (Playback speed, forward/reset)
- `TradingPanelLeverageSettings`, `TradingPanelAccountSettings`, `TradingPanelTradeSettings`
- `TradeLogBook` & `FeatureLogBook` (Lazy loaded modules for tracking history)

## Responsibilities
- **State Management:** Manages the `simulationIndex` to step through historical data.
- **Data Hydration:** Combines raw price data with `computedIndicators` and evaluates trade conditions.
- **Layout Management:** Offers a split-pane view (Canvas on top, Control Panels at the bottom) and handles the toggling logic for the lower configuration board (`isPanelOpen`).
