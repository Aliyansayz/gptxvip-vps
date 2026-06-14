import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval, getLowestActiveIntervalDelay } from '../../functions/api/rules/dataSourceRules';
import { collectAllAccountInfo } from '../../functions/api/middleware/collectAllAccountInfo';
import { shouldActivateTradeBreaker } from '../../functions/api/tradeBreaker/tradeBreakerByEquity';

const TradeLogBook = React.lazy(() => import('../TradeLogBook').then(module => ({ default: module.TradeLogBook })));
const FeatureLogBook = React.lazy(() => import('../FeatureLogBook').then(module => ({ default: module.FeatureLogBook })));

import { CandlestickSimulatorCanvas } from '../CandlestickSimulatorCanvas';
import { SimulatorControls } from '../simulator/SimulatorControls';
import { TradingConfiguration } from '../simulator/TradingConfiguration';
import { ManualControls } from '../simulator/ManualControls';
import { TradingPanelLeverageSettings } from '../simulator/TradingPanelLeverageSettings';
import { TradingPanelAccountSettings } from '../simulator/TradingPanelAccountSettings';
import { TradingPanelTradeSettings } from '../simulator/TradingPanelTradeSettings';
import { TradingPanelVisibility } from '../simulator/TradingPanelVisibility';
import { TradingPanelVolatilityRegime } from '../simulator/TradingPanelVolatilityRegime';
import { TradingPanelTrendStrength } from '../simulator/TradingPanelTrendStrength';
import { TradingPanelIndicatorLog } from '../simulator/TradingPanelIndicatorLog';
import { TradingPanelHFTMode } from '../simulator/TradingPanelHFTMode';
import { TradingPanelConsoleLog } from '../simulator/TradingPanelConsoleLog';
import { TradingPanelTimeFilter } from '../simulator/TradingPanelTimeFilter';
import { TradingPanelStopLossModifier } from '../simulator/TradingPanelStopLossModifier';
import { AccountInfo } from '../simulator/AccountInfo';

import { Download, Upload } from 'lucide-react';
import { exportConfigUtility } from '../../functions/api/utility/exportConfigUtility';
import { loadConfigUtility } from '../../functions/api/utility/loadConfigUtility';
import { calculateTradeMetrics } from '../../functions/api/utility/metricsCalculator';
import { CandlestickSimulatorProps } from './types';
import { useSimulatorState } from './useSimulatorState';
import { useComputedIndicators } from './useComputedIndicators';
import { useTradeEvaluation } from './useTradeEvaluation';
import { useTradeManagement } from './useTradeManagement';

import { isMainTrade } from '../../functions/api/tradeState/fetchLatestTradeState';
import { createFeatureLogEntry } from '../../functions/api/indicatorLog/featureLogBook';
import { fetchIndicatorAlpha } from '../../functions/api/indicatorState/fetchIndicatorAlpha';
import { fetchLastTradeOutcome } from '../../functions/api/tradeState/fetchLastTradeOutcome';

import { GOLD_ONLY_PRESETS, GoldPresetName } from '../../functions/api/data_source/goldPresetAdjustments';
import { NASDAQ100_PRESETS, NasdaqPresetName } from '../../functions/api/data_source/nasdaq100SimulationPresets';
import { OIL_PRESETS, OilPresetName } from '../../functions/api/data_source/oilSimulationPresets';
import { OHLCSimulationParams, DEFAULT_OHLC_PARAMS } from '../../functions/api/data_source/simulationDataOhlcParameter';

const isPresetActive = (presetParams: OHLCSimulationParams, currentParams: OHLCSimulationParams) => {
  return (
    Math.abs(presetParams.drift - currentParams.drift) < 1e-7 &&
    Math.abs(presetParams.volatility - currentParams.volatility) < 1e-7 &&
    presetParams.seed === currentParams.seed &&
    Math.abs((presetParams.wick_factor ?? 0.3) - (currentParams.wick_factor ?? 0.3)) < 1e-7 &&
    Math.abs(presetParams.high_low_noise - currentParams.high_low_noise) < 1e-7 &&
    Math.abs(presetParams.side_ways_switch_prob - currentParams.side_ways_switch_prob) < 1e-7 &&
    Math.abs(presetParams.trend_switch_prob - currentParams.trend_switch_prob) < 1e-7
  );
};

