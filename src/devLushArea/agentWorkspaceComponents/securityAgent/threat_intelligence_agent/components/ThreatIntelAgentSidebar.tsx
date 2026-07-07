import React from 'react';
import { 
  Globe, LayoutDashboard, Rss, Shield, Target, AlertCircle, Database, Book, 
  Settings, ChevronDown, ChevronRight, Wrench, Search, Radio
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
        ? 'bg-purple-50 text-purple-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
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

export type ThreatIntelSidebarView = 'dashboard' | 'global_feed' | 'targeted_alerts' | 'tools' | 'osint' | 'darkweb' | 'cve_monitor' | 'theory' | 'settings';

interface ThreatIntelAgentSidebarProps {
  currentView: ThreatIntelSidebarView;
  onNavigate: (view: ThreatIntelSidebarView) => void;
}

export default function ThreatIntelAgentSidebar({ currentView, onNavigate }: ThreatIntelAgentSidebarProps) {
  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col shadow-sm shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold font-heading text-slate-800 text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Threat Intel
        </h2>
        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Global Monitoring Active
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <SidebarSection title="Command Center">
          <SidebarItem 
            icon={LayoutDashboard} label="Dashboard" 
            isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={Rss} label="Global Threat Feed" 
            isActive={currentView === 'global_feed'} onClick={() => onNavigate('global_feed')} 
            badge={<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          />
          <SidebarItem 
            icon={Target} label="Targeted Alerts" 
            isActive={currentView === 'targeted_alerts'} onClick={() => onNavigate('targeted_alerts')} 
            badge={<span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">3</span>}
          />
        </SidebarSection>
        
        <SidebarSection title="Intelligence Sources">
          <SidebarItem 
            icon={Search} label="OSINT Engine" 
            isActive={currentView === 'osint'} onClick={() => onNavigate('osint')} 
          />
          <SidebarItem 
            icon={Radio} label="Dark Web Monitor" 
            isActive={currentView === 'darkweb'} onClick={() => onNavigate('darkweb')} 
          />
          <SidebarItem 
            icon={AlertCircle} label="CVE Database Tracker" 
            isActive={currentView === 'cve_monitor'} onClick={() => onNavigate('cve_monitor')} 
          />
        </SidebarSection>

        <SidebarSection title="Capabilities">
          <div className="threat-intel-sidebar-tools">
            <SidebarItem 
              icon={Wrench} label="Analysis Tools" 
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
