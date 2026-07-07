import React from 'react';
import { 
  Cloud, LayoutDashboard, ShieldAlert, FileWarning, Key, Database, Book, 
  Settings, ChevronDown, ChevronRight, Wrench, Search, FileCode
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick, badge }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
      isActive 
        ? 'bg-blue-50 text-blue-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
      <span>{label}</span>
    </div>
    {badge && <div>{badge}</div>}
  </button>
);

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const SidebarSection = ({ title, children, defaultExpanded = true }: SidebarSectionProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  
  return (
    <div className="mb-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors mb-1"
      >
        {title}
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {expanded && <div className="space-y-0.5">{children}</div>}
    </div>
  );
};

export type CloudPostureSidebarView = 'dashboard' | 'misconfigurations' | 'drift' | 'tools' | 'iam_audit' | 'data_security' | 'compliance' | 'theory' | 'settings';

interface CloudPostureAgentSidebarProps {
  currentView: CloudPostureSidebarView;
  onNavigate: (view: CloudPostureSidebarView) => void;
}

export default function CloudPostureAgentSidebar({ currentView, onNavigate }: CloudPostureAgentSidebarProps) {
  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col shadow-sm shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold font-heading text-slate-800 text-lg flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          Cloud CSPM
        </h2>
        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Continuous Auditing Active
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <SidebarSection title="Posture Control">
          <SidebarItem 
            icon={LayoutDashboard} label="Dashboard" 
            isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={ShieldAlert} label="Misconfigurations" 
            isActive={currentView === 'misconfigurations'} onClick={() => onNavigate('misconfigurations')} 
            badge={<span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">4</span>}
          />
          <SidebarItem 
            icon={FileWarning} label="Drift Detection" 
            isActive={currentView === 'drift'} onClick={() => onNavigate('drift')} 
          />
        </SidebarSection>
        
        <SidebarSection title="Auditing Modules">
          <SidebarItem 
            icon={Key} label="IAM Auditing" 
            isActive={currentView === 'iam_audit'} onClick={() => onNavigate('iam_audit')} 
          />
          <SidebarItem 
            icon={Database} label="Data Security" 
            isActive={currentView === 'data_security'} onClick={() => onNavigate('data_security')} 
          />
          <SidebarItem 
            icon={FileCode} label="Compliance Reports" 
            isActive={currentView === 'compliance'} onClick={() => onNavigate('compliance')} 
          />
        </SidebarSection>

        <SidebarSection title="Capabilities">
          <div className="cloud-posture-sidebar-tools">
            <SidebarItem 
              icon={Wrench} label="CSPM Tools" 
              isActive={currentView === 'tools'} onClick={() => onNavigate('tools')} 
              badge={<span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded text-[10px] font-bold">NEW</span>}
            />
          </div>
          <SidebarItem 
            icon={Book} label="Theory Wiki Area" 
            isActive={currentView === 'theory'} onClick={() => onNavigate('theory')} 
          />
        </SidebarSection>
        
        <SidebarSection title="System Settings" defaultExpanded={false}>
          <SidebarItem 
            icon={Settings} label="Configuration" 
            isActive={currentView === 'settings'} onClick={() => onNavigate('settings')} 
          />
        </SidebarSection>
      </div>
    </div>
  );
}