export * from './types';

export const CandlestickSimulator: React.FC<CandlestickSimulatorProps> = ({ config }) => {
  const [panelTab, setPanelTab] = useState<'trading' | 'settings' | 'leverage' | 'account' | 'visibility' | 'indicatorLog' | 'hftMode' | 'consoleLog' | 'timeFilter' | 'stopLossModifier'>('trading');
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { 
    tradingConfig, 
    setTradingConfig, 
    dataSettings, 
    setDataSettings,
    leverageSettings, 
    setLeverageSettings, 
    indicatorSettings, 
    setIndicatorSettings,
    visibilitySettings, 
    setVisibilitySettings,
    parallelAccounts, 
    setParallelAccounts,
    serialTradingEnabled,
    setSerialTradingEnabled,
    isFeatureLogActive,
    isVisibilityLogActive,
    featureLog,
    setFeatureLog,
    heikinAshiSettings,
    setHeikinAshiSettings,
    setLatestPrice,
    setCurrentStops,
    setSimulationIndexGlobal,
    indicatorCheckedState
  } = useIndicatorsStore();
  const simulationMode = dataSettings.simulationMode;

  const {
    data,
    betaData,
    deltaData,
    simulationIndex,
    setSimulationIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeedMs,
    setPlaybackSpeedMs,
    betaIndex,
    deltaIndex
  } = useSimulatorState(
    simulationMode,
    dataSettings.asset as string,
    setTradingConfig,
    dataSettings.betaAggregateFactor,
    dataSettings.deltaAggregateFactor,
    dataSettings.deltaAggregateSource,
    dataSettings.dataSourceType,
    dataSettings.csvRawData
  );

  const configKey = JSON.stringify(config);
  const stableConfig = React.useMemo(() => config, [configKey]);

  const computedIndicators = useComputedIndicators(
    data,
    betaData,
    deltaData,
    stableConfig,
    tradingConfig,
    indicatorSettings,
    dataSettings.asset as string
  );

  const latencyDelaySeconds = React.useMemo(() => {
    return getLowestActiveIntervalDelay(
      dataSettings.showAlpha,
      dataSettings.showBeta,
      dataSettings.showDelta,
      simulationMode,
      dataSettings.betaAggregateFactor,
      dataSettings.deltaAggregateFactor,
      dataSettings.deltaAggregateSource
    );
  }, [
    dataSettings.showAlpha, dataSettings.showBeta, dataSettings.showDelta,
    simulationMode, dataSettings.betaAggregateFactor, dataSettings.deltaAggregateFactor,
    dataSettings.deltaAggregateSource
  ]);

  React.useEffect(() => {
    if (setLatestPrice && data[simulationIndex]) {
      setLatestPrice(data[simulationIndex].close);
    }
  }, [data, simulationIndex, setLatestPrice]);

  React.useEffect(() => {
    if (setCurrentStops) {
      setCurrentStops(computedIndicators?.stops || null);
    }
  }, [computedIndicators?.stops, setCurrentStops]);

  React.useEffect(() => {
    if (setSimulationIndexGlobal) {
      setSimulationIndexGlobal(simulationIndex);
    }
  }, [simulationIndex, setSimulationIndexGlobal]);

  const {
    trades,
    setTrades,
    handleManualTrade,
    handleManualExit,
    handleManualCloseTrade,
    handleReset,
    hasActiveTrade,
    displayTrades
  } = useTradeManagement(
    data,
    betaData,
    deltaData,
    simulationIndex,
    tradingConfig,
    leverageSettings,
    latencyDelaySeconds,
    simulationMode,
    parallelAccounts,
    dataSettings.asset
  );

  // Combine aggregate factors into trading config so rules can read them
  const combinedTradingConfig = React.useMemo(() => {
    return {
      ...tradingConfig,
      betaAggregateFactor: dataSettings.betaAggregateFactor,
      deltaAggregateSource: dataSettings.deltaAggregateSource,
      deltaAggregateFactor: dataSettings.deltaAggregateFactor,
    };
  }, [tradingConfig, dataSettings]);

  // Hook taking care of automated entrances/exits and syncing
  useTradeEvaluation(
    simulationIndex,
    tradingEnabled,
    stableConfig,
    data,
    combinedTradingConfig,
    computedIndicators,
    leverageSettings,
    setTrades,
    latencyDelaySeconds,
    parallelAccounts,
    dataSettings.asset,
    serialTradingEnabled,
    setTradingConfig,
    betaData,
    deltaData,
    indicatorSettings
  );

  React.useEffect(() => {
    if (!tradingConfig.autoTradeBreakerByEquityPct || tradingConfig.tradeBreaker) return;

    if (displayTrades.length > 0 && data[simulationIndex]) {
      const currentPrice = data[simulationIndex].close;
      const accountState = collectAllAccountInfo(
        displayTrades,
        parallelAccounts,
        leverageSettings.balance,
        currentPrice,
        leverageSettings.enabled,
        serialTradingEnabled
      );

      const combinedEquityGrowthPct = accountState.initialCombinedBalance > 0 
        ? ((accountState.combinedEquity - accountState.initialCombinedBalance) / accountState.initialCombinedBalance) * 100 
        : 0;

      if (shouldActivateTradeBreaker(combinedEquityGrowthPct, tradingConfig.autoTradeBreakerByEquityPct, tradingConfig.autoTradeBreakerEquityPctValue)) {
        setTimeout(() => {
          setTradingConfig((prev: any) => {
            if (prev.tradeBreaker) return prev;
            return { ...prev, tradeBreaker: true };
          });
        }, 0);
      }
    }
  }, [
    displayTrades, 
    data, 
    simulationIndex, 
    tradingConfig.autoTradeBreakerByEquityPct, 
    tradingConfig.tradeBreaker, 
    tradingConfig.autoTradeBreakerEquityPctValue,
    leverageSettings.balance,
    leverageSettings.enabled,
    parallelAccounts,
    serialTradingEnabled,
    setTradingConfig
  ]);

  // Reactive ML Feature Logging Effect
  React.useEffect(() => {
    if (!isFeatureLogActive) return;
    
    if (!trades || trades.length === 0) {
      if (featureLog.length > 0) {
        setFeatureLog([]); // Auto clear when simulation is reset and trades is emptied
      }
      return;
    }

    // Filter for CLOSED main trades only as specified (opposite of triggered entries)
    const closedMainTrades = trades.filter(t => isMainTrade(t) && t.status === 'CLOSED');
    if (closedMainTrades.length === 0) return;

    // Check which trades are not logged yet
    const loggedIds = new Set(featureLog.map(entry => entry.trade_id));
    const newMainTradesToLog = closedMainTrades.filter(t => !loggedIds.has(t.id));

    if (newMainTradesToLog.length > 0) {
      // Find historical beta & delta indexes aligned with trade entryTime
      const findIndexForTime = (dataset: any[], time: number) => {
        if (!dataset || dataset.length === 0) return 0;
        for (let i = dataset.length - 1; i >= 0; i--) {
          if (dataset[i].time <= time) return i;
        }
        return 0;
      };

      // Resolve presetName
      const currentAsset = dataSettings.asset as string;
      const ohlcParams = dataSettings.ohlcParams || DEFAULT_OHLC_PARAMS;
      const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];

      const activePresetKey = currentAsset === 'Gold'
        ? (Object.keys(GOLD_ONLY_PRESETS) as GoldPresetName[]).find(
            (key) => isPresetActive(GOLD_ONLY_PRESETS[key].params, params)
          )
        : currentAsset === 'Nasdaq100'
          ? (Object.keys(NASDAQ100_PRESETS) as NasdaqPresetName[]).find(
              (key) => isPresetActive(NASDAQ100_PRESETS[key].params, params)
            )
          : currentAsset === 'Oil'
            ? (Object.keys(OIL_PRESETS) as OilPresetName[]).find(
                (key) => isPresetActive(OIL_PRESETS[key].params, params)
              )
            : undefined;

      const presetLabel = activePresetKey
        ? currentAsset === 'Gold'
          ? GOLD_ONLY_PRESETS[activePresetKey as GoldPresetName].label
          : currentAsset === 'Nasdaq100'
            ? NASDAQ100_PRESETS[activePresetKey as NasdaqPresetName].label
            : OIL_PRESETS[activePresetKey as OilPresetName].label
        : undefined;

      const newEntries = newMainTradesToLog.map(trade => {
        const alphaIdx = trade.entryIndex;
        const betaIdx = findIndexForTime(betaData, trade.entryTime);
        const deltaIdx = findIndexForTime(deltaData, trade.entryTime);

        // Calculate synchronized indicator state summaries at precise entry index
        const indState = fetchIndicatorAlpha(
          data,
          betaData,
          deltaData,
          alphaIdx,
          betaIdx,
          deltaIdx,
          indicatorSettings,
          tradingConfig,
          heikinAshiSettings,
          dataSettings.asset as string
        );

        // Fetch trade outcome from trade history book
        const outcome = fetchLastTradeOutcome(trades, trade.id);

        // Generate flat, normalized Feature Log Entry
        return createFeatureLogEntry(
          trade,
          dataSettings.asset as string,
          indState.alphaRows,
          indState.betaRows,
          indState.deltaRows,
          presetLabel,
          outcome,
          indicatorCheckedState
        );
      });

      if (newEntries.length > 0) {
        setFeatureLog(prev => {
          // Double check to avoid duplicates during React concurrent cycles
          const existingIds = new Set(prev.map(e => e.trade_id));
          const uniqueNew = newEntries.filter(e => !existingIds.has(e.trade_id));
          if (uniqueNew.length === 0) return prev;
          return [...prev, ...uniqueNew].slice(-1000);
        });
      }
    }
  }, [
    trades,
    isFeatureLogActive,
    betaData,
    deltaData,
    data,
    indicatorSettings,
    tradingConfig,
    heikinAshiSettings,
    dataSettings,
    setFeatureLog,
    featureLog,
    indicatorCheckedState
  ]);

  const alphaInterval = getBaseInterval(simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const exportBacktestJSON = () => {
    const currentAsset = dataSettings.asset as string;
    const ohlcParams = dataSettings.ohlcParams || DEFAULT_OHLC_PARAMS;
    const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];

    const activePresetKey = currentAsset === 'Gold'
      ? (Object.keys(GOLD_ONLY_PRESETS) as GoldPresetName[]).find(
          (key) => isPresetActive(GOLD_ONLY_PRESETS[key].params, params)
        )
      : currentAsset === 'Nasdaq100'
        ? (Object.keys(NASDAQ100_PRESETS) as NasdaqPresetName[]).find(
            (key) => isPresetActive(NASDAQ100_PRESETS[key].params, params)
          )
        : currentAsset === 'Oil'
          ? (Object.keys(OIL_PRESETS) as OilPresetName[]).find(
              (key) => isPresetActive(OIL_PRESETS[key].params, params)
            )
          : undefined;

    const presetLabel = activePresetKey ? (currentAsset === 'Gold' ? GOLD_ONLY_PRESETS[activePresetKey as GoldPresetName].label : currentAsset === 'Nasdaq100' ? NASDAQ100_PRESETS[activePresetKey as NasdaqPresetName].label : OIL_PRESETS[activePresetKey as OilPresetName].label) : undefined;

    const currentPrice = data[simulationIndex]?.close || 0;
    const accountState = collectAllAccountInfo(
      displayTrades,
      parallelAccounts,
      leverageSettings.balance,
      currentPrice,
      leverageSettings.enabled,
      serialTradingEnabled
    );

    const historyBook: Record<string, any> = {};
    displayTrades.forEach(trade => {
      historyBook[trade.entryTime] = trade;
    });

    const finalMetrics = calculateTradeMetrics(displayTrades, leverageSettings.balance);

    const exportData = {
      metrics: finalMetrics,
      trade_configs: tradingConfig,
      indicator_settings: {
        active_system_config: config,
        volatility_indicators: indicatorSettings.volatility,
        volatility_regime: indicatorSettings.volatilityRegime,
        stop_loss_indicators: indicatorSettings.stopLossIndicator,
        exit_signal_rule: indicatorSettings.volatilityRegime, // or whatever exitSignal is meant to be if missing
        smoothing_indicators: heikinAshiSettings
      },
      trade_settings: {
        serialTradingEnabled,
        ...tradingConfig
      },
      data_layer_config: {
        asset_name: currentAsset,
        preset_name: presetLabel || 'None',
        data_settings: dataSettings,
        timeframe: dataSettings.timeframe,
        candlesticks_chart: {
          alphaVisible: dataSettings.showAlpha,
          betaVisible: dataSettings.showBeta,
          deltaVisible: dataSettings.showDelta
        }
      },
      leverage_mode: {
        initialBalance: leverageSettings.balance,
        leverageEnabled: leverageSettings.enabled,
        positionSizingType: leverageSettings.positionSizingType,
        recurrentPositionSizingType: leverageSettings.recurrentPositionSizingMode,
        ...leverageSettings
      },
      account_settings: parallelAccounts,
      visibility: visibilitySettings,
      final_balance_info: {
        initialBalance: accountState.initialCombinedBalance,
        finalCombinedBalance: accountState.combinedBalance,
        finalCombinedEquity: accountState.combinedEquity,
        equityGrowthPct: accountState.initialCombinedBalance > 0 ? ((accountState.combinedEquity - accountState.initialCombinedBalance) / accountState.initialCombinedBalance) * 100 : 0
      },
      trade_history_book: historyBook
    };

    exportConfigUtility(exportData, currentAsset);
  };

  const handleLoadConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await loadConfigUtility(file);
      
      if (parsed.trade_configs) setTradingConfig((prev: any) => ({ ...prev, ...parsed.trade_configs }));
      if (parsed.indicator_settings) {
        setIndicatorSettings((prev: any) => ({
          ...prev,
          volatility: parsed.indicator_settings.volatility_indicators || prev.volatility,
          volatilityRegime: parsed.indicator_settings.volatility_regime || prev.volatilityRegime,
          stopLossIndicator: parsed.indicator_settings.stop_loss_indicators || prev.stopLossIndicator,
        }));
        if (parsed.indicator_settings.smoothing_indicators) {
          setHeikinAshiSettings((prev: any) => ({ ...prev, ...parsed.indicator_settings.smoothing_indicators }));
        }
      }
      if (parsed.trade_settings) {
          setTradingConfig((prev: any) => ({ ...prev, ...parsed.trade_settings }));
          if (typeof parsed.trade_settings.serialTradingEnabled !== 'undefined') {
            setSerialTradingEnabled(parsed.trade_settings.serialTradingEnabled);
          }
      }
      if (parsed.data_layer_config && parsed.data_layer_config.data_settings) {
         setDataSettings((prev: any) => ({ ...prev, ...parsed.data_layer_config.data_settings }));
      }
      if (parsed.leverage_mode) {
         setLeverageSettings((prev: any) => ({ ...prev, ...parsed.leverage_mode }));
      }
      if (parsed.account_settings) {
         setParallelAccounts(parsed.account_settings);
      }
      if (parsed.visibility) {
         setVisibilitySettings((prev: any) => ({ ...prev, ...parsed.visibility }));
      }
    } catch (e) {
      console.error("Failed to load config", e);
      alert("Failed to load configuration JSON");
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 gap-4">
      <div className="w-full shrink-0 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-hidden">
        <SimulatorControls 
          tradingEnabled={tradingEnabled}
          onTradingToggle={setTradingEnabled}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepBack={() => setSimulationIndex(Math.max(50, simulationIndex - 1))}
          onStepForward={() => setSimulationIndex(Math.min(data.length - 1, simulationIndex + 1))}
          onReset={() => {
            handleReset(setSimulationIndex);
          }}
          typeName={config.type}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
          playbackSpeedMs={playbackSpeedMs}
          setPlaybackSpeedMs={setPlaybackSpeedMs}
        />

        {isPanelOpen && (
          <div className="border-t border-zinc-800 bg-zinc-800/20 shrink-0">
            <div className="flex border-b border-zinc-800/50 flex-wrap overflow-hidden items-center justify-between">
              <div className="flex flex-wrap overflow-hidden">
                 <button onClick={() => setPanelTab('trading')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'trading' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trading & Controls</button>
                 <button onClick={() => setPanelTab('settings')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'settings' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trade Settings</button>
                 <button onClick={() => setPanelTab('leverage')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'leverage' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Leverage Mode</button>
                 <button onClick={() => setPanelTab('account')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'account' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Account Settings</button>
                 <button onClick={() => setPanelTab('visibility')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'visibility' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Visibility</button>
                 <button onClick={() => setPanelTab('indicatorLog')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'indicatorLog' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Indicator Log</button>
                 <button onClick={() => setPanelTab('hftMode')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'hftMode' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}>HFT Mode</button>
                 <button onClick={() => setPanelTab('timeFilter')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'timeFilter' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Time Filter</button>
                 <button onClick={() => setPanelTab('stopLossModifier')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'stopLossModifier' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-400 hover:text-zinc-200'}`}>SL Modifiers</button>
                 <button onClick={() => setPanelTab('consoleLog')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'consoleLog' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Dev Console</button>
              </div>
              <div className="flex items-center">
                 <input id="load-config-input" type="file" accept=".json" className="hidden" onChange={handleLoadConfig} />
                 <button 
                   onClick={() => document.getElementById('load-config-input')?.click()}
                   className="mx-3 flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-700 transition-colors"
                   title="Load backtest state from JSON"
                 >
                   <Upload size={12} />
                   Load Config
                 </button>
                 <button 
                   onClick={exportBacktestJSON}
                   className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-700 transition-colors"
                   title="Export complete backtest state to JSON"
                 >
                   <Download size={12} />
                   Export Config
                 </button>
              </div>
            </div>
            <div className="p-4">
              {panelTab === 'trading' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <TradingConfiguration 
                     config={tradingConfig} 
                     onChange={(c) => setTradingConfig((prev: any) => ({ ...prev, ...c }))} 
                     latestPrice={data[simulationIndex]?.close}
                     stops={computedIndicators?.stops}
                     assetType={dataSettings.asset as string}
                     simulationIndex={simulationIndex}
                   />
                   <ManualControls 
                     hasActiveTrade={hasActiveTrade} 
                     isPlaying={isPlaying} 
                     tradeBreaker={tradingConfig.tradeBreaker}
                     onTrade={handleManualTrade} 
                     onExit={handleManualExit} 
                     onReset={() => {
                       handleReset(setSimulationIndex);
                       
                     }}
                   />
                </div>
              )}
              {panelTab === 'settings' && <TradingPanelTradeSettings />}
              {panelTab === 'leverage' && <TradingPanelLeverageSettings alphaData={data} />}
              {panelTab === 'account' && <TradingPanelAccountSettings />}
              {panelTab === 'visibility' && <TradingPanelVisibility />}
              {panelTab === 'timeFilter' && <TradingPanelTimeFilter />}
              {panelTab === 'stopLossModifier' && <TradingPanelStopLossModifier />}
              {panelTab === 'hftMode' && <TradingPanelHFTMode />}
              {panelTab === 'consoleLog' && <TradingPanelConsoleLog />}
              {panelTab === 'indicatorLog' && (
                <TradingPanelIndicatorLog 
                  alphaData={data} 
                  betaData={betaData} 
                  deltaData={deltaData}
                  simulationIndex={simulationIndex} 
                  betaIndex={betaIndex} 
                  deltaIndex={deltaIndex}
                  config={stableConfig}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-y-auto custom-scrollbar min-h-0">
        <div className={`relative w-full flex flex-col min-h-max`}>
          <div className="p-4 border-b border-zinc-800 flex flex-col gap-4">
             <TradingPanelVolatilityRegime 
               alphaData={data}
               betaData={betaData}
               deltaData={deltaData}
               alphaIndex={simulationIndex}
               betaIndex={betaIndex}
               deltaIndex={deltaIndex}
               alphaInterval={alphaInterval}
               betaInterval={betaInterval}
               deltaInterval={deltaInterval}
             />
             {visibilitySettings.trendStrengthVisible && (
               <>
                 <div className="h-px w-full bg-zinc-800/50" />
                 <TradingPanelTrendStrength 
                   alphaData={data}
                   betaData={betaData}
                   deltaData={deltaData}
                   alphaIndex={simulationIndex}
                   betaIndex={betaIndex}
                   deltaIndex={deltaIndex}
                   alphaInterval={alphaInterval}
                   betaInterval={betaInterval}
                   deltaInterval={deltaInterval}
                 />
               </>
             )}
          </div>
          {(dataSettings.showAlpha && visibilitySettings.alphaVisible) && (
            <div className="w-full h-[550px] relative shrink-0 flex flex-col">
              <CandlestickSimulatorCanvas 
                assetName={dataSettings.asset}
                title={`Alpha Base - ${formatInterval(alphaInterval)}`}
                data={data}
                simulationIndex={simulationIndex}
                config={{
                  ...stableConfig,
                  exitAfterNCandlesMin: tradingConfig.exitAfterNCandlesMin,
                  exitAfterNCandlesMax: tradingConfig.exitAfterNCandlesMax,
                  exitAfterNMinutesMin: tradingConfig.exitAfterNMinutesMin,
                  exitAfterNMinutesMax: tradingConfig.exitAfterNMinutesMax,
                  exitAfterNSecondsMin: tradingConfig.exitAfterNSecondsMin,
                  exitAfterNSecondsMax: tradingConfig.exitAfterNSecondsMax,
                }}
                trades={trades}
                tradingEnabled={tradingEnabled}
                useStopLoss={tradingConfig.useStopLoss}
                useADXFilter={tradingConfig.useADXFilter}
                adxThreshold={tradingConfig.adxThreshold}
                useSqueezeFilter={tradingConfig.useSqueezeFilter}
                visibilitySettings={visibilitySettings}
                dataSource="alpha"
              />
            </div>
          )}
          {(visibilitySettings.secondaryChartsVisible !== false && dataSettings.showBeta && visibilitySettings.betaVisible) && (
            <div className={`w-full h-[350px] relative shrink-0 flex flex-col ${(dataSettings.showAlpha && visibilitySettings.alphaVisible) ? 'border-t border-zinc-800' : ''}`}>
              <CandlestickSimulatorCanvas 
                assetName={dataSettings.asset}
                title={`Beta Aggregate - ${formatInterval(betaInterval)}`}
                data={betaData}
                simulationIndex={betaIndex}
                config={stableConfig}
                trades={[]}
                tradingEnabled={false}
                useStopLoss={false}
                hideIndicators={true}
                visibilitySettings={visibilitySettings}
                dataSource="beta"
              />
            </div>
          )}
          {(visibilitySettings.secondaryChartsVisible !== false && dataSettings.showDelta && visibilitySettings.deltaVisible) && (
            <div className={`w-full h-[350px] relative shrink-0 flex flex-col ${((dataSettings.showAlpha && visibilitySettings.alphaVisible) || (dataSettings.showBeta && visibilitySettings.betaVisible)) ? 'border-t border-zinc-800' : ''}`}>
              <CandlestickSimulatorCanvas 
                assetName={dataSettings.asset}
                title={`Delta Layer - ${formatInterval(deltaInterval)}`}
                data={deltaData}
                simulationIndex={deltaIndex}
                config={stableConfig}
                trades={[]}
                tradingEnabled={false}
                useStopLoss={false}
                hideIndicators={true}
                visibilitySettings={visibilitySettings}
                dataSource="delta"
              />
            </div>
          )}
        </div>
      </div>
      {tradingEnabled && (
        <React.Suspense fallback={<div className="p-4 text-center text-zinc-500 font-mono text-xs">Loading Log Books...</div>}>
          <AccountInfo displayTrades={displayTrades} currentPrice={data[simulationIndex]?.close} />
          <TradeLogBook trades={displayTrades} onReset={() => handleReset(setSimulationIndex)} showPips={simulationMode.startsWith('gold_')} currentPrice={data[simulationIndex]?.close} onCloseTrade={handleManualCloseTrade} />
          {isVisibilityLogActive && <FeatureLogBook />}
        </React.Suspense>
      )}
    </div>
  );
};
