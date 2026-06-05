import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import { CandlestickWithLOB } from './CandlestickWithLOB';
import { OrderBookLab } from './OrderBookLab';
import { GlossaryIntro } from './GlossaryIntro';
import { HorizontalOrderFlow } from './HorizontalOrderFlow';
import { HeroHeader } from './HeroHeader';
import { BentoGridFeatures } from './BentoGridFeatures';
import { MarqueeTicker } from './MarqueeTicker';
import { CodeExplainerShowcase } from './CodeExplainerShowcase';
import { OHLCData } from '../../types';
import { AssetSlider } from './AssetSlider';
import { AssetType } from './simulatedDataGenerator';
import { getPresetsForAsset } from './asset_presets';

interface HomeMainViewProps {
  candlestickData: OHLCData[];
  onToggleUI?: (show: boolean) => void;
  onInitializeEngine?: () => void;
}

export const HomeMainView: React.FC<HomeMainViewProps> = ({ candlestickData, onToggleUI, onInitializeEngine }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [livePrice, setLivePrice] = useState<number>(candlestickData.length > 0 ? candlestickData[candlestickData.length - 1].close : 42065.50);
  const [isLiveRunning, setIsLiveRunning] = useState<boolean>(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('Anonymous');
  const [selectedPreset, setSelectedPreset] = useState<string>('default');

  const assetFilters: AssetType[] = ['Anonymous', 'Gold', 'Silver', 'Oil', 'Nasdaq100'];
  const customParams = selectedPreset === 'default'
    ? undefined
    : getPresetsForAsset(selectedAsset).find((preset) => preset.name === selectedPreset)?.params;

  useEffect(() => {
    return () => {
      if (onToggleUI) onToggleUI(true);
    };
  }, [onToggleUI]);

  useEffect(() => {
    setSelectedPreset('default');
  }, [selectedAsset]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onToggleUI) return;
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 50) {
      onToggleUI(false);
    } else {
      onToggleUI(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={scrollRef}
      onScroll={handleScroll}
      className="w-full h-full bg-zinc-950 text-cyan-50 flex flex-col pt-16 pb-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative"
    >
      {/* Background gradients and vignette */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent pointer-events-none" />
      
      <div className="z-10 w-full flex-1 flex flex-col">
        <div className="px-8 max-w-6xl mx-auto w-full">
          <HeroHeader onInitializeEngine={onInitializeEngine} />
        </div>

        <div className="w-full mb-16">
          <MarqueeTicker />
        </div>
        
        <div className="px-8 flex flex-col items-center w-full max-w-6xl mx-auto space-y-32">
          
          <BentoGridFeatures />

          {/* Zig-Zag Section 0: Code Explainer Showcase */}
          <div className="w-full flex flex-col gap-8 relative">
            <div className="max-w-2xl text-left">
              <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">00 // Educational Features</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Code Walkthroughs</h2>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                 Step-by-step interactive breakdowns of complex trading algorithms and optimization techniques, mapped directly to line highlights.
              </p>
            </div>
            <CodeExplainerShowcase />
          </div>

          {/* Zig-Zag Section 1: Liquidity Depth */}
          <div className="w-full flex flex-col gap-8 relative">
            <div className="max-w-2xl">
              <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">01 // Market Microstructure</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Liquidity Depth Analysis</h2>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                 Simulate High-Frequency Trading architectures with microsecond precision. Monitor order flows, liquidity imbalances, and latency impacts in real-time.
              </p>
            </div>

            {/* Beautiful Interactive Preset/Regime Panel similar to leverage version 3 */}
            <div className="mt-4 bg-zinc-900/45 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-sm relative overflow-hidden" style={{ transform: 'perspective(1200px) rotateX(5deg) rotateZ(-1deg) scaleX(1.1)', transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800/60 pb-4 mb-4 gap-4">
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase font-mono flex items-center gap-2">
                    <span className="p-1 rounded bg-cyan-950 text-cyan-400">🧠</span>
                    {selectedAsset} VOLATILITY REGIMES & PRESETS
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 max-w-xl">
                    Select a recurring macroeconomic or session behavior to dynamically re-calibrate the generator parameters (volatility, trend speed, wicks) in real-time.
                  </p>
                </div>
                {selectedPreset !== 'default' && (
                  <button 
                    onClick={() => setSelectedPreset('default')}
                    className="text-[10px] bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-cyan-400 border border-zinc-700/60 transition-all rounded px-3 py-1.5 uppercase font-mono font-bold tracking-wider cursor-pointer"
                  >
                    Reset to Baseline Default
                  </button>
                )}
              </div>

              {selectedAsset === 'Anonymous' ? (
                <div className="py-8 text-center text-xs text-zinc-500 font-mono italic">
                   No specific historical regime presets loaded for Anonymous asset. Switch to Gold, Silver, Oil, or Nasdaq100 to preview macro profiles.
                </div>
              ) : (() => {
                const presets = getPresetsForAsset(selectedAsset);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                    {/* Default Baseline Card */}
                    <button
                      onClick={() => setSelectedPreset('default')}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[96px] group cursor-pointer ${
                        selectedPreset === 'default'
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.06)]'
                          : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-350'
                      }`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold tracking-wide ${selectedPreset === 'default' ? 'text-cyan-400' : 'text-zinc-200 group-hover:text-cyan-400 font-mono transition-colors'}`}>
                            Default Baseline
                          </span>
                          {selectedPreset === 'default' && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/30">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-light font-sans mt-0.5 line-clamp-3">
                           The standard balanced market behavior representing general intraday liquid trading without macro shocks or event disruption.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                        <span>vol: <span className="text-zinc-350 font-bold">1.0x</span></span>
                        <span>•</span>
                        <span>drift: <span className="text-zinc-350 font-bold">1.0x</span></span>
                        <span>•</span>
                        <span>seed: <span className="text-zinc-350 font-bold">std</span></span>
                      </div>
                    </button>

                    {presets.map((p) => {
                      const isActive = selectedPreset === p.name;
                      return (
                        <button
                          key={p.name}
                          onClick={() => setSelectedPreset(p.name)}
                          className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[96px] group cursor-pointer ${
                            isActive
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                              : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-350'
                          }`}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold tracking-wide ${isActive ? 'text-amber-400' : 'text-zinc-200 group-hover:text-amber-400 transition-colors'}`}>
                                {p.label}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/30">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-light mt-0.5 line-clamp-3 font-sans">
                              {p.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                            <span>vol: <span className="text-zinc-300 font-bold">{(p.params.volatility * 1000).toFixed(1)}m</span></span>
                            <span>•</span>
                            <span>drift: <span className="text-zinc-300 font-bold">{(p.params.drift * 100000).toFixed(0)}μ</span></span>
                            <span>•</span>
                            <span>wick: <span className="text-zinc-300 font-bold">{(p.params.wick_factor ?? 0.3).toFixed(2)}</span></span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            
            <div className="w-full relative mt-8">
              <div className="absolute -top-4 right-8 z-50 flex items-center gap-4">
                <AssetSlider 
                  assetFilters={assetFilters} 
                  value={selectedAsset} 
                  onChange={setSelectedAsset} 
                  selectedPreset={selectedPreset}
                  onPresetChange={setSelectedPreset}
                />
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 shadow-lg border border-zinc-700/50 rounded-lg text-emerald-400 font-bold text-xs uppercase tracking-widest transition-all hover:bg-zinc-800"
                  onClick={() => setIsLiveRunning(!isLiveRunning)}
                >
                  {isLiveRunning ? <Pause className="w-4 h-4 text-emerald-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
                  {isLiveRunning ? 'Live Running' : 'Paused'}
                </button>
              </div>
              
              <div id="liquidity-depth" className="w-full h-[550px] shrink-0 overflow-visible relative z-10 block">
                <CandlestickWithLOB 
                  data={candlestickData} 
                  onPriceChange={setLivePrice} 
                  isLiveRunning={isLiveRunning} 
                  assetType={selectedAsset} 
                  customParams={customParams}
                />
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 2: Order Flow */}
          <div className="w-full flex flex-col gap-8">
            <div className="max-w-2xl self-end text-right">
              <span className="text-cyan-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">02 // Execution Simulation</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Horizontal Order Flow</h2>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Visualize the relentless stream of market orders interacting with resting liquidity. Track delta and volume accumulation block by block.
              </p>
            </div>
            
            <div id="horizontal-order-flow" className="w-[100vw] ml-[calc(-50vw+50%)] mt-16 bg-zinc-900 border-y border-zinc-800/80 p-8 shadow-2xl overflow-hidden" style={{ transform: 'skewY(-5deg)' }}>
              <div className="max-w-6xl mx-auto w-full">
                <HorizontalOrderFlow externalPrice={livePrice} />
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 3: Interactive Sandbox */}
          <div className="w-full flex flex-col gap-8">
            <div className="max-w-2xl">
              <span className="text-blue-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">03 // Interactive Sandbox</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Order Book Lab</h2>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Bridging the gap between theory and runtime. Manually inject orders and see how the matching engine resolves the spread and shapes the limit order book.
              </p>
            </div>

            <div id="order-book-lab" className="w-full mt-4 bg-zinc-900 border border-zinc-800/80 rounded-3xl p-4 shadow-2xl">
              <OrderBookLab />
            </div>
          </div>
          
          <div className="w-full">
             <GlossaryIntro />
          </div>

          {/* Footer Layout */}
          <div className="w-full py-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-zinc-500 uppercase tracking-widest gap-4">
             <div>&copy; 2026 GPTX.VIP INC.</div>
             <div className="flex gap-4 flex-wrap items-center justify-center">
                <span>DOCUMENTATION ENGINE</span>
                <span>//</span>
                <span>V1.0.4</span>
                <span>//</span>
                <span className="normal-case tracking-normal text-zinc-400">aliyan@gptx.vip</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LOCAL RUNTIME_
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
