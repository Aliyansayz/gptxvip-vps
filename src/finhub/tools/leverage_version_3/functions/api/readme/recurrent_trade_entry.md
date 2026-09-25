# Recurrent Trade Entry Mechanics

**Rule:** When the recurrent trade checkbox is checked, open a trade when the main latest trade is in surplus. This rule is kept as-is, but any conditions of volatility regime criteria checks or scenario acceptance have been removed from the recurrent trade execution logic.

## Input Parameters Widget Configuration
The GUI incorporates "Time Entry (After Main Trade)" and "Time Exit (After Trade Entry)" interfaces for recurrent trades, supporting:
*   **Time Entry/Exit:** Based on fixed and dynamic (volatility adjusted) seconds constraints.
*   **Candles Entry/Exit:** New functionality to delay recurrent entry or enforce an auto-exit based on a set number of elapsed candles. This allows the system to behave similarly to the main trade functionality.
*   **Pips Based Entry:** Execute a recurrent trade when the price moves `X` amount of pips in favor of our direction related to the latest trade. A value of `0` means this feature is disabled. This acts as an alternative trigger alongside Time/Candle limits: if the delay condition OR the pips favor condition is met, the recurrent trade spawns.
*   **Vol Adjusted:** The execution accommodates z-score-based min/max adjustments for both seconds and candle lengths.
*   **Time Exit (Close Alongside Main Trade):** An option has been added where if the main trade exits, all open recurrent child trades will be forced to forcefully close simultaneously.
  
This document outlines the logical questions and conceptual flow for understanding how recurrent trades (pyramiding/scaling in) are executed alongside main trades within the Leverage Trading Version 2 system.

## Recurrent Trade Execution Flow

**1. Under what conditions is a Recurrent Trade initiated?**
*   Must a Main Trade already be open and profitable (or in a specific state) before a recurrent trade can trigger?
*   What is the specific signal (e.g., pullback, subsequent indicator crossover) that validates a recurrent entry compared to the initial main entry?

**2. Which files manage the recurrent execution lifecycle?**
*   `components/CandlestickSimulator.tsx`: How does the simulation detect the state of active main trades to allow recurrent evaluations?
*   `functions/api/rules/tradingRecurrentTradeRules.ts`: What distinct logic resides here that differentiates recurrent entries from main entries?
*   `functions/api/rules/tradingRules.ts`: How does the main evaluation loop branch out to call recurrent trade logic?

**3. What specific functions handle the recurrent trade state?**
*   How does the system link a recurrent trade to its parent main trade (e.g., via a `parentId` or grouping mechanism)?
*   Which function resolves the closure of recurrent trades? Do they close independently, or must they close simultaneously when the main trade hits its exit criteria? (Addressed via the **Close Alongside Main Trade** Setting)

## Position Sizing and Account Impact

**1. How is position sizing handled for recurrent entries?**
*   Is the recurrent trade size a fixed percentage of the main trade, or is it dynamically recalculated based on the current (perhaps increased) account equity?
*   How does the system prevent margin calls when continually adding to a position?

**2. How does this affect overall leverage?**
*   How is the aggregate exposure calculated when multiple recurrent trades are stacked?

## Trade Log Book Precision

**1. How accurately does the Trade Log Book account for recurrent trade measurements?**
*   **Grouping:** Does the log visually aggregate recurrent trades under their parent main trade to show a combined "Campaign PnL", or are they listed sequentially as separate line items?
*   **Precision in PnL:** How precisely does the system differentiate the entry prices of recurrent trades to calculate a blended average entry price?
*   **Fee Accounting:** Are transaction costs applied correctly per recurrent execution, rather than blanketed across the entire position?
*   **State Syncing:** In `functions/api/trade_log_book/syncTradeState.ts`, how are recurrent states parsed so the user can see exactly when scaling occurred during the lifecycle of the primary trend?
