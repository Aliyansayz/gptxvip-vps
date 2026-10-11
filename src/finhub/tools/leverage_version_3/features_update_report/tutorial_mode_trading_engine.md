# Trading Engine Tutorial Mode & Process Mapping Report

This document details the configuration flow, step-tracking mechanics, and sequential process mapping for the **Leverage Trading Version 3 Interactive Tutorial Mode**. It outlines a concrete scenario from initial setup to running simulations, complete with step state tracking and a structured JSON template representing the entire tutorial journey.

---

## 1. Step-by-Step Tutorial Journey

The tutorial mode guides users through high-precision indicators, data layer adjustments, position risk structures, and execution toggles. The scenario below demonstrates setting up an automated momentum-based scalping configuration on the **Nasdaq 100** system.

### Phase A: Setup & Analysis Config
*   **Step 1: System Indicator Strategy Selection**
    *   **Action:** Locate the classic indicator systems menu in the left panel.
    *   **Target Selection:** Enable **"Stochastic Momentum"** from the classic indicators dashboard.
    *   **Goal:** Establish momentum waves as the primary filtration source for alpha entry triggers.
*   **Step 2: Data Layer Configuration**
    *   **Action:** Go to the **Data Layer Config** tab.
    *   **Target Selection:** Set the simulated asset to **"NASDAQ100"**.
    *   **Goal:** Switch the price stream generator to high-velocity equity index emulation.
*   **Step 3: Timeframe Granularity**
    *   **Action:** Set the primary **Alpha Timeframe** to **"5 seconds"** from the dropdown menu.
    *   **Goal:** Ensure the engine receives high-frequency tick candlesticks for real-time calculation.
*   **Step 4: Stop-Loss Indicator Settings**
    *   **Action:** Navigate to the Indicator Parameters section and open the **Stop Loss Indicator** block.
    *   **Target Selection:** Select **"ATR Smooth Bands"** for the Alpha stream. Set the parameter period to `7` and the multiplier to `2.7`.
    *   **Goal:** Adapt volatility bands to tightly envelope Nasdaq standard deviations without prematurely exiting noise spikes.

### Phase B: Order Executions & Controls Config
*   **Step 5: Accessing the Configuration Panel**
    *   **Action:** Click the main button to open the **"Configuration Panel"**.
*   **Step 6: Automated Signal Binding**
    *   **Action:** Locate the **Trade Control** submenu.
    *   **Target Selection:** Set the **"Auto Entry On Signal"** option to **"Alpha"**.
    *   **Goal:** Bind trade generation directly to any positive crossovers of the 5-second Alpha stream indicators.
*   **Step 7: Trade Protection & Target Ratios**
    *   **Action:** In the Trade Control configurations, set the Stop Loss Strategy to **"ATR Based"**, and define the Target Risk-Reward (R:R) ratio at **"1:1.5"**.
    *   **Goal:** Require every automatically spawned position to use the computed smooth ATR values for stops, securing a profit target equal to 1.5 times the stop-loss risk.
*   **Step 8: Confirming Leverage Status**
    *   **Action:** Scroll down to the leverage configurations. Verify that **"Leverage Mode"** is explicitly toggled **ON**.
    *   **Goal:** Magnify buying power dynamically in response to state sizing variables.
*   **Step 9: Launching the Simulation**
    *   **Action:** Click the **"Enable Trading Mode"** button to arm the execution engine, then click **"Start Simulation"** to run the live virtual stream.

---

## 2. Tracking Tutorial Execution State Correctly

To ensure a seamless educational flow, the engine tracks user progress programmatically. This is achieved by binding interaction event listeners to the application state engine (`useTradingSlice` / React Context state) rather than raw DOM clicks.

### How Each Step is Verified
1.  **State-Level Subscriptions:** The tutorial controller hooks into the active config slice. As soon as `activeConjunctionSystems` or `indicatorParams` match the goal state, the step is validated as safe and correct.
2.  **Element Highlighting (Focus Mode):** Using CSS selectors (such as `div#root ... label`), target elements are highlighted with subtle, colored glow pulses.
3.  **Active Guards:** Users cannot trigger "Start Simulation" until former validation steps within the active state tree are set to `true`. This prevents erratic runs.

