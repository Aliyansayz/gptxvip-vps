# IndicatorSettingsPanel

**File Location:** `src/tools/leverage_version_3/components/lab/IndicatorSettingsPanel.tsx`

## Overview
The `IndicatorSettingsPanel` component is responsible for arranging and managing the configuration settings for various trading indicators within the Leverage Trading Version 3 platform. 

It provides an interactive and dynamic UI for adjusting indicator parameters in real-time, bridging user input with the global application state via the `useIndicatorsStore`.

## Key Features
- **Dynamic Input Fields:** Automatically renders the correct set of configuration fields based on the selected indicator type.
- **Nested Configuration:** Handles complex indicator parameters, separating settings by source (`alphaParams`, `betaParams`, `deltaParams`, `default`).
- **Supported Indicators:**
  - `heikin_ashi_smoothed` (Smoothing Length)
  - `ma_crossover` (Fast MA, Slow MA)
  - `stochastic` (Stoch %K, Stoch %D)
  - `supertrend` (Period, Multiplier)
  - `divergence` (Stoch %K, Stoch %D)
  - `linear_regression` (Slope Period, Vol Period, Regime Period)
  - `bollinger_bands` (Period, Std Dev)
  - `supertrend_regime` (ST Period, ATR Multiplier, Regime Period, Z Period, Z Upper, Z Lower)
  - `candlestick_pattern` (Toggleable boolean flags for individual candlestick patterns like Bullish Marubozu, Bullish Hammer, Doji, etc.)

## Dependencies
- `react`, `motion/react`
- `lucide-react` for icons (`Settings2`, `ChevronDown`, `ChevronUp`)
- Global state management: `useIndicatorsStore` from `stores/indicators_store`
- Aggregation rules: `dataSourceRules`
- Self-replication system context labels: `selfReplicationLabelManage`

## How it works
1. **State Injection:** The component retrieves the current `indicatorSettings` and data context from the global store.
2. **Switch/Case Rendering:** A massive `switch` statement (`renderNestedInputs`) checks the current `baseId` (the selected indicator system) and outputs the appropriate TSX fields (inputs, toggles) for it.
3. **Change Handlers:** Edits in the input fields trigger the `handleChange` wrapper, which merges partial configuration updates with the previous indicator state in the global store.
