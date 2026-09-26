import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import { HeroHeader } from './HeroHeader';
import { BentoGridFeatures } from './BentoGridFeatures';
import { MarqueeTicker } from './MarqueeTicker';

// Lazy load below-the-fold heavy components to improve FCP, LCP, TBT, Speed Index
const CandlestickWithLOB = lazy(() => import('./CandlestickWithLOB').then(m => ({ default: m.CandlestickWithLOB })));
const OrderBookLab = lazy(() => import('./OrderBookLab').then(m => ({ default: m.OrderBookLab })));
const GlossaryIntro = lazy(() => import('./GlossaryIntro').then(m => ({ default: m.GlossaryIntro })));
const HorizontalOrderFlow = lazy(() => import('./HorizontalOrderFlow').then(m => ({ default: m.HorizontalOrderFlow })));
const CodeExplainerShowcase = lazy(() => import('./CodeExplainerShowcase').then(m => ({ default: m.CodeExplainerShowcase })));
import { OHLCData } from '../../types';
import { AssetSlider } from './AssetSlider';
import { AssetType } from './simulatedDataGenerator';
import { getPresetsForAsset } from './asset_presets';
import { SpacetimeBackground } from './SpacetimeBackground';

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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // Initial check
    if (typeof document !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      
      // Setup observer for class changes on documentElement
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  const assetFilters: AssetType[] = ['Anonymous', 'Gold', 'Silver', 'Oil', 'Nasdaq100', 'USDJPY', 'GBPJPY', 'EURJPY', 'EURUSD', 'AUDUSD', 'USDCAD', 'EURCAD'];

  // Reset preset selection when switching assets
  useEffect(() => {
    setSelectedPreset('default');
  }, [selectedAsset]);

  // Derive simulation params based on asset and active preset
  const customParams = useMemo(() => {
    if (selectedPreset === 'default') return undefined;
    const presets = getPresetsForAsset(selectedAsset);
    return presets.find(p => p.name === selectedPreset)?.params;
  }, [selectedAsset, selectedPreset]);

  useEffect(() => {
    return () => {
      if (onToggleUI) onToggleUI(true);
    };
  }, [onToggleUI]);

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
      className="w-full h-full bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-cyan-50 flex flex-col pt-16 pb-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative transition-colors duration-300"
    >
      {/* Background gradients and vignette */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200 dark:from-blue-500 via-transparent to-transparent pointer-events-none" />
      
      {!isDarkMode && <SpacetimeBackground />}
      
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
          <div className="w-full flex flex-col gap-8 relative z-10">
            <div className="max-w-2xl text-left">
              <span className="text-indigo-600 dark:text-indigo-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">00 // Educational Features</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4 transition-colors">Code Walkthroughs</h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg transition-colors">
                 Step-by-step interactive breakdowns of complex trading algorithms and optimization techniques, mapped directly to line highlights.
              </p>
            </div>
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-zinc-500">Loading Showcase...</div>}>
              <CodeExplainerShowcase />
            </Suspense>
          </div>

          {/* Zig-Zag Section 1: Liquidity Depth */}
          <div className="w-full flex flex-col gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-emerald-600 dark:text-emerald-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">01 // Market Microstructure</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4 transition-colors">Liquidity Depth Analysis</h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg transition-colors">
                 Simulate High-Frequency Trading architectures with microsecond precision. Monitor order flows, liquidity imbalances, and latency impacts in real-time.
              </p>
            </div>

            {/* Beautiful Interactive Preset/Regime Panel similar to leverage version 3 */}
            <div className="mt-4 bg-white/60 dark:bg-zinc-900/45 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md relative overflow-hidden transition-colors" style={{ transform: 'perspective(1200px) rotateX(5deg) rotateZ(-1deg) scaleX(1.1)', transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 dark:from-cyan-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-4 gap-4">
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-cyan-700 dark:text-cyan-400 uppercase font-mono flex items-center gap-2">
                    <span className="p-1 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">🧠</span>
                    {selectedAsset} VOLATILITY REGIMES & PRESETS
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 max-w-xl">
                    Select a recurring macroeconomic or session behavior to dynamically re-calibrate the generator parameters (volatility, trend speed, wicks) in real-time.
                  </p>
                </div>
                {selectedPreset !== 'default' && (
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('default')}
                    className="text-[10px] bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 border border-zinc-300/60 dark:border-zinc-700/60 transition-all rounded px-3 py-1.5 uppercase font-mono font-bold tracking-wider cursor-pointer"
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
                    type="button"
                    aria-pressed={selectedPreset === 'default'}
                    onClick={() => setSelectedPreset('default')}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[96px] group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                        selectedPreset === 'default'
                          ? 'bg-cyan-50/50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'bg-zinc-50/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 text-zinc-600 dark:text-zinc-350'
                      }`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold tracking-wide ${selectedPreset === 'default' ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-700 dark:text-zinc-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 font-mono transition-colors'}`}>
                            Default Baseline
                          </span>
                          {selectedPreset === 'default' && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300/30 dark:border-cyan-800/30">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-light font-sans mt-0.5 line-clamp-3">
                           The standard balanced market behavior representing general intraday liquid trading without macro shocks or event disruption.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-zinc-200/40 dark:border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                        <span>vol: <span className="text-zinc-700 dark:text-zinc-350 font-bold">1.0x</span></span>
                        <span>•</span>
                        <span>drift: <span className="text-zinc-700 dark:text-zinc-350 font-bold">1.0x</span></span>
                        <span>•</span>
                        <span>seed: <span className="text-zinc-700 dark:text-zinc-350 font-bold">std</span></span>
                      </div>
                    </button>

                    {presets.map((p) => {
                      const isActive = selectedPreset === p.name;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setSelectedPreset(p.name)}
                          className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[96px] group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${
                            isActive
                              ? 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                              : 'bg-zinc-50/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 text-zinc-600 dark:text-zinc-350'
                          }`}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold tracking-wide ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'}`}>
                                {p.label}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300/30 dark:border-amber-800/30">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-light mt-0.5 line-clamp-3 font-sans">
                              {p.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-200/40 dark:border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                            <span>vol: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{(p.params.volatility * 1000).toFixed(1)}m</span></span>
                            <span>•</span>
                            <span>drift: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{(p.params.drift * 100000).toFixed(0)}μ</span></span>
                            <span>•</span>
                            <span>wick: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{(p.params.wick_factor ?? 0.3).toFixed(2)}</span></span>
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
                  type="button"
                  aria-pressed={isLiveRunning}
                  aria-label={isLiveRunning ? 'Pause simulated price feed' : 'Resume simulated price feed'}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => setIsLiveRunning((running) => !running)}
                >
                  {isLiveRunning ? <Pause className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />}
                  {isLiveRunning ? 'Simulation running' : 'Simulation paused'}
                </button>
              </div>

              <div id="liquidity-depth" className="w-full h-[550px] shrink-0 overflow-visible relative z-10 block">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-zinc-500">Loading Chart...</div>}>
                  <CandlestickWithLOB 
                    data={candlestickData} 
                    onPriceChange={setLivePrice} 
                    isLiveRunning={isLiveRunning} 
                    assetType={selectedAsset} 
                    customParams={customParams}
                    isDarkMode={isDarkMode}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 2: Order Flow */}
          <div className="w-full flex flex-col gap-8 relative z-10">
            <div className="max-w-2xl self-end text-right">
              <span className="text-cyan-600 dark:text-cyan-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">02 // Execution Simulation</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4 transition-colors">Horizontal Order Flow</h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg transition-colors">
                Visualize the relentless stream of market orders interacting with resting liquidity. Track delta and volume accumulation block by block.
              </p>
            </div>
            
            <div id="horizontal-order-flow" className="w-[100vw] ml-[calc(-50vw+50%)] mt-16 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800/80 p-8 shadow-2xl overflow-hidden transition-colors" style={{ transform: 'skewY(-5deg)' }}>
              <div className="max-w-6xl mx-auto w-full">
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-zinc-500">Loading Order Flow...</div>}>
                  <HorizontalOrderFlow externalPrice={livePrice} assetType={selectedAsset} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 3: Interactive Sandbox */}
          <div className="w-full flex flex-col gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-blue-600 dark:text-blue-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">03 // Interactive Sandbox</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4 transition-colors">Order Book Lab</h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg transition-colors">
                Bridging the gap between theory and runtime. Manually inject orders and see how the matching engine resolves the spread and shapes the limit order book.
              </p>
            </div>

            <div id="order-book-lab" className="w-full mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-4 shadow-2xl transition-colors">
              <Suspense fallback={<div className="h-64 flex items-center justify-center text-zinc-500">Loading Lab...</div>}>
                <OrderBookLab />
              </Suspense>
            </div>
          </div>
          
          <div className="w-full relative z-10">
             <Suspense fallback={<div className="h-32 flex items-center justify-center text-zinc-500">Loading Glossary...</div>}>
               <GlossaryIntro />
             </Suspense>
          </div>

          {/* Footer Layout */}
          <div className="w-full py-8 px-8 mt-12 bg-white/60 dark:bg-transparent backdrop-blur-md border border-zinc-200 dark:border-t-zinc-800 dark:border-x-transparent dark:border-b-transparent rounded-2xl md:rounded-full flex flex-col md:flex-row items-center justify-between font-mono text-xs text-zinc-700 dark:text-zinc-500 uppercase tracking-widest gap-4 transition-colors relative z-10 shadow-sm dark:shadow-none mb-12">
             <div className="font-bold">&copy; 2026 GPTX.VIP INC.</div>
             <div className="flex gap-4 font-semibold">
                <span>DOCUMENTATION ENGINE</span>
                <span className="text-zinc-400 dark:text-zinc-700">//</span>
                <span>V1.0.4</span>
             </div>
             <div className="flex items-center gap-2 font-bold bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                LOCAL RUNTIME_
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
