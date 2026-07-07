import React, { useState } from 'react';
import EcommerceDashboardView from './EcommerceDashboardView';
import AgentTheorySidebar from '../../components/AgentTheorySidebar';
import EcommerceAgentSidebar, { EcommerceSidebarView } from '../components/EcommerceAgentSidebar';
import EcommerceDataView from './EcommerceDataView';

export default function EcommerceAgentMainView() {
  const [sidebarView, setSidebarView] = useState<EcommerceSidebarView>('dashboard');
  
  return (
    <div className="w-full h-full flex bg-slate-50 relative">
      <EcommerceAgentSidebar currentView={sidebarView} onNavigate={setSidebarView} />
      
      <div className="flex-1 overflow-hidden relative">
        {sidebarView === 'dashboard' && (
          <EcommerceDashboardView />
        )}
        
        {sidebarView === 'theory' && (
          <div className="h-full overflow-hidden">
            <AgentTheorySidebar agentType="ecommerce" />
          </div>
        )}

        {/* Missing views rendered via data view */}
        {['pricing', 'inventory', 'customer_segmentation', 'forecasting', 'settings'].includes(sidebarView) && (
          <EcommerceDataView viewType={sidebarView as any} />
        )}
      </div>
    </div>
  );
}
