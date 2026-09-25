# Complex UI Mode Architecture

**Location:** `src/finhub/tools/leverage_version_3/components/complex_ui_mode/`

## Overview

The **Complex UI Mode** represents the advanced, high-granularity control interface of the Leverage Trading Version 3 platform. It is designed for power users, developers, and quantitative analysts who require precise control over every variable in their trading simulations. 

This mode is primarily driven by two massive architectural components: the `CandlestickSimulator` (which houses the multi-tab layout) and the `IndicatorSettingsPanel` (which handles deep mathematical parameter adjustments). Together, they form a comprehensive but densely packed dashboard.

---

## 1. The Core Dashboard: `CandlestickSimulator`
The `CandlestickSimulator` acts as the command center for the complex UI. It utilizes a split-pane layout: a chart rendering canvas on top, and an extensive, multi-tabbed configuration board docked at the bottom.

### The 10-Tab Configuration Board
To accommodate the sheer volume of settings, the interface relies on a horizontal tab system that controls the visibility of various sub-panels:

1. **Trading & Controls:** Manual execution buttons (Buy/Sell/Exit) and the primary `TradingConfiguration` engine.
2. **Trade Settings:** General operational rules for entries and exits.
3. **Leverage Mode:** Dynamic leverage strategy mappings tied to asset alpha data.
4. **Account Settings:** Management of simulated equity, risk profiles, and hard balance limits.
5. **Visibility:** Granular toggles to hide/show specific chart overlays and indicator panes.
6. **Indicator Log:** Real-time, step-by-step debugging outputs of internal indicator states.
7. **HFT Mode:** High-Frequency Trading specific configurations (e.g., latency constraints, slippage).
8. **Time Filter:** Operational hour restrictions (e.g., limiting trades to specific global market sessions).
9. **SL Modifiers:** Advanced trailing Stop Loss and Take Profit logic mechanisms.
10. **Dev Console:** Technical, low-level logging for developers tracking engine behavior.

*Note: The density of these tabs is the defining characteristic of the "Complex UI Mode." It exposes every underlying variable to the user.*

---

## 2. The Indicator Configuration Engine: `IndicatorSettingsPanel`
While the simulator handles global environment variables, the `IndicatorSettingsPanel` acts as the specific mathematical tuning board for technical indicators.

### Dynamic Parameter Rendering
Instead of a static form, this panel dynamically injects the correct input fields based on the currently selected indicator system. It actively supports complex parameters for:
- `heikin_ashi_smoothed` (Smoothing lengths)
- `ma_crossover` (Fast/Slow moving averages)
- `stochastic` & `divergence` (%K, %D variables)
- `supertrend` & `supertrend_regime` (Periods, ATR Multipliers, Z-Score thresholds)
- `linear_regression` (Slope, Volatility, and Regime periods)
- `bollinger_bands` (Standard deviations and lookback periods)
- `candlestick_pattern` (A massive list of toggleable boolean flags for individual candlestick formations like Doji, Hammers, Engulfing, etc.)

### Nested Configuration (Alpha, Beta, Delta)
The panel is capable of configuring multi-timeframe systems simultaneously. It handles nested configurations where a single indicator might require different parameters across primary (`alphaParams`), secondary (`betaParams`), and tertiary (`deltaParams`) data aggregations.

---

## 3. State Management & Data Flow
The complexity of this UI is bridged by robust global state management, primarily `useIndicatorsStore`.

1. **Input Stage:** The user interacts with the dense input fields in either the Simulator Tabs or the Indicator Settings Panel.
2. **State Update:** Partial updates are dispatched to the `useIndicatorsStore`, instantly merging new nested configurations with the existing application state.
3. **Execution & Rendering Stage:** The `CandlestickSimulatorCanvas` and the trade evaluation engine constantly listen to this global state. As soon as a variable changes (e.g., changing a Supertrend multiplier from 3.0 to 2.5), the canvas triggers a re-render, and the engine recalculates historical entry/exit conditions instantly.

## Summary
The Complex UI Mode trades simplicity for absolute control. By surfacing all parameters through the `CandlestickSimulator` tabs and the `IndicatorSettingsPanel`, it ensures that every aspect of the backtesting sandbox and algorithmic logic can be tuned. However, this creates a steep learning curve and high cognitive load ("chart fatigue"), which is often mitigated by introducing alternative, wizard-based or simplified UI workflows for less technical users.
