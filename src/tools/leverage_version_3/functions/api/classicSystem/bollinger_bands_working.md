# Bollinger Bands - Classic System

This document outlines the working mechanics of the Bollinger Bands trading system within the Leverage Trading Version 2 tools and details the specific files responsible for evaluating trade decisions.

## How It Works

The Bollinger Bands system is a mean-reversion trading strategy based on statistical volatility. It uses a moving average (basis) and an upper and lower envelope band (calculated using standard deviation). 

**Trading Rules:**
- **LONG (Buy) Signal:** Triggered when the price candle opens below the lower band, but recovers and closes above the lower band. This signifies a potential rejection of lower prices and an upward mean-reversion.
- **SHORT (Sell) Signal:** Triggered when the price candle opens above the upper band, but weakens and closes below the upper band. This indicates a rejection of higher prices and a potential downward mean-reversion.

## Core Files & Trade Evaluation

The following files are responsible for calculating the Bollinger Bands and making trade decisions:

### 1. `src/tools/leverage_version_2/functions/api/indicators/exclusive/bollingerBands.ts`
This file contains the mathematical calculation logic for the Bollinger Bands indicator. It outputs an array of objects containing the `basis` (Moving Average), `upper` limit, and `lower` limit for each period based on the specified `period` and `stdDev` configurations.

### 2. `src/tools/leverage_version_2/components/CandlestickSimulator/useComputedIndicators.ts`
This hook is responsible for fetching the raw candle data (alpha, beta, or delta data sources) and feeding it to the `calculateBollingerBands` function. It attaches the resulting Bollinger Bands values (upper, lower, basis) to the `entrySignal` and `exitSignal` objects for each candlestick in the array.

### 3. `src/tools/leverage_version_2/components/CandlestickSimulator/useTradeEvaluation.ts`
**This is the primary file responsible for evaluating trade decisions.**
Within this hook, the trade logic checks the newly computed indicator data against the Bollinger Bands rules frame-by-frame:

```typescript
// Example Logic Extracted From useTradeEvaluation.ts
if (config.type === 'bollinger_bands' && ind.entrySignal?.bb) {
  const bb = ind.entrySignal.bb;
  if (bb && bb.length > simulationIndex) {
    const lastBb = bb[simulationIndex];
    const lastCandle = data[simulationIndex];
    if (lastCandle && lastBb && !isNaN(lastBb.lower) && !isNaN(lastBb.upper)) {
      // LONG evaluation
      if (lastCandle.open < lastBb.lower && lastCandle.close > lastBb.lower) {
        currentEntrySignal = 'LONG';
      } 
      // SHORT evaluation
      else if (lastCandle.open > lastBb.upper && lastCandle.close < lastBb.upper) {
        currentEntrySignal = 'SHORT';
      }
    }
  }
}
```

## Summary
The system provides a clear way to add classic trading rules like Bollinger Bands by generating indicator signals across the dataset (`useComputedIndicators`), visualizing them on the graph (`CandlestickSimulatorCanvas`), and executing automated trade decisions per frame based on literal open/close conditions (`useTradeEvaluation`).
