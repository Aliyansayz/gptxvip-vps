import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

const StarterLab = lazy(() => import('../tools/starter_version/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const StarterStore = lazy(() => import('../tools/starter_version/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLab = lazy(() => import('../tools/leverage_version_1/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStore = lazy(() => import('../tools/leverage_version_1/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLabV2 = lazy(() => import('../tools/leverage_version_2/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStoreV2 = lazy(() => import('../tools/leverage_version_2/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLabV3 = lazy(() => import('../tools/leverage_version_3/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStoreV3 = lazy(() => import('../tools/leverage_version_3/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLiveStarterLab = lazy(() => import('../tools/leverage_version_live_starter/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageLiveStarterStore = lazy(() => import('../tools/leverage_version_live_starter/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

interface TradingToolsViewProps {
  activeSubTab: string;
}

const LoadingFallback = () => (
  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-500">
    <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
    <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Loading Module...</p>
  </div>
);

export const TradingToolsView: React.FC<TradingToolsViewProps> = ({ activeSubTab }) => {
  const activeLab = 
    activeSubTab === 'leverage-view-live-starter' ? 'leverage-live-starter' :
    activeSubTab === 'leverage-view-v3' ? 'leverage-v3' : 
    activeSubTab === 'leverage-view-v2' ? 'leverage-v2' : 
    activeSubTab === 'leverage-view' ? 'leverage' : 
    'starter';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full p-4 md:p-8 relative"
    >
      <div className="z-10 max-w-[1800px] mx-auto w-full h-full flex flex-col relative pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {activeLab === 'starter' ? (
                <StarterStore>
                  <StarterLab />
                </StarterStore>
              ) : activeLab === 'leverage-live-starter' ? (
                <LeverageLiveStarterStore>
                  <LeverageLiveStarterLab />
                </LeverageLiveStarterStore>
              ) : activeLab === 'leverage-v3' ? (
                <LeverageStoreV3>
                  <LeverageLabV3 />
                </LeverageStoreV3>
              ) : activeLab === 'leverage-v2' ? (
                <LeverageStoreV2>
                  <LeverageLabV2 />
                </LeverageStoreV2>
              ) : (
                <LeverageStore>
                  <LeverageLab />
                </LeverageStore>
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

