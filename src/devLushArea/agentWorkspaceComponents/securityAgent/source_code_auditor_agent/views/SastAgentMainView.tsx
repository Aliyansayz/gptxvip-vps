import React, { useState } from 'react';
import SastDashboardView from './SastDashboardView';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import SastAgentSidebar, { SastSidebarView } from '../components/SastAgentSidebar';
import SastDataView from './SastDataView';
import { Activity } from 'lucide-react';
import SastTutorialTour from '../tutorial/SastTutorialTour';

export default function SastAgentMainView() {
  const [sidebarView, setSidebarView] = useState<SastSidebarView>('dashboard');
  const [runTutorial, setRunTutorial] = useState(true);

  const handleRunTutorial = () => {
    setRunTutorial(false);
    setTimeout(() => {
      setRunTutorial(true);
    }, 100);
  };

  return (
    <div className="w-full h-full flex bg-slate-50 relative">
      <SastAgentSidebar currentView={sidebarView} onNavigate={setSidebarView} />
      
      <div className="flex-1 overflow-hidden relative">
        {sidebarView === 'dashboard' && (
          <SastDashboardView onRunTutorial={handleRunTutorial} />
        )}
        
        {sidebarView === 'theory' && (
          <div className="h-full overflow-hidden">
            <AgentTheorySidebar agentType="sast" />
          </div>
        )}

        {/* Fallback for un-implemented tabs */}
        {['pr_reviews', 'secrets', 'dependencies', 'settings'].includes(sidebarView) && (
          <SastDataView viewType={sidebarView as any} />
        )}
      </div>

      <SastTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />
    </div>
  );
}
