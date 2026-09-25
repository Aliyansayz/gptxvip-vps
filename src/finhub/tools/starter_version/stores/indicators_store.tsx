import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TradingRulesConfig } from '../functions/api/rules/tradingRules';

export interface IndicatorSettings {
  ma_crossover: { fastMa: number; slowMa: number };
  stochastic: { stochK: number; stochD: number };
  supertrend: { period: number; multiplier: number };
  divergence: { stochK: number; stochD: number }; 
  linear_regression: { slopePeriod: number; volPeriod: number; regimePeriod: number };
}

interface IndicatorsStoreContextType {
  tradingConfig: TradingRulesConfig;
  setTradingConfig: React.Dispatch<React.SetStateAction<TradingRulesConfig>>;
  indicatorSettings: IndicatorSettings;
  setIndicatorSettings: React.Dispatch<React.SetStateAction<IndicatorSettings>>;
  getIndicatorDescription: (type: keyof IndicatorSettings) => string;
}

const defaultTradingConfig: TradingRulesConfig = {
    entryOnSignal: true,
    exitOnSignalReversal: true,
    useStopLoss: true,
    useTakeProfit: true,
    rewardRiskRatio: 1.5,
    exitAfterNCandles: 0,
    exitAfterNCandlesMin: 0,
    exitAfterNCandlesMax: 0,
    exitAfterNMinutes: 0,
    exitAfterNMinutesMin: 0,
    exitAfterNMinutesMax: 0,
    exitAfterNSeconds: 0,
    exitAfterNSecondsMin: 0,
    exitAfterNSecondsMax: 0,
    pipMultiplier: 0.1, 
    useADXFilter: false,
    adxThreshold: 18,
    useSqueezeFilter: false,
    stopLossPips: 0,
    takeProfitPips: 0,
};

const defaultIndicatorSettings: IndicatorSettings = {
  ma_crossover: { fastMa: 9, slowMa: 21 },
  stochastic: { stochK: 14, stochD: 3 },
  supertrend: { period: 10, multiplier: 3 },
  divergence: { stochK: 14, stochD: 3 },
  linear_regression: { slopePeriod: 20, volPeriod: 20, regimePeriod: 30 }
};

const IndicatorsStoreContext = createContext<IndicatorsStoreContextType | null>(null);

export const IndicatorsStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tradingConfig, setTradingConfig] = useState<TradingRulesConfig>(defaultTradingConfig);
  const [indicatorSettings, setIndicatorSettings] = useState<IndicatorSettings>(defaultIndicatorSettings);

  const getIndicatorDescription = (type: keyof IndicatorSettings) => {
    switch (type) {
      case 'ma_crossover':
        return `Simulates a fast EMA (${indicatorSettings.ma_crossover.fastMa} periods) crossing over a slow SMA (${indicatorSettings.ma_crossover.slowMa} periods). Bullish signals are green, Bearish are red.`;
      case 'stochastic':
        return `Simulates standard ${indicatorSettings.stochastic.stochK}, 3, ${indicatorSettings.stochastic.stochD} Stochastic oscillator. Signals identify crosses between the %K (blue) and %D (orange) lines in overbought/oversold zones.`;
      case 'supertrend':
        return `Simulates Supertrend indicator. Trend changes signal entries when price crosses the Supertrend line calculated over ${indicatorSettings.supertrend.period} periods and ${indicatorSettings.supertrend.multiplier} multiplier.`;
      case 'divergence':
        return `Simulates Divergence using Stochastic (K=${indicatorSettings.divergence.stochK}, D=${indicatorSettings.divergence.stochD}). Bullish/bearish divergences between price action and oscillator generate signals.`;
      case 'linear_regression':
        return `Simulates a Linear Regression System with Slope (${indicatorSettings.linear_regression.slopePeriod}), Volatility (${indicatorSettings.linear_regression.volPeriod}), and Regime (${indicatorSettings.linear_regression.regimePeriod}). Generates signals based on trend decay and mean reversion.`;
      default:
        return '';
    }
  };

  return (
    <IndicatorsStoreContext.Provider value={{ tradingConfig, setTradingConfig, indicatorSettings, setIndicatorSettings, getIndicatorDescription }}>
      {children}
    </IndicatorsStoreContext.Provider>
  );
};

export const useIndicatorsStore = () => {
  const context = useContext(IndicatorsStoreContext);
  if (!context) throw new Error('useIndicatorsStore must be used within IndicatorsStoreProvider');
  return context;
};
