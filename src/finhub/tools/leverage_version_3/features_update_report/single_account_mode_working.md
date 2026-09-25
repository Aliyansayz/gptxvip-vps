# Single Account Mode Working Mechanics

## Overview
This document outlines how the Single Account Mode functions within the Leverage Trading Version 2 system, covering both leveraged and non-leveraged scenarios.

## Mode Distinctions

### 1. Non-Leveraged Mode
*   **PnL Calculation**: PnL is calculated simply as the difference between exit price and entry price (multiplied by trade size). PnL = (Exit Price - Entry Price) * Size (for Long).
*   **Balance Management**: Account balance is directly impacted by the raw PnL of closed trades.

### 2. Leveraged Mode
*   **PnL Calculation**: PnL incorporates the leverage factor, interacting with `leveragedPositionSizeMetals.ts` to compute gains/losses based on the borrowed capital position size.
*   **Balance Management**: Margin requirements must be maintained based on existing positions, and leveraged PnL adjustments are applied to the account balance upon closing.

## Logical Flow
1. **Initialize Account**: Set up initial account balance based on the selected mode.
2. **Execute Trade**: Determine if trade execution is permitted based on available free margin (in leverage mode) or account balance (in non-leverage mode).
3. **Monitor Positions**: Track unrealized PnL based on real-time price ticks.
4. **Finalize**: Apply settled PnL and update the account balance upon trade closure.
