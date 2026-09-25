# Main Trade Working Mechanics

This document outlines the logical questions and conceptual flow for understanding how a main trade is executed within the Leverage Trading Version 2 system.

## Trade Execution Flow

**1. How is a Main Trade triggered?**
*   What entry conditions (e.g., MA Crossover, Stochastic, Supertrend) must be met for a signal to be generated?
*   How do volatility filters (ADX, Squeeze Momentum, Volatility Regime Scenarios A & C) act as gatekeepers before a trade is officially entered?

**2. Which files manage the execution lifecycle?**
*   `components/CandlestickSimulator.tsx`: How does the simulation loop pass data into the evaluation functions?
*   `functions/api/rules/tradingRules.ts`: How does `evaluateTradeEntries` coordinate the various rule checks?
*   `functions/api/rules/tradingEntryIndicatorRules.ts`: How are the specific indicator threshold conditions evaluated?
*   `functions/api/rules/tradingVolatilityRules.ts`: How is the `isVolatilityEntryConditionMet` function utilized to filter out false positives?

**3. What specific functions handle the state transition of a trade?**
*   When a signal is confirmed, which function constructs the initial `Trade` object (recording `entryPrice`, `entryTime`, `side`)?
*   How does `evaluateTradeExits` monitor open trades against Stop Loss (SL), Take Profit (TP), and dynamic exit conditions (e.g., Z-Score bounds)?

## Parallel Account Execution

**1. How do Parallel Accounts mimic the Main Trade?**
*   When the **Parallel Account Feature** is active, any main trade executed by the root account (A1) triggers simultaneous counterpart trades for all active parallel accounts (A2, A3, etc.).
*   These parallel trades follow the exact same timestamp, entry price, size, and exit rules as the root account's main trade.
*   The execution mode (Normal, Hedge, Invert) dictates the direction and size relative to the root trade.

**2. Trade Log Book Representation**
*   Parallel trades are injected into the global trade array and are displayed in the Trade Log Book (Active and History) with color-coded account identifiers (e.g., A1 in emerald, A2 in purple).
*   They share the same entry/exit events but maintain distinct account IDs (`accountId`) for individual PnL and margin tracking.

## Position Sizing and Leverage

**1. How is leverage applied to the main position?**
*   In `functions/api/position_sizing/leveragedPositionSizeMetals.ts` and `leveragedDynamicPositionSize.ts`, how does the chosen leverage multiplier affect the required margin?

**2. What happens to the account balance?**
*   How does `leverageConfig.balance` temporarily decrease (or get locked) as margin when a trade opens?
*   How is the margin released back into the balance upon trade closure?

## Trade Log Book Precision

**1. How accurately does the Trade Log Book account for main trade measurements?**
*   **Timestamping:** Are trades recorded exactly at the tick/candle index where the rules evaluated to true?
*   **PnL Calculation:** Does the log correctly calculate gross PnL based on leveraging, minus any simulated fees or slippage?
*   **State Syncing:** How does `functions/api/trade_log_book/syncTradeState.ts` ensure that the visual UI log precisely matches the internal state array returned by the evaluation loops?
*   **Drawdown Tracking:** Are intermediate Maximum Drawdown (MDD) metrics calculated intra-trade, or only at the closure of the trade?
