import React, { useEffect, useRef, useState } from 'react';
import RedTeamAgentSidebar, { RedTeamSidebarView } from '../components/RedTeamAgentSidebar';
import RedTeamDashboardView from './RedTeamDashboardView';
import RedTeamToolsView from './RedTeamToolsView';
import RedTeamReconView from './RedTeamReconView';
import RedTeamLateralMovementView from './RedTeamLateralMovementView';
import RedTeamReportingView from './RedTeamReportingView';
import RedTeamSettingsView from './RedTeamSettingsView';
import RedTeamTutorialTour from '../tutorial/RedTeamTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Target } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';

export default function RedTeamAgentMainView() {
  const [sidebarView, setSidebarView] = useState<RedTeamSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [simLogs, setSimLogs] = useState<string[]>([]);
  const simulationTimers = useRef<number[]>([]);

  const clearSimulationTimers = () => {
    simulationTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    simulationTimers.current = [];
  };

  useEffect(() => () => {
    simulationTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    simulationTimers.current = [];
  }, []);

  const startSimulation = () => {
    clearSimulationTimers();
    setSidebarView('exploitation');
    setSimLogs(['> Initializing APT emulation sequence...', '> Target scope: 10.0.x.x/24']);
    
    simulationTimers.current = [
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Scanning perimeter for exposed services...']), 1000),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Identified unpatched Apache Struts instance (10.0.1.45)']), 2500),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Executing payload for CVE-2017-5638...']), 4000),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> SUCCESS: Gained low-privilege shell.']), 5500),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Initiating lateral movement and privilege escalation phases...']), 7000),
    ];
  };

  const stopSimulation = () => {
    clearSimulationTimers();
    setSimLogs([]);
    setSidebarView('dashboard');
  };

  const handleSidebarNavigate = (view: RedTeamSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <RedTeamTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <RedTeamAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <RedTeamDashboardView onStartSimulation={startSimulation} />
          )}

          {sidebarView === 'tools' && (
            <div className="h-full">
               <RedTeamToolsView />
            </div>
          )}

          {sidebarView === 'exploitation' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50">
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Exploitation Terminal</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-600">
                    <span className="text-xs font-mono uppercase font-semibold">Scripted simulation · no target contacted</span>
                    <button type="button" onClick={stopSimulation} className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50">Stop scenario</button>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-sm text-slate-600 overflow-y-auto space-y-2">
                  {simLogs.length === 0 && (
                    <div className="text-slate-500 italic">No active simulation. Return to Command Center to initialize.</div>
                  )}
                  {simLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('SUCCESS') ? 'text-emerald-600 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {simLogs.length > 0 && <div className="animate-pulse text-red-600">_</div>}
                </div>
              </div>
            </div>
          )}

          {sidebarView === 'recon' && <RedTeamReconView />}
          {sidebarView === 'lateral_movement' && <RedTeamLateralMovementView />}
          {sidebarView === 'reporting' && <RedTeamReportingView />}
          {sidebarView === 'settings' && <RedTeamSettingsView />}
          
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
            <AgentTheorySidebar agentType="red_team" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(220,38,38,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
