import React from 'react';
import { LayoutDashboard, Target, Crosshair, Terminal, Network, Search, FileText, Settings, BookOpen } from 'lucide-react';

export type RedTeamSidebarView = 'dashboard' | 'recon' | 'exploitation' | 'lateral_movement' | 'reporting' | 'tools' | 'theory' | 'settings';

interface RedTeamAgentSidebarProps {
  currentView: RedTeamSidebarView;
  onNavigate: (view: RedTeamSidebarView, opener: HTMLButtonElement) => void;
}

export default function RedTeamAgentSidebar({ currentView, onNavigate }: RedTeamAgentSidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Command Center' },
    { id: 'recon', icon: Search, label: 'Reconnaissance' },
    { id: 'exploitation', icon: Crosshair, label: 'Exploitation' },
    { id: 'lateral_movement', icon: Network, label: 'Lateral Movement' },
    { id: 'reporting', icon: FileText, label: 'Attack Paths' },
    { id: 'tools', icon: Terminal, label: 'Arsenal' },
    { id: 'theory', icon: BookOpen, label: 'Theory Wiki' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav aria-label="Red Team sections" className="w-14 sm:w-16 md:w-64 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-30 shrink-0">
      <div className="p-2 md:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-center md:justify-start gap-3">
        <div aria-hidden="true" className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div className="hidden md:block">
          <h1 className="font-bold text-slate-800 text-sm font-heading">Red Team Agent</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">APT Emulation</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            title={item.label}
            aria-current={currentView === item.id ? 'page' : undefined}
            onClick={(event) => onNavigate(item.id as RedTeamSidebarView, event.currentTarget)}
            className={`w-full min-h-11 flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              currentView === item.id 
                ? 'bg-red-50 text-red-700 font-semibold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
            }`}
          >
            <item.icon aria-hidden="true" className={`w-4 h-4 shrink-0 ${currentView === item.id ? 'text-red-600' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="hidden md:block p-4 border-t border-slate-200 bg-slate-50">
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Preview ready</span>
          </div>
          <p className="text-[11px] text-red-600/80 leading-relaxed">
            The local scripted training preview is ready. No engagement rules are collected or applied.
          </p>
        </div>
      </div>
    </nav>
  );
}
