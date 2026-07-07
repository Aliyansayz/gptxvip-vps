import React from 'react';
import { 
  FileText, LayoutDashboard, Edit3, ShieldAlert, FileSearch, 
  Settings, Book, ChevronDown, ChevronRight, Globe
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

export type LegalContractSidebarView = 'dashboard' | 'redlining' | 'liabilities' | 'compliance' | 'theory' | 'settings';

interface LegalContractAgentSidebarProps {
  currentView: LegalContractSidebarView;
  onNavigate: (view: LegalContractSidebarView) => void;
}

export default function LegalContractAgentSidebar({ currentView, onNavigate }: LegalContractAgentSidebarProps) {
  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col shadow-sm shrink-0 relative z-30">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold font-heading text-slate-800 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Legal Agent
        </h2>
        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Contract Analysis Active
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <SidebarSection title="Operations">
          <SidebarItem 
            icon={LayoutDashboard} label="Dashboard" 
            isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={Edit3} label="Auto-Redlining" 
            isActive={currentView === 'redlining'} onClick={() => onNavigate('redlining')} 
            badge={<span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold">New</span>}
          />
          <SidebarItem 
            icon={ShieldAlert} label="Liability Detection" 
            isActive={currentView === 'liabilities'} onClick={() => onNavigate('liabilities')} 
          />
        </SidebarSection>
        
        <SidebarSection title="Global Scope">
          <SidebarItem 
            icon={Globe} label="Compliance Monitor" 
            isActive={currentView === 'compliance'} onClick={() => onNavigate('compliance')} 
          />
        </SidebarSection>

        <SidebarSection title="Knowledge Base">
          <SidebarItem 
            icon={Book} label="Theory Wiki Area" 
            isActive={currentView === 'theory'} onClick={() => onNavigate('theory')} 
          />
        </SidebarSection>
        
        <SidebarSection title="Configuration" defaultExpanded={false}>
          <SidebarItem 
            icon={Settings} label="Rules & Policies" 
            isActive={currentView === 'settings'} onClick={() => onNavigate('settings')} 
          />
        </SidebarSection>
      </div>
    </div>
  );
}
