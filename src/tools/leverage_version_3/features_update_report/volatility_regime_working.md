# Volatility Regime & ATR Tracker - Working Report

This report outlines how the Scenario Calculation, Z-Score, Volatility Regime, and ATR Range are currently processed in Leverage Trading Version 3, along with front-end modification plans to properly associate and display their exact `dataSource` and timeframe origin.

---

## 1. Volatility Regime & Z-Score Scenario Calculation

Inside `TradingPanelVolatilityRegime.tsx`, the volatility regime tracking defines market scenarios (A, B, C, D) using a combination of a standard normalized Z-Score and a binary volatility regime flag.

### Calculations
1. **Linear Regression & Trend Strength**: The system calculates linear regression using `linearRegressionSystem(closePrices, 20, 20, 30)` which exposes `trend_strength` and `vol_regime`.
2. **Current Z-Score Calculation**:
   - The moving average (`m`) of the trend strength is derived from the array.
   - The Standard Deviation (`s`) is calculated across that trend strength array.
   - The Z-Score (`z`) is finalized explicitly as: `(currentTS - m) / s`.
3. **Decay State**: `trendDecayState(zArray, lr.vol_regime)` identifies the real decay phase of the trend.
4. **Scenarios**:
   - **Scenario A (🔥)**: `Math.abs(z) > 1.5` AND `currentVolRegime === 1`. (Trend is stretched but accelerating).
   - **Scenario B (🧊)**: `Math.abs(z) > 1.5` AND `currentVolRegime === 0`. (Trend stretched, no energy).
   - **Scenario C (⚖️)**: `Math.abs(z) <= 1.5` AND `currentVolRegime === 1`. (Trend just starting, expanding).
   - **Scenario D**: `Math.abs(z) <= 1.5` AND `currentVolRegime === 0`. (Chop / Consolidation).

---

## 2. ATR Range Investigation

**Where it is defined:**
The Average True Range (ATR) period is defined via `indicatorSettings.volatility.atrPeriod` stored inside `indicators_store.tsx`. 

**Current Data Source Binding:**
Currently, `calculateATR(visibleData, atrPeriod)` receives the `visibleData` prop directly from the parent container (`SimulationControls` or similar master wrapper). **By default, this is implicitly passing the `alpha` data stream**. The base value is then pip-translated via `priceToPips(currentATR, asset, lastClosePrice)`.

**The missing link:** 
The global store explicitly defines a `dataSource` target for Volatility (`indicatorSettings.volatility.dataSource`), which can be set to `alpha`, `beta`, or `delta`. The UI does not currently re-route the `visibleData` based on this variable, nor does it display what timeframe the ATR is calculated against.

---

## 3. Required Front-End Modifications

To make the panel explicitly show and operate natively on its assigned data source and timeframe, the following updates need to be applied strictly to `TradingPanelVolatilityRegime.tsx`:

### A. Data Fetching Route
We need to pass down the correct data stream (`alphaData`, `betaData`, `deltaData`) from the parent instead of a generic `data` prop, or have the parent inject the correct data array based on `indicatorSettings.volatility.dataSource`.

### B. Displaying the Data Source and Timeframe in the Panel
We will modify the Volatility Regime panel header to show two new metric badges:
1. **Data Source Badge**: Indicating whether the data is coming from `Alpha (Main)`, `Beta (HTF)`, or `Delta (LTF)`.
2. **Timeframe Badge**: Taking the current timeframe (e.g., `5s`, `1m`) from `dataSettings` (or derived from the respective data source multiplier).

**Example UI Update Plan (JSX):**
```tsx
<div className="flex items-center gap-2 mt-1">
  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 uppercase">
    Source: {indicatorSettings.volatility.dataSource || 'alpha'}
  </span>
  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-800/50">
    TF: {dataSettings.timeframe}
  </span>
</div>
```

### C. Proposed Styling Changes for Selected Metric Elements
*(As requested via Focus Mode selection targeting nested container elements in the Volatility Regime box)*

To increase readability and aesthetic hierarchy of the ATR and Volatility badges:
- **Background Adjustments**: Increase contrast by deepening the background transparency (`bg-zinc-900/80`) and adding a subtle backdrop blur (`backdrop-blur-sm`).
- **Border Treatments**: Employ `border-fuchsia-500/30` or `border-blue-500/30` for active metric states rather than flat grays.
- **Typography Alignment**: Apply strictly grouped `flex items-baseline` so that values and labels (like `pips`) align beautifully on their bottom edges.
