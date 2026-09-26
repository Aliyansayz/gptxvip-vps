import React, { useState } from 'react';
import LegalContractDashboardView from './LegalContractDashboardView';
import LegalContractAgentSidebar, { LegalContractSidebarView } from '../components/LegalContractAgentSidebar';
import LegalContractDataView from './LegalContractDataView';

export default function LegalContractAgentMainView() {
  const [sidebarView, setSidebarView] = useState<LegalContractSidebarView>('dashboard');
  
  return (
    <div className="w-full h-full flex bg-slate-50 relative">
      <LegalContractAgentSidebar currentView={sidebarView} onNavigate={setSidebarView} />
      
      <div className="flex-1 overflow-hidden relative">
        {sidebarView === 'dashboard' && (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
             <LegalContractDashboardView />
          </div>
        )}

        {/* Missing views rendered via data view */}
        {['redlining', 'liabilities', 'compliance', 'settings', 'theory'].includes(sidebarView) && (
          <LegalContractDataView viewType={sidebarView as any} />
        )}
      </div>
    </div>
  );
}
