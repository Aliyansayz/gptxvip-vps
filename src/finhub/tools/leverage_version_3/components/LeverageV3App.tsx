import React, { useState } from 'react';
import { TradingToolsLab } from './TradingToolsLab';
import { MultiInstanceDashboard } from './MultiInstanceDashboard';
import { IndicatorsStoreProvider } from '../stores/indicators_store';

export const LeverageV3App: React.FC = () => {
  const [isParallelMode, setIsParallelMode] = useState(false);

  if (isParallelMode) {
    return <MultiInstanceDashboard onExitParallelMode={() => setIsParallelMode(false)} />;
  }

  return (
    <IndicatorsStoreProvider>
      <TradingToolsLab 
        isParallelModeActive={false} 
        onToggleParallelMode={() => setIsParallelMode(true)} 
      />
    </IndicatorsStoreProvider>
  );
};
