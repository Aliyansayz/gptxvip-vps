import React, { useState } from 'react';
import ThreatIntelAgentSidebar, { ThreatIntelSidebarView } from '../components/ThreatIntelAgentSidebar';
import ThreatIntelDashboardView from './ThreatIntelDashboardView';
import ThreatIntelToolsView from './ThreatIntelToolsView';
import ThreatIntelDataView from './ThreatIntelDataView';
import ThreatIntelTutorialTour from '../tutorial/ThreatIntelTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';

export default function ThreatIntelAgentMainView() {
  const [sidebarView, setSidebarView] = useState<ThreatIntelSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [intelLogs, setIntelLogs] = useState<string[]>([]);

  const handleRunTutorial = () => {
    setRunTutorial(false);
    setTimeout(() => {
      setRunTutorial(true);
    }, 100);
  };

  const investigateTarget = () => {
    setSidebarView('targeted_alerts');
    setIntelLogs(['> Cross-referencing global chatter with internal Asset Inventory...']);
    
    // Simulate investigation steps
    setTimeout(() => setIntelLogs(prev => [...prev, '> OSINT Match: Detected discussions on Exploit.in regarding CVE-2026-8899.']), 1500);
    setTimeout(() => setIntelLogs(prev => [...prev, '> Asset Correlation: Found vulnerable Nginx instance (v1.20) on 10.0.0.55 (Web-01).']), 3000);
    setTimeout(() => setIntelLogs(prev => [...prev, '> Contextualizing: High probability of exploitation within 48 hours.']), 4500);
    setTimeout(() => setIntelLogs(prev => [...prev, '> Action: Generating WAF block rules (STIX format) for known malicious payloads.']), 6000);
    setTimeout(() => setIntelLogs(prev => [...prev, '> CRITICAL: Alerting SOC and pushing rules to SIEM/WAF Pipeline.']), 7500);
  };

  const handleSidebarNavigate = (view: ThreatIntelSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <ThreatIntelTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <ThreatIntelAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <ThreatIntelDashboardView onInvestigateTarget={investigateTarget} onRunTutorial={handleRunTutorial} />
          )}

          {sidebarView === 'tools' && (
            <div className="threat-intel-tools h-full">
               <ThreatIntelToolsView />
            </div>
          )}

          {sidebarView === 'targeted_alerts' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50">
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Intelligence Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-mono uppercase font-semibold">Contextualization Active</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-sm text-slate-600 overflow-y-auto space-y-2">
                  {intelLogs.length === 0 && (
                    <div className="text-slate-500 italic">No targeted alert currently under analysis. Return to the Command Center.</div>
                  )}
                  {intelLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('Action') ? 'text-purple-700 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {intelLogs.length > 0 && <div className="animate-pulse text-purple-600">_</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['global_feed', 'osint', 'darkweb', 'cve_monitor', 'settings'].includes(sidebarView) && (
            <ThreatIntelDataView viewType={sidebarView as any} />
          )}
          
          {sidebarView === 'theory' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <SvgTheoryIllustration />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Theory Wiki Pane is Open</h3>
              <p className="text-sm">Check the right side of your screen to access the theory library.</p>
            </div>
          )}

        </div>
        
        {/* Right Side Theory Pane */}
        {showTheoryPane && (
          <div className="w-[450px] border-l border-slate-200 bg-white h-full shadow-2xl shrink-0 overflow-hidden relative z-40 flex flex-col animate-in slide-in-from-right-full duration-300">
            <button 
              onClick={() => {
                 setIsTheoryPaneOpen(false);
                 if (sidebarView === 'theory') setSidebarView('dashboard');
              }}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-md z-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="threat_intel" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
