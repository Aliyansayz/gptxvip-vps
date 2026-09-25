# Developer Console Log

Target Directory: `src/finhub/tools/leverage_version_live_starter`

**Feature Request:** Implement a "Developer Console Log" panel to capture and display real-time terminal/system logs, WebSocket events, and live trading execution states directly within the application UI.

### Core Requirements

1.  **State Management & Logger Utility:**
    *   Create a centralized logging state in the application (either extending `indicators_store.tsx` or creating a dedicated `logger_store`).
    *   Define a `LogEntry` type containing: `id`, `timestamp` (with millisecond precision), `level` ('INFO' | 'WARN' | 'ERROR' | 'SUCCESS'), `source` (e.g., 'WebSocket', 'TradeEngine', 'System', 'Rules'), and `message`.
    *   Implement a utility function (e.g., `systemDeployLog()`) that pushes new logs to this state while maintaining a maximum buffer limit (e.g., keeping only the latest 1000 lines to prevent memory bloat).

2.  **Configuration Panel UI Integration:**
    *   In `SimulatorControls`, add a new tab button called "Dev Console" or "Console Log" alongside the existing tabs ("Trading & Controls", "HFT Mode", etc.).
    *   Create a new UI component named `TradingPanelConsoleLog.tsx` to serve as the active view for this tab.

3.  **Console View Design (Terminal Aesthetic):**
    *   The `TradingPanelConsoleLog` should look like a dark-themed developer terminal.
    *   Use a monospace font (`font-mono`) with distinct text colors based on the log level (e.g., Emerald for SUCCESS, Cyan for INFO, Amber for WARN, Rose for ERROR).
    *   Features:
        *   Auto-scroll to the bottom when a new log appears.
        *   A "Clear Logs" button to flush the current view.
        *   Filter toggles at the top to show/hide specific log levels (Info, Error, Warn).

4.  **Live Integration Points (Where logs should be fired):**
    *   **WebSocket/LiveData Router:** Add log triggers in `mt5_data_api/index.ts` and `liveDataFetchMode.ts` to log connection status ("Connected", "Disconnected", "Reconnecting", "Connection Error") and incoming data ticks.
    *   **Trade Execution:** Add log triggers when a trade is successfully opened, modified, or closed by the engine (especially useful for monitoring latency or rejections in live environments).
    *   **HFT Mode Triggers:** If HFT mode is active, log the scaled sizing decisions and symmetric stop-loss sync evaluations in the background.

---

### Key Application Context Guidelines for Developers

To accurately implement real-time logs, the following file and function targets are where the core behaviors originate and where the new console logger function (`systemDeployLog`) should be injected:

*   **Data Feed Mode Initialization / Data Feed Simulation or Live Mode**
    *   *Files:* `src/finhub/tools/leverage_version_live_starter/functions/api/data_source/liveDataFetchMode.ts`, `src/finhub/tools/leverage_version_live_starter/functions/mt5_data_api/index.ts`, `src/finhub/tools/leverage_version_3/functions/api/data_source/simulated_aggregate_alpha.ts`
    *   *Functions:* `connectMT5WebSocket()`, `fetchLiveTicks()`, `generateSimulatedData()`

*   **Trading Entry Rule Satisfaction**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/rules/tradingEntryIndicatorRules.ts`
    *   *Functions:* `evaluateEntrySignals()` (and HFT mode conditional logic)

*   **Trigger of Main Trade, Trigger Recurrent Trade**
    *   *Files:* `src/finhub/tools/leverage_version_3/components/CandlestickSimulator/useTradeManagement.ts`, `src/finhub/tools/leverage_version_3/functions/api/rules/tradingRecurrentTradeRules.ts`
    *   *Functions:* `executeMainTrade()`, `executeRecurrentTrade()`, `processPendingTrades()`

*   **Lot Size Calculation**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/position_sizing/leveragedDynamicPositionSize.ts`, `src/finhub/tools/leverage_version_3/functions/api/position_sizing/recurrentPositionSizing.ts`
    *   *Functions:* `evaluateDynamicPositionSize()`, `evaluateRecurrentPositionSize()`

*   **Defining Stop Loss / Take Profit**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/rules/tradingEntryIndicatorRules.ts`, `src/finhub/tools/leverage_version_3/functions/api/middleware/offsetWithATRInSl.ts`
    *   *Functions:* Logic encapsulated during Trade instantiation in entry rules (e.g. SL/TP bindings)

*   **Trade Stop Loss Trail and Update Decision (and Conditional Trailing)**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/rules/trailingStopLossRules.ts`, `src/finhub/tools/leverage_version_3/functions/api/middleware/updateTrailSL.ts`
    *   *Functions:* `evaluateTrailingStopLoss()`, `updateTrailSL()`

*   **Explicit Stop Loss Modifier**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/middleware/translateLongSLPriceIntoPips.ts`, `src/finhub/tools/leverage_version_3/functions/api/middleware/giveSLIntoPips.ts`

*   **Partial Main Trade Exit Behavior**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/rules/tradingRules.ts`, `src/finhub/tools/leverage_version_3/functions/api/rules/tradingPartialExitRules.ts`
    *   *Functions:* `calculatePartialExitSize()`, inside `evaluateTradeExits()` checking if `isMainTrade` and `exitReason === 'SIGNAL_REVERSAL'`, partitioning the trade size, closing the partial portion at the exit price while preserving the remaining position as a new active trade. Added active logs via `onLog` when a partial reversal trigger is hit.

*   **Trading Exit Rule Satisfaction**
    *   *Files:* `src/finhub/tools/leverage_version_3/functions/api/rules/tradingExitIndicatorRules.ts`, `src/finhub/tools/leverage_version_3/functions/api/rules/tradingPipsExitRules.ts`, `src/finhub/tools/leverage_version_3/functions/api/rules/tradingTimeExitRules.ts`
    *   *Functions:* `evaluateExitRules()`, `evaluatePipsExits()`, `evaluateTimeExits()`

### Output expectations:
Implement the logger, wire up the state, build the Terminal UI component, integrate it into the active panel tabs, and demonstrate it by logging the MT5 websocket state transitions, data mode bounds, block evaluations, rule outcomes, and trade execution changes as listed above.
