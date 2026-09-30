import React from 'react';
import { 
  ShoppingCart, LayoutDashboard, Tag, Package, Users, 
  Settings, Book, ChevronDown, ChevronRight, TrendingUp 
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
    aria-label={label}
    title={label}
    aria-current={isActive ? 'page' : undefined}
    onClick={onClick}
    className={`flex min-h-11 w-full items-center justify-center rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:justify-between md:px-3 ${
      isActive 
        ? 'bg-amber-50 text-amber-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
      <span className="hidden md:inline">{label}</span>
    </div>
    {badge && <div className="hidden md:block">{badge}</div>}
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
      <button type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="mb-1 hidden w-full items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:flex"
      >
        {title}
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      <div className={`space-y-0.5 ${expanded ? '' : 'md:hidden'}`}>{children}</div>
    </div>
  );
};

export type EcommerceSidebarView = 'dashboard' | 'pricing' | 'inventory' | 'customer_segmentation' | 'forecasting' | 'theory' | 'settings';

interface EcommerceAgentSidebarProps {
  currentView: EcommerceSidebarView;
  onNavigate: (view: EcommerceSidebarView) => void;
}

export default function EcommerceAgentSidebar({ currentView, onNavigate }: EcommerceAgentSidebarProps) {
  return (
    <nav aria-label="E-commerce Agent sections" className="relative z-30 flex h-full w-14 shrink-0 flex-col border-r border-slate-200 bg-white sm:w-16 md:w-64">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold font-heading text-slate-800 text-lg flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-600" />
          <span className="hidden md:inline">eCommerce Agent</span>
        </h2>
        <div className="mt-1 hidden items-center gap-1 text-xs font-medium text-slate-500 md:flex">
          Built-in preview · no storefront
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-1 custom-scrollbar md:p-3">
        <SidebarSection title="Store Management">
          <SidebarItem 
            icon={LayoutDashboard} label="Dashboard" 
            isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={Tag} label="Dynamic Pricing" 
            isActive={currentView === 'pricing'} onClick={() => onNavigate('pricing')} 
            badge={<span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Sample</span>}
          />
          <SidebarItem 
            icon={Package} label="Inventory Sync" 
            isActive={currentView === 'inventory'} onClick={() => onNavigate('inventory')} 
          />
        </SidebarSection>
        
        <SidebarSection title="Intelligence">
          <SidebarItem 
            icon={Users} label="Segmentation" 
            isActive={currentView === 'customer_segmentation'} onClick={() => onNavigate('customer_segmentation')} 
          />
          <SidebarItem 
            icon={TrendingUp} label="Demand Forecasting" 
            isActive={currentView === 'forecasting'} onClick={() => onNavigate('forecasting')} 
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
            icon={Settings} label="Store Connections" 
            isActive={currentView === 'settings'} onClick={() => onNavigate('settings')} 
          />
        </SidebarSection>
      </div>
    </nav>
  );
}
