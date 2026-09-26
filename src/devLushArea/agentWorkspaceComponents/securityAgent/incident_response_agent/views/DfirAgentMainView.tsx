import React, { useState } from 'react';
import DfirAgentSidebar, { DfirSidebarView } from '../components/DfirAgentSidebar';
import DfirDashboardView from './DfirDashboardView';
import DfirToolsView from './DfirToolsView';
import DfirDataView from './DfirDataView';
import DfirTutorialTour from '../tutorial/DfirTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';

export default function DfirAgentMainView() {
  const [sidebarView, setSidebarView] = useState<DfirSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const startInvestigation = () => {
    setSidebarView('investigations');
    setScanLogs(['> Ingesting SIEM alerts...', '> Target acquired: 192.168.1.104']);
    
    // Simulate investigation steps
    setTimeout(() => setScanLogs(prev => [...prev, '> Extracting recent PCAPs for 192.168.1.104...']), 1000);
    setTimeout(() => setScanLogs(prev => [...prev, '> Analyzing flow data... identified outbound beaconing to 203.0.113.50 (Known C2)']), 2500);
    setTimeout(() => setScanLogs(prev => [...prev, '> Initiating memory dump analysis on endpoint...']), 4000);
    setTimeout(() => setScanLogs(prev => [...prev, '> CRITICAL: Detected hidden process "svch0st.exe" mapping to C2.']), 5500);
    setTimeout(() => setScanLogs(prev => [...prev, '> Aggregating IoCs... Moving to Containment Phase.']), 7000);
  };

  const handleSidebarNavigate = (view: DfirSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <DfirTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <DfirAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <DfirDashboardView onStartInvestigation={startInvestigation} />
          )}

          {sidebarView === 'tools' && (
            <div className="dfir-tools-panel h-full">
               <DfirToolsView />
            </div>
          )}

          {sidebarView === 'investigations' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50">
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Forensic Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-mono uppercase font-semibold">Scripted preview · no endpoint queried</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-sm text-slate-600 overflow-y-auto space-y-2">
                  {scanLogs.length === 0 && (
                    <div className="text-slate-500 italic">No active investigation running. Return to the Command Center to triage an alert.</div>
                  )}
                  {scanLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('WARN') ? 'text-red-600 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {scanLogs.length > 0 && <div className="animate-pulse text-sky-600">_</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['queue', 'activity', 'iocs', 'containment', 'settings'].includes(sidebarView) && (
            <DfirDataView viewType={sidebarView as any} />
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
            <AgentTheorySidebar agentType="dfir" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(14,165,233,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