---

## 3. Sequential Tutorial Process Map (JSON Format)

Below is the machine-readable JSON mapping schema that models this entire sequence. It defines order, step targets, UI selectors, and evaluation predicates.

```json
{
  "tutorialId": "high_velocity_nasdaq_scalping_v3",
  "name": "High-Velocity Nasdaq Scalping Setup",
  "description": "Learn to set up Stochastic Momentum, ATR Smooth Bands, and automated Alpha executions with leveraged safety parameters.",
  "version": "3.0.0",
  "steps": [
    {
      "stepIndex": 1,
      "phase": "Analysis Config",
      "title": "Enable Stochastic Momentum",
      "description": "Select 'Stochastic Momentum' from the Classic system panel to enable oscillator filtration.",
      "uiSelector": "button[data-indicator='stochastic_momentum']",
      "completionPredicate": {
        "statePath": "activeConjunctionSystems",
        "expectedValue": ["stochastic_alpha"]
      }
    },
    {
      "stepIndex": 2,
      "phase": "Data Config",
      "title": "Select NASDAQ100 Asset",
      "description": "Open 'Data Layer Config' and change the simulation asset to NASDAQ100.",
      "uiSelector": "select#asset-selector",
      "completionPredicate": {
        "statePath": "simulatedAsset",
        "expectedValue": "nasdaq100"
      }
    },
    {
      "stepIndex": 3,
      "phase": "Data Config",
      "title": "Set Alpha Timeframe",
      "description": "Change the simulation granularity for alpha triggers to 5 seconds.",
      "uiSelector": "select#alpha-timeframe",
      "completionPredicate": {
        "statePath": "timeframes.alpha",
        "expectedValue": "5s"
      }
    },
    {
      "stepIndex": 4,
      "phase": "Analysis Config",
      "title": "Configure ATR Smooth Bands",
      "description": "Set stop loss indicator to smooth bands for alpha with period 7 and multiplier 2.7.",
      "uiSelector": "div#stop-loss-indicator-group",
      "completionPredicate": {
        "statePath": "indicatorParams.stopLoss.atrSmoothBands",
        "expectedValue": {
          "period": 7,
          "multiplier": 2.7,
          "stream": "alpha"
        }
      }
    },
    {
      "stepIndex": 5,
      "phase": "Executions Config",
      "title": "Open Configuration Panel",
      "description": "Expand the primary configurations drawer in the dashboard window.",
      "uiSelector": "button#open-config-panel",
      "completionPredicate": {
        "statePath": "ui.configPanelOpen",
        "expectedValue": true
      }
    },
    {
      "stepIndex": 6,
      "phase": "Executions Config",
      "title": "Bind Alpha Auto Entry",
      "description": "Navigate to 'Trade Control' > 'Auto Entry on Signal' and pick 'Alpha'.",
      "uiSelector": "select#auto-entry-signal",
      "completionPredicate": {
        "statePath": "tradingConfig.autoEntryOnSignal",
        "expectedValue": "alpha"
      }
    },
    {
      "stepIndex": 7,
      "phase": "Executions Config",
      "title": "Set ATR Stops & Risk-Reward Ratio",
      "description": "Bind protection to ATR and assign a strict reward ratio of 1:1.5.",
      "uiSelector": "input#risk-reward-ratio",
      "completionPredicate": {
        "statePath": "tradingConfig.protection",
        "expectedValue": {
          "stopLossType": "atr-based",
          "riskReward": 1.5
        }
      }
    },
    {
      "stepIndex": 8,
      "phase": "Executions Config",
      "title": "Verify Leverage Mode",
      "description": "Confirm that leverage mode is actively toggled on.",
      "uiSelector": "input#leverage-mode-toggle",
      "completionPredicate": {
        "statePath": "leverageConfig.enabled",
        "expectedValue": true
      }
    },
    {
      "stepIndex": 9,
      "phase": "Simulation",
      "title": "Arm & Run Simulation",
      "description": "Enable overall trading mode and trigger development playback.",
      "uiSelector": "button#start-simulation",
      "completionPredicate": {
        "statePath": "simulationState",
        "expectedValue": "running"
      }
    }
  ]
}
```
