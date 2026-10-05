

import { activityData } from './data';

export function LatestActivityView() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 w-full max-w-5xl mx-auto min-h-full">
       <div className="mb-8">
         <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-4">
           Today <div className="h-px bg-slate-100 flex-1 border-t border-dashed border-slate-200"></div>
         </h3>
         <div className="space-y-6">
           {activityData.today.map(item => <ActivityRow key={item.id} item={item} />)}
         </div>
       </div>

       <div>
         <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-4">
           Yesterday <div className="h-px bg-slate-100 flex-1 border-t border-dashed border-slate-200"></div>
         </h3>
         <div className="space-y-6">
           {activityData.yesterday.map(item => <ActivityRow key={item.id} item={item} />)}
         </div>
       </div>
    </div>
  );
}

function ActivityRow({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
       <div className="flex items-start sm:items-center gap-4 md:gap-6 flex-1">
          <span className="text-xs font-semibold text-slate-400 w-16 shrink-0">{item.time}</span>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${item.color}`}>
             <Icon size={18} />
          </div>
          <div>
            <p className="text-sm text-slate-700 leading-snug">
              <span className="font-bold text-slate-900 mr-1">{item.user}</span> 
              {item.action}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
          </div>
       </div>
       <button className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-emerald-500 text-emerald-600 text-xs font-bold hover:bg-emerald-50 transition-colors shrink-0">
          Go to board
       </button>
    </div>
  );
}

