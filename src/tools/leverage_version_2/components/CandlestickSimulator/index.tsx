import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval, getLowestActiveIntervalDelay } from '../../functions/api/rules/dataSourceRules';
import { collectAllAccountInfo } from '../../functions/api/middleware/collectAllAccountInfo';
import { shouldActivateTradeBreaker } from '../../functions/api/tradeBreaker/tradeBreakerByEquity';

import { TradeLogBook } from '../TradeLogBook';
import { CandlestickSimulatorCanvas } from '../CandlestickSimulatorCanvas';
import { SimulatorControls } from '../simulator/SimulatorControls';
import { TradingConfiguration } from '../simulator/TradingConfiguration';
import { ManualControls } from '../simulator/ManualControls';
import { TradingPanelDataSettings } from '../simulator/TradingPanelDataSettings';
import { TradingPanelLeverageSettings } from '../simulator/TradingPanelLeverageSettings';
import { TradingPanelAccountSettings } from '../simulator/TradingPanelAccountSettings';
import { TradingPanelTradeSettings } from '../simulator/TradingPanelTradeSettings';
import { TradingPanelVisibility } from '../simulator/TradingPanelVisibility';
import { TradingPanelVolatilityRegime } from '../simulator/TradingPanelVolatilityRegime';
import { AccountInfo } from '../simulator/AccountInfo';

import { CandlestickSimulatorProps } from './types';
import { useSimulatorState } from './useSimulatorState';
import { useComputedIndicators } from './useComputedIndicators';
import { useTradeEvaluation } from './useTradeEvaluation';
import { useTradeManagement } from './useTradeManagement';

export * from './types';

export const CandlestickSimulator: React.FC<CandlestickSimulatorProps> = ({ config }) => {
  const [panelTab, setPanelTab] = useState<'trading' | 'data' | 'leverage' | 'settings' | 'volatility' | 'account' | 'visibility'>('trading');
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { tradingConfig, setTradingConfig, dataSettings, leverageSettings, setLeverageSettings, indicatorSettings, visibilitySettings, parallelAccounts, serialTradingEnabled } = useIndicatorsStore();
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
    indicatorSettings
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

  const {
    trades,
    setTrades,
    handleManualTrade,
    handleManualExit,
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

  // Hook taking care of automated entrances/exits and syncing
  useTradeEvaluation(
    simulationIndex,
    tradingEnabled,
    stableConfig,
    data,
    tradingConfig,
    computedIndicators,
    leverageSettings,
    setTrades,
    latencyDelaySeconds,
    parallelAccounts,
    dataSettings.asset,
    serialTradingEnabled,
    setTradingConfig
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

  const alphaInterval = getBaseInterval(simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

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
            setLeverageSettings(prev => ({ ...prev, balance: 100 }));
          }}
          typeName={config.type}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
          playbackSpeedMs={playbackSpeedMs}
          setPlaybackSpeedMs={setPlaybackSpeedMs}
        />

        {isPanelOpen && (
          <div className="border-t border-zinc-800 bg-zinc-800/20 shrink-0">
            <div className="flex border-b border-zinc-800/50 flex-wrap overflow-hidden">
               <button onClick={() => setPanelTab('trading')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'trading' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trading & Controls</button>
               <button onClick={() => setPanelTab('settings')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'settings' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trade Settings</button>
               <button onClick={() => setPanelTab('data')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'data' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Data Layer Config</button>
               <button onClick={() => setPanelTab('leverage')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'leverage' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Leverage Mode</button>
               <button onClick={() => setPanelTab('account')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'account' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Account Settings</button>
               <button onClick={() => setPanelTab('visibility')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'visibility' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Visibility</button>
            </div>
            <div className="p-4">
              {panelTab === 'trading' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <TradingConfiguration config={tradingConfig} onChange={(c) => setTradingConfig((prev: any) => ({ ...prev, ...c }))} />
                   <ManualControls 
                     hasActiveTrade={hasActiveTrade} 
                     isPlaying={isPlaying} 
                     tradeBreaker={tradingConfig.tradeBreaker}
                     onTrade={handleManualTrade} 
                     onExit={handleManualExit} 
                     onReset={() => {
                       handleReset(setSimulationIndex);
                       setLeverageSettings(prev => ({ ...prev, balance: 100 }));
                     }}
                   />
                </div>
              )}
              {panelTab === 'settings' && <TradingPanelTradeSettings />}
              {panelTab === 'data' && <TradingPanelDataSettings />}
              {panelTab === 'leverage' && <TradingPanelLeverageSettings />}
              {panelTab === 'account' && <TradingPanelAccountSettings />}
              {panelTab === 'visibility' && <TradingPanelVisibility />}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-y-auto custom-scrollbar min-h-0">
        <div className={`relative w-full flex flex-col min-h-max`}>
          <div className="p-4 border-b border-zinc-800">
             <TradingPanelVolatilityRegime data={data} simulationIndex={simulationIndex} />
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
          {(dataSettings.showBeta && visibilitySettings.betaVisible) && (
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
          {(dataSettings.showDelta && visibilitySettings.deltaVisible) && (
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
        <>
          <AccountInfo displayTrades={displayTrades} currentPrice={data[simulationIndex]?.close} />
          <TradeLogBook trades={displayTrades} onReset={() => handleReset(setSimulationIndex)} showPips={simulationMode.startsWith('gold_')} currentPrice={data[simulationIndex]?.close} />
        </>
      )}
    </div>
  );
};
