import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

const StarterLab = lazy(() => import('../finhub/tools/starter_version/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const StarterStore = lazy(() => import('../finhub/tools/starter_version/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLab = lazy(() => import('../finhub/tools/leverage_version_1/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStore = lazy(() => import('../finhub/tools/leverage_version_1/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLabV2 = lazy(() => import('../finhub/tools/leverage_version_2/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStoreV2 = lazy(() => import('../finhub/tools/leverage_version_2/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLabV3 = lazy(() => import('../finhub/tools/leverage_version_3/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageStoreV3 = lazy(() => import('../finhub/tools/leverage_version_3/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

const LeverageLiveStarterLab = lazy(() => import('../finhub/tools/leverage_version_live_starter/components/TradingToolsLab').then(m => ({ default: m.TradingToolsLab })));
const LeverageLiveStarterStore = lazy(() => import('../finhub/tools/leverage_version_live_starter/stores/indicators_store').then(m => ({ default: m.IndicatorsStoreProvider })));

interface TradingToolsViewProps {
  activeSubTab: string;
  isArchive?: boolean;
}

const toolLabels: Record<string, string> = {
  'lab-view': 'Starter Edition Tools',
  'leverage-view': 'Leverage Trading Version 1',
  'leverage-view-v2': 'Leverage Trading Version 2',
  'leverage-view-v3': 'Leverage Trading Version 3',
  'leverage-view-live-starter': 'Leverage Version Live Starter',
};

const LoadingFallback: React.FC<{ label: string }> = ({ label }) => (
  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-500">
    <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
    <p role="status" className="font-mono text-sm uppercase tracking-widest text-zinc-400">Loading {label}...</p>
  </div>
);

export const TradingToolsView: React.FC<TradingToolsViewProps> = ({ activeSubTab, isArchive = false }) => {
  const activeLab = 
    activeSubTab === 'leverage-view-live-starter' ? 'leverage-live-starter' :
    activeSubTab === 'leverage-view-v3' ? 'leverage-v3' : 
    activeSubTab === 'leverage-view-v2' ? 'leverage-v2' : 
    activeSubTab === 'leverage-view' ? 'leverage' : 
    'starter';
  const toolLabel = toolLabels[activeSubTab] || toolLabels['lab-view'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full p-4 md:p-8 relative"
    >
      <div className="z-10 max-w-[1800px] mx-auto w-full h-full flex flex-col relative pb-12">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              {isArchive ? 'Archived tool' : 'Trading workspace'}
            </p>
            <h2 className="mt-1 text-lg font-bold normal-case tracking-tight text-zinc-900 dark:text-zinc-100">{toolLabel}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {isArchive
                ? 'Earlier tool versions are kept here for reference. Choose Trading Tools in the navigation to open the current workspace.'
                : 'Choose a version from the sidebar. This workspace uses the selected version and its own settings.'}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isArchive ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>
            {isArchive ? 'Reference' : 'Available'}
          </span>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingFallback label={toolLabel} />}>
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
