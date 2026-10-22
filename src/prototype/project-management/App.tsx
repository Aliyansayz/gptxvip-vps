import { useState, useEffect } from 'react';
import { LayoutDashboard, Zap, Users, Layout, BarChart2, Calendar, MessageSquare, Search, Bell, Mail, Inbox, Settings, ArrowRight, Menu, X, ArrowLeft, Info, ChevronDown, Zap as Lightning, Clock as ClockIcon, ChevronRight } from 'lucide-react';

import { projectListData } from './data';
import { LatestActivityView } from './ActivityView';
import { AnalyticsView } from './AnalyticsView';
import { KanbanView } from './KanbanView';
import { ProjectListView, ProjectDetailsView } from './ProjectViews';
import './styles.css';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(projectListData[0]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Close mobile menu when switching views
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const handleExit = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/templates');
    }
  };

  return (
    <>
      <div className="project-management-prototype flex h-screen bg-[#F8FAFC] font-outfit text-slate-800 overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 ${isSidebarCollapsed ? 'w-24' : 'w-64'} bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out`}>
          <div className="h-20 flex items-center border-b border-slate-100 shrink-0 px-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-slate-400 hover:text-slate-700 bg-transparent hover:bg-slate-100 rounded-lg p-2 transition-colors shrink-0"
              aria-label="Toggle sidebar collapse"
            >
              <Menu size={22} />
            </button>
            
            <div className={`flex items-center overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-emerald-400 shrink-0 flex items-center justify-center text-white font-extrabold text-xs">
                W
              </div>
              <div className="ml-2">
                <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900">Workload</h1>
                <p className="text-[9px] font-semibold text-slate-400 whitespace-nowrap">Project Management Admin</p>
              </div>
            </div>
            
            <button 
              className="md:hidden text-slate-400 hover:text-slate-700 shrink-0 ml-auto" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="px-4 py-6 flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 h-auto mb-4'}`}>
              <p className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider whitespace-nowrap">Main Menu</p>
            </div>
            
            <nav className="space-y-1">
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('dashboard')} />
              <NavItem icon={<Zap size={20} />} label="Project" hasArrow={!isSidebarCollapsed} active={currentView.startsWith('project')} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('project')} />
              <NavItem icon={<Users size={20} />} label="Clients" active={currentView === 'clients'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('clients')} />
              <NavItem icon={<Layout size={20} />} label="Kanban" badge="16" badgeColor="bg-blue-600" active={currentView === 'kanban'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('kanban')} />
              <NavItem icon={<BarChart2 size={20} />} label="Analytics" active={currentView === 'analytics'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('analytics')} />
              <NavItem icon={<Calendar size={20} />} label="Calendar" badge="5" badgeColor="bg-emerald-500" hasArrow={!isSidebarCollapsed} active={currentView === 'calendar'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('calendar')} />
              <NavItem icon={<MessageSquare size={20} />} label="Messages" active={currentView === 'messages'} isCollapsed={isSidebarCollapsed} onClick={() => setCurrentView('messages')} />
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleExit}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-2.5 gap-2'} rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-dashed border-slate-200 transition-colors cursor-pointer`}
                title="Exit to surfaces showcase"
              >
                <ArrowLeft size={16} />
                {!isSidebarCollapsed && <span>Exit to Surfaces</span>}
              </button>
            </div>
          </div>

          <div className={`px-4 pb-6 transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
            <div className="bg-slate-50 rounded-2xl p-5 text-center relative overflow-hidden border border-slate-100">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <div className="w-8 h-8 grid grid-cols-3 gap-1">
                   {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-black rounded-full" />)}
                </div>
              </div>
              <h4 className="text-sm font-bold mb-3 relative z-10 text-slate-900">Enable Workload Automation System</h4>
              <button className="text-[11px] font-bold bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 hover:bg-slate-50 flex items-center justify-center gap-1 mx-auto text-slate-700">
                Learn more <ArrowRight size={12} />
              </button>
            </div>
            <div className="mt-6 text-center whitespace-nowrap">
              <p className="text-xs font-semibold text-slate-800">Workload Project Management</p>
              <p className="text-[10px] text-slate-400 mt-1">Interactive Project Workspace</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative bg-[#F8FAFC]">
          <header className="h-20 bg-[#F8FAFC]/80 backdrop-blur-md px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="md:hidden text-slate-400 hover:text-slate-700 transition-colors"
                 aria-label="Open mobile menu"
               >
                 <Menu size={24} />
               </button>
               {currentView === 'project_details' && (
                 <button onClick={() => setCurrentView('project')} className="text-slate-400 hover:text-slate-800 transition-colors mr-2">
                   <ArrowLeft size={20} />
                 </button>
               )}
               <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                 {currentView === 'dashboard' ? 'Latest Activity' : 
                  currentView === 'project_details' ? 'Project Details' : 
                  currentView === 'kanban' ? 'Board' : 
                  currentView}
               </h2>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden lg:block">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Search here.." 
                   className="w-full bg-slate-200/60 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder:text-slate-400 font-medium"
                 />
                 <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
               </div>
            </div>

            <div className="flex items-center gap-1 md:gap-3 shrink-0 relative">
               <div className="relative">
                 <button 
                   onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                   className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors"
                   aria-label="Notifications"
                 >
                   <Bell size={20} />
                   <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#F8FAFC] transform translate-x-1 -translate-y-1">16</span>
                 </button>
                 
                 {/* Notifications Dropdown */}
                 {isNotificationsOpen && (
                   <div className="absolute top-full mt-2 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                     <div className="flex items-center justify-between p-4 border-b border-slate-50">
                       <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                       <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
                     </div>
                     <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {[1,2,3].map((item, i) => (
                           <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === 1 ? 'bg-slate-100 text-slate-500' : 'bg-slate-500 text-white'}`}>
                               {i === 1 ? <ClockIcon size={14} /> : <Lightning size={14} />}
                             </div>
                             <div>
                               <p className="text-xs text-slate-700 mb-1 leading-relaxed"><span className="font-bold">{i === 1 ? '[REMINDER]' : 'Jackie Kun'}</span> {i === 1 ? 'Due date of Highspeed Studios Projects will be coming' : 'mentioned you at Klean Projects'}</p>
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] text-slate-400">2m ago</span>
                                 {i === 0 && <button className="text-[10px] font-bold text-emerald-500">Mark as read</button>}
                               </div>
                             </div>
                           </div>
                        ))}
                     </div>
                   </div>
                 )}
               </div>

               <HeaderIcon icon={<Mail size={20} />} badge="27" badgeColor="bg-red-500" ariaLabel="Messages" />
               <HeaderIcon icon={<Inbox size={20} />} badge="83" badgeColor="bg-emerald-500" ariaLabel="Inbox" />
               <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors ml-1" aria-label="Settings"><Settings size={20} /></button>
               
               <div className="hidden md:flex items-center gap-3 ml-2 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 leading-none">Franklin Jr.</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">franklinjr@mail.com</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
               </div>

               <div className="hidden sm:flex items-center gap-1 bg-emerald-100/50 text-emerald-700 px-3 py-1.5 rounded-full ml-2 cursor-pointer hover:bg-emerald-100 transition-colors">
                  <span className="text-xs font-bold">EN</span>
                  <ChevronDown size={14} />
               </div>

               {/* Exit Button */}
               <button
                 type="button"
                 onClick={handleExit}
                 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-emerald-700 border border-slate-200 rounded-full shadow-sm transition-all ml-2 cursor-pointer"
                 title="Exit prototype and return to templates"
               >
                 <ArrowLeft size={13} />
                 <span>Exit</span>
               </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 custom-scrollbar relative">
            {currentView === 'dashboard' && <LatestActivityView />}
            {currentView === 'analytics' && <AnalyticsView />}
            {currentView === 'kanban' && <KanbanView />}
            {currentView === 'project' && <ProjectListView onSelect={(project) => { setSelectedProject(project); setCurrentView('project_details'); }} />}
            {currentView === 'project_details' && <ProjectDetailsView project={selectedProject} />}
            {['clients', 'calendar', 'messages'].includes(currentView) && <PlaceholderView name={currentView} />}
          </div>
        </main>
      </div>
    </>
  );
}

