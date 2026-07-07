import React, { useState } from 'react';
import CloudPostureAgentSidebar, { CloudPostureSidebarView } from '../components/CloudPostureAgentSidebar';
import CloudPostureDashboardView from './CloudPostureDashboardView';
import CloudPostureToolsView from './CloudPostureToolsView';
import CloudPostureDataView from './CloudPostureDataView';
import CloudPostureTutorialTour from '../tutorial/CloudPostureTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';

export default function CloudPostureAgentMainView() {
  const [sidebarView, setSidebarView] = useState<CloudPostureSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const auditResource = () => {
    setSidebarView('misconfigurations');
    setAuditLogs(['> Initiating remediation workflow for arn:aws:s3:::prod-customer-data-01...']);
    
    // Simulate investigation steps
    setTimeout(() => setAuditLogs(prev => [...prev, '> Validating current S3 Bucket Policy via AWS API...']), 1500);
    setTimeout(() => setAuditLogs(prev => [...prev, '> CRITICAL: BlockPublicAcls is set to FALSE. Bucket allows anonymous Read.']), 3000);
    setTimeout(() => setAuditLogs(prev => [...prev, '> Generating Infrastructure-as-Code (Terraform) patch to enforce BlockPublicAccess...']), 4500);
    setTimeout(() => setAuditLogs(prev => [...prev, '> Applying patch directly via AWS Management API (Auto-Remediation Enabled)...']), 6000);
    setTimeout(() => setAuditLogs(prev => [...prev, '> SUCCESS: Bucket is now private. Alerting DevOps team via Slack.']), 7500);
  };

  const handleSidebarNavigate = (view: CloudPostureSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <CloudPostureTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <CloudPostureAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <CloudPostureDashboardView onAuditResource={auditResource} />
          )}

          {sidebarView === 'tools' && (
            <div className="cloud-posture-tools h-full">
               <CloudPostureToolsView />
            </div>
          )}

          {sidebarView === 'misconfigurations' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50">
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Remediation Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-mono uppercase font-semibold">Workflow Active</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-sm text-slate-600 overflow-y-auto space-y-2">
                  {auditLogs.length === 0 && (
                    <div className="text-slate-500 italic">No remediation workflow active. Return to the Command Center to initiate a fix.</div>
                  )}
                  {auditLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('SUCCESS') ? 'text-blue-700 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {auditLogs.length > 0 && <div className="animate-pulse text-blue-600">_</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['drift', 'iam_audit', 'data_security', 'compliance', 'settings'].includes(sidebarView) && (
            <CloudPostureDataView viewType={sidebarView as any} />
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
            <AgentTheorySidebar agentType="cloud_posture" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
