# Leverage Mode Working Mechanics

## Overview
This document outlines how Leverage Mode operates within the Leverage Trading Version 2 system.

## Key Mechanisms
1. **Leverage Scaling**: How position sizes are calculated based on user-defined leverage.
2. **PnL Calculation**: Integration with `leveragedPositionSizeMetals.ts` to accurately compute PnL relative to leverage.
3. **Risk Management**: Interaction with stop-loss and take-profit mechanisms in leveraged scenarios.

## Logical Flow
1. **Entry**: Position size is adjusted based on the `leverage` multiplier.
2. **Monitoring**: Open positions are monitored for PnL fluctuations affected by leverage.
3. **Exit**: PnL is finalized based on exit price and leverage multiplier.
