
import { ArrowRight, MoreVertical, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { analyticsData } from './data';

export function AnalyticsView() {
  // Calculate precise needle rotation for a 270 degree arc (225 to -45) at 60% progress.
  const progressPercent = 0.60;
  const needleRotation = -63; // 225 - (270 * 0.60) = 63 deg. CSS rotate is offset depending on base, visually -63deg points perfectly.

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12">
      {/* Top Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Left Column Container */}
        <div className="flex flex-col gap-6">
           {/* Top 2 small cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {/* Current Balance */}
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-72">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <p className="text-xs font-semibold text-slate-400 mb-1">Current Balance</p>
                   <h3 className="text-2xl font-extrabold text-slate-900">$ 24,567.33</h3>
                   <p className="text-[10px] font-bold text-emerald-500 mt-1">+2.7% <span className="text-slate-400 font-medium">than last week</span></p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                   <ArrowRight size={16} className="-rotate-45" />
                 </div>
               </div>
               <div className="flex gap-2 mb-4">
                 <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">Daily</span>
                 <span className="text-[10px] font-bold text-slate-400 px-3 py-1">Weekly</span>
                 <span className="text-[10px] font-bold text-slate-400 px-3 py-1">Monthly</span>
               </div>
               <div className="flex-1 w-full -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={analyticsData.balance}>
                     <Line type="monotone" dataKey="v1" stroke="#10B981" strokeWidth={3} dot={false} />
                     <Line type="monotone" dataKey="v2" stroke="#F97316" strokeWidth={3} dot={false} />
                     <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} dy={10} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>

             {/* On Progress Gauge */}
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-72 relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[{value: 60}, {value: 40}]} cx="50%" cy="50%" startAngle={225} endAngle={-45} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                      <Cell fill="#10B981" />
                      <Cell fill="#F1F5F9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Needle Assembly */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ transform: `rotate(${needleRotation}deg)` }}>
                   {/* Red Center Dot */}
                   <div className="w-4 h-4 bg-red-500 rounded-full shadow-md relative z-20 border-2 border-white"></div>
                   {/* Red Line pointing outwards */}
                   <div className="absolute top-1/2 left-1/2 w-14 h-1 bg-red-500 rounded-full -translate-y-1/2 origin-left z-10"></div>
                </div>

                <div className="text-center mt-4">
                  <h4 className="text-sm font-extrabold text-slate-900">On Progress <span className="text-emerald-500">60%</span></h4>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed px-4">Workload Dashboard For CMS Websites</p>
                </div>
             </div>
           </div>

           {/* Project Statistics Bar Chart */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-80 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-extrabold text-slate-900">Project Statistics</h3>
                <MoreVertical size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.statsBar} barSize={20} margin={{left: -20}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="b" fill="#F97316" radius={[4, 4, 0, 0]} />
                    {/* Hashed Bar Simulation for the last item */}
                    <Bar dataKey="c" fill="#fb923c" radius={[4, 4, 0, 0]} fillOpacity={0.6} /> 
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Right Column Container */}
        <div className="flex flex-col gap-6">
           {/* Promo Card */}
           <div className="bg-emerald-700 rounded-3xl p-8 flex items-center justify-between relative overflow-hidden h-40 shadow-md">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full translate-x-1/3 -translate-y-1/4 opacity-50 blur-2xl"></div>
             <div className="relative z-10 max-w-[60%]">
               <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Manage your project in one touch</h3>
               <p className="text-xs text-emerald-100 opacity-90">Let Workload manage your project automatically with our best AI systems</p>
             </div>
             <button className="relative z-10 bg-white text-emerald-700 px-6 py-3 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105">
               Try Free Now
             </button>
           </div>

           {/* Project Statistics Line Chart */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-72 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-extrabold text-slate-900">Project Statistics</h3>
                <MoreVertical size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.statsLine}>
                    <Line type="monotone" dataKey="v1" stroke="#10B981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="v2" stroke="#F97316" strokeWidth={3} dot={false} />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} dy={10} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* 4 Mini KPI Cards */}
           <div className="grid grid-cols-2 gap-4 h-40">
             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
               <div>
                 <p className="text-xs font-bold text-slate-900 mb-1">Total Clients</p>
                 <h4 className="text-2xl font-extrabold text-slate-900">68 <span className="text-[9px] font-bold text-emerald-500 align-middle">▲ +0.5%</span></h4>
               </div>
               <div className="w-12 h-12 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={[{value: 76}, {value: 24}]} cx="50%" cy="50%" innerRadius={18} outerRadius={24} dataKey="value" stroke="none">
                       <Cell fill="#10B981" />
                       <Cell fill="#F1F5F9" />
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-700">76%</span>
               </div>
             </div>
             
             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center">
               <p className="text-xs font-bold text-slate-900 mb-2">Total Task Done</p>
               <div className="flex items-end justify-between mb-2">
                 <span className="text-[10px] font-semibold text-red-500"><span className="font-bold">76</span> left from target</span>
                 <span className="text-xl font-extrabold text-slate-900 leading-none">24</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-[24%] h-full bg-red-500 rounded-full"></div>
               </div>
             </div>

             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
               <div>
                 <h4 className="text-2xl font-extrabold text-slate-900 mb-1">562</h4>
                 <p className="text-xs font-bold text-slate-900">Total Clients</p>
                 <p className="text-[9px] font-medium text-slate-400 mt-1"><span className="text-red-500 font-bold">-2%</span> than last month</p>
               </div>
               <div className="w-16 h-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={analyticsData.sparklines.clients}>
                     <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={3} dot={false} />
                     <YAxis hide domain={['dataMin', 'dataMax']} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>

             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
               <div>
                 <h4 className="text-2xl font-extrabold text-slate-900 mb-1">892</h4>
                 <p className="text-xs font-bold text-slate-900">New Projects</p>
                 <p className="text-[9px] font-medium text-slate-400 mt-1"><span className="text-emerald-500 font-bold">+0.5%</span> than last month</p>
               </div>
               <div className="w-16 h-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={analyticsData.sparklines.projects}>
                     <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={3} dot={false} />
                     <YAxis hide domain={['dataMin', 'dataMax']} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Important Projects Row */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-extrabold text-slate-900">Important Projects</h3>
          <MoreVertical size={18} className="text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProjectCard icon="O" color="bg-orange-800" title="Ombe Cafe" subtitle="Cafe" desc="Responsive Landing Page Website Projects" badges={['MOBILE', 'WEBSITES']} done={12} />
          <ProjectCard icon="P" color="bg-pink-500" title="Pushup Studios" subtitle="Cafe Shops" desc="Reservation Application Integrated with Desktop App" badges={['DESKTOP APP']} done={12} progress={30} />
          <ProjectCard icon="K" color="bg-purple-600" title="Kleon Team" subtitle="Cafe Shops" desc="Reservation Application Integrated with Desktop App" badges={['DESKTOP APP']} done={12} progress={80} />
          <ProjectCard icon="b" color="bg-blue-600" title="Biji's Coffee" subtitle="Cafe Shops" desc="Reservation Application Integrated with Desktop App" badges={['DESKTOP APP']} done={12} progress={60} />
        </div>
      </div>

      {/* Bottom Grid: Categories & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-2">
             <h3 className="text-base font-extrabold text-slate-900">Project Categories</h3>
             <MoreVertical size={18} className="text-slate-400" />
           </div>
           <p className="text-[10px] text-slate-400 mb-6">Lorem ipsum dolor sit amet</p>
           
           <div className="flex items-center justify-between flex-1">
             <div className="space-y-3 flex-1 pr-4">
               <p className="text-[11px] font-bold text-slate-400 mb-4">Legend</p>
               {analyticsData.pieCategories.map((cat, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: cat.color}}></div>
                     {cat.name} ({Math.round((cat.value / 2003)*100)}%)
                   </div>
                   <span className="text-xs font-extrabold text-slate-900">{cat.value}</span>
                 </div>
               ))}
             </div>
             
             <div className="w-40 h-40 relative flex-shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={analyticsData.pieCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="white" strokeWidth={2}>
                     {analyticsData.pieCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10 translate-x-[40px] translate-y-[20px]">27%</span>
             </div>
           </div>
           <button className="w-full max-w-[200px] mx-auto mt-4 border-2 border-emerald-500 text-emerald-600 rounded-full py-2 text-xs font-bold hover:bg-emerald-50 transition-colors">
             Update Progress
           </button>
         </div>

         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-2">
             <div>
               <h3 className="text-base font-extrabold text-slate-900 mb-1">Messages</h3>
               <p className="text-[10px] text-slate-400">Lorem ipsum dolor sit amet</p>
             </div>
             <button className="bg-emerald-500 text-white rounded-full px-4 py-2 text-xs font-bold hover:bg-emerald-600 transition-colors">
               +New Messages
             </button>
           </div>
           
           <div className="mt-6 space-y-4">
             {['Kadin Aminoff', 'Marcus Kenter', 'Makenna Levin', 'Alfredo Korsgaard'].map((name, i) => (
               <div key={i} className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-300 relative">
                     {i === 3 && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                       {name} {i === 1 && <CheckCircle2 size={12} className="text-emerald-500" />}
                     </p>
                     <p className="text-[10px] text-slate-500 line-clamp-1">Hei, don't forget to clear server cache!</p>
                   </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                   <MoreVertical size={14} className="text-slate-400" />
                   <span className="text-[9px] text-slate-400">25m ago</span>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}

function ProjectCard({ icon, color, title, subtitle, desc, badges, done, progress = 100 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-full">
       <div className="flex items-center gap-3 mb-4">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-lg ${color}`}>
           {icon}
         </div>
         <div>
           <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{title}</h4>
           <p className="text-[9px] text-slate-400 mt-0.5">{subtitle}</p>
         </div>
       </div>
       <p className="text-[10px] font-medium text-slate-600 mb-4 leading-relaxed flex-1">{desc}</p>
       <div className="flex gap-2 mb-6">
         {badges.map(b => (
           <span key={b} className={`text-[8px] font-bold px-2 py-1 rounded bg-blue-100 text-blue-600`}>{b}</span>
         ))}
       </div>
       <div className="mt-auto">
         <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-2">
           <span>{done} Task Done</span>
           <span className="text-slate-400 font-medium">Due date: 12/05/2020</span>
         </div>
         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-emerald-500 rounded-full" style={{width: `${progress}%`}}></div>
         </div>
       </div>
    </div>
  );
}