function PlaceholderView({ name }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-slate-400 w-full max-w-md mx-auto text-center px-4">
       <div className="w-24 h-24 mb-6 rounded-full bg-slate-200/50 flex items-center justify-center shadow-inner">
         <Info size={40} className="text-slate-400" />
       </div>
       <h2 className="text-3xl font-extrabold text-slate-700 capitalize mb-2">{name}</h2>
       <p className="text-sm font-medium text-slate-500">
         This module is currently under construction. Please use the sidebar to navigate to available views like Dashboard, Project, Kanban, or Analytics.
       </p>
    </div>
  );
}

function NavItem({ icon, label, badge = "", badgeColor = "", active, hasArrow = false, isCollapsed, onClick }) {
  return (
    <button type="button"
      aria-current={active ? "page" : undefined}
      aria-label={label}
      onClick={onClick}
      className={`w-full relative flex items-center ${isCollapsed ? 'justify-center p-3 mx-2' : 'justify-between px-4 py-3'} rounded-2xl mb-1 transition-all cursor-pointer ${active ? 'bg-emerald-100/50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex items-center gap-3">
        <div className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</div>
        {!isCollapsed && <span className={`text-sm ${active ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>{label}</span>}
      </div>
      
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${badgeColor}`}>
              {badge}
            </span>
          )}
          {hasArrow && <span className={active ? "text-emerald-500" : "text-slate-300"}><ChevronRight size={14} /></span>}
        </div>
      )}
      
      {isCollapsed && badge && (
        <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white ${badgeColor}`}></span>
      )}
    </button>
  );
}

function HeaderIcon({ icon, badge, badgeColor, ariaLabel }) {
  return (
    <button 
      className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors"
      aria-label={ariaLabel}
    >
      {icon}
      {badge && (
        <span className={`absolute top-0 right-0 ${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#F8FAFC] transform translate-x-1 -translate-y-1`}>
          {badge}
        </span>
      )}
    </button>
  );
}
