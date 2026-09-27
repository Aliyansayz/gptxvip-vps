import React from 'react';
import { 
  Activity, LayoutDashboard, Inbox, Users, Compass, Wrench, 
  Search, Shield, AlertTriangle, FileText, Database, Book, 
  TrendingUp, Settings, ChevronDown, ChevronRight, CheckCircle, Clock
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
    type="button"
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`w-full min-h-11 flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
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
  const sectionId = `agent-sidebar-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  
  return (
    <div className="mb-4">
      <button 
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={sectionId}
        className="w-full min-h-11 flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {title}
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      <div id={sectionId} className="space-y-0.5" hidden={!expanded}>{children}</div>
    </div>
  );
};

export type SidebarView = 'dashboard' | 'activity' | 'queue' | 'agents' | 'missions' | 'skills' | 'recon' | 'scans' | 'exploits' | 'reports' | 'memory' | 'theory' | 'analytics' | 'settings';

interface AgentSidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  agentName?: string;
}

export default function AgentSidebar({ currentView, onNavigate, agentName = 'Scanner Agent' }: AgentSidebarProps) {
  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col shadow-sm shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold font-heading text-slate-800 text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          {agentName}
        </h2>
        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <SidebarSection title="Global Hub">
          <SidebarItem 
            icon={LayoutDashboard} label="Command Center" 
            isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={Activity} label="Live Activity" 
            isActive={currentView === 'activity'} onClick={() => onNavigate('activity')} 
            badge={<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          />
          <SidebarItem 
            icon={Inbox} label="Task Queue" 
            isActive={currentView === 'queue'} onClick={() => onNavigate('queue')} 
            badge={<span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">3</span>}
          />
        </SidebarSection>
        
        <SidebarSection title="Agent Management">
          <SidebarItem 
            icon={Users} label="Agent Roster" 
            isActive={currentView === 'agents'} onClick={() => onNavigate('agents')} 
          />
          <SidebarItem 
            icon={Compass} label="Active Missions" 
            isActive={currentView === 'missions'} onClick={() => onNavigate('missions')} 
          />
          <SidebarItem 
            icon={Wrench} label="Skill Library" 
            isActive={currentView === 'skills'} onClick={() => onNavigate('skills')} 
          />
        </SidebarSection>

        <SidebarSection title="Domain Workspaces">
          <SidebarItem 
            icon={Search} label="Reconnaissance" 
            isActive={currentView === 'recon'} onClick={() => onNavigate('recon')} 
          />
          <SidebarItem 
            icon={Shield} label="Vulnerability Scans" 
            isActive={currentView === 'scans'} onClick={() => onNavigate('scans')} 
          />
          <SidebarItem 
            icon={AlertTriangle} label="Web Exploits" 
            isActive={currentView === 'exploits'} onClick={() => onNavigate('exploits')} 
            badge={<span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold">12</span>}
          />
          <SidebarItem 
            icon={FileText} label="Reports & Patches" 
            isActive={currentView === 'reports'} onClick={() => onNavigate('reports')} 
          />
        </SidebarSection>

        <SidebarSection title="Knowledge & Memory">
          <SidebarItem 
            icon={Book} label="Theory Wiki Area" 
            isActive={currentView === 'theory'} onClick={() => onNavigate('theory')} 
          />
          <SidebarItem 
            icon={Database} label="Memory Management" 
            isActive={currentView === 'memory'} onClick={() => onNavigate('memory')} 
          />
        </SidebarSection>
        
        <SidebarSection title="System & Settings" defaultExpanded={false}>
          <SidebarItem 
            icon={TrendingUp} label="Analytics & Cost" 
            isActive={currentView === 'analytics'} onClick={() => onNavigate('analytics')} 
          />
          <SidebarItem 
            icon={Settings} label="Settings / API Keys" 
            isActive={currentView === 'settings'} onClick={() => onNavigate('settings')} 
          />
        </SidebarSection>
      </div>
    </div>
  );
}
