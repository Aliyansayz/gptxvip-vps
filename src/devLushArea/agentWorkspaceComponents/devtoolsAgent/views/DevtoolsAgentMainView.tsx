import React, { useState } from 'react';
import DevtoolsDashboardView from './DevtoolsDashboardView';
import AgentTheorySidebar from '../../components/AgentTheorySidebar';
import AgentSidebar, { SidebarView } from '../../components/AgentSidebar';
import { Activity } from 'lucide-react';

export default function DevtoolsAgentMainView() {
  const [sidebarView, setSidebarView] = useState<SidebarView>('dashboard');
  
  return (
    <div className="w-full h-full flex bg-slate-50 relative">
      <AgentSidebar currentView={sidebarView} onNavigate={setSidebarView} agentName="DevTools Agent" />
      
      <div className="flex-1 overflow-hidden relative">
        {sidebarView === 'dashboard' && (
          <DevtoolsDashboardView />
        )}
        
        {sidebarView === 'theory' && (
          <div className="h-full overflow-hidden">
            <AgentTheorySidebar agentType="devtools" />
          </div>
        )}

        {/* Fallback for un-implemented tabs */}
        {sidebarView !== 'dashboard' && sidebarView !== 'theory' && (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <Activity className="w-16 h-16 mb-4 text-slate-200" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Workspace in Development</h3>
            <p className="text-sm">This section is currently being provisioned for the Devtools Agent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
