import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { TimeFilterConfig } from '../../functions/api/timeFilter/timeFilterManager';
import { X, Plus } from 'lucide-react';

export const TradingPanelTimeFilter: React.FC = () => {
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();
  const timeFilter = tradingConfig.timeFilter || {
    enabled: false,
    time_slots: ['00:00-23:59'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timezone: 'GMT+3',
    csv_file_timezone: 'GMT+3'
  };

  const updateConfig = (updates: Partial<TimeFilterConfig>) => {
    setTradingConfig(prev => ({
      ...prev,
      timeFilter: {
        ...(prev.timeFilter as TimeFilterConfig),
        ...updates
      }
    }));
  };

  const handleToggleDay = (day: string) => {
    const isSelected = timeFilter.days.includes(day);
    let newDays = [...timeFilter.days];
    if (isSelected) {
      newDays = newDays.filter(d => d !== day);
    } else {
      newDays.push(day);
    }
    updateConfig({ days: newDays });
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = [...timeFilter.time_slots];
    newSlots.splice(index, 1);
    updateConfig({ time_slots: newSlots });
  };

  const [newStart, setNewStart] = useState('00:00');
  const [newEnd, setNewEnd] = useState('23:59');

  const handleAddSlot = () => {
    if (!newStart || !newEnd) return;
    const newSlots = [...timeFilter.time_slots, `${newStart}-${newEnd}`];
    updateConfig({ time_slots: newSlots });
  };

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <h4 className="text-sm font-semibold text-pink-400 uppercase tracking-wider">Time Filter Settings</h4>
          <label className="flex items-center gap-2 text-xs text-pink-400 font-bold select-none cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded bg-zinc-800 border-zinc-700 text-pink-500 focus:ring-pink-500" 
              checked={timeFilter.enabled} 
              onChange={e => updateConfig({ enabled: e.target.checked })} 
            />
            {timeFilter.enabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>

        <div className={`space-y-6 ${!timeFilter.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div>
             <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Allowed Days</label>
             <div className="flex flex-wrap gap-2">
               {allDays.map(day => (
                 <button
                   key={day}
                   onClick={() => handleToggleDay(day)}
                   className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                     timeFilter.days.includes(day)
                       ? 'bg-pink-500/20 text-pink-300 border-pink-500/50'
                       : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                   }`}
                 >
                   {day}
                 </button>
               ))}
             </div>
          </div>

          <div>
             <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Time Slots</label>
             <div className="flex flex-col gap-2 mb-3">
               {timeFilter.time_slots.map((slot, index) => (
                 <div key={index} className="flex items-center gap-2 w-max bg-zinc-800 px-3 py-1.5 rounded border border-zinc-700">
                   <span className="text-xs text-zinc-300 font-mono tracking-wider">{slot}</span>
                   <button onClick={() => handleRemoveSlot(index)} className="text-zinc-500 hover:text-red-400 ml-2">
                     <X size={14} />
                   </button>
                 </div>
               ))}
             </div>
             
             <div className="flex items-center gap-2">
               <input 
                 type="time" 
                 value={newStart}
                 onChange={e => setNewStart(e.target.value)}
                 className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:outline-none focus:border-pink-500 leading-none h-8"
               />
               <span className="text-zinc-500 text-xs">to</span>
               <input 
                 type="time" 
                 value={newEnd}
                 onChange={e => setNewEnd(e.target.value)}
                 className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:outline-none focus:border-pink-500 leading-none h-8"
               />
               <button 
                 onClick={handleAddSlot}
                 className="flex items-center gap-1 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/30 rounded px-2 h-8 text-[10px] font-bold uppercase"
               >
                 <Plus size={14} />
                 Add Slot
               </button>
             </div>
             <p className="text-[10px] text-zinc-500 mt-2">Time format is 24-hours (HH:MM).</p>
          </div>

          <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Timezone</label>
               <input 
                 type="text"
                 value={timeFilter.timezone}
                 onChange={e => updateConfig({ timezone: e.target.value })}
                 className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-pink-500 uppercase"
                 placeholder="e.g. GMT+3"
               />
               <p className="text-[10px] text-zinc-500 mt-1">Example: GMT+3, GMT-5</p>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">CSV File Timezone</label>
               <input 
                 type="text"
                 value={timeFilter.csv_file_timezone}
                 onChange={e => updateConfig({ csv_file_timezone: e.target.value })}
                 className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-pink-500 uppercase"
                 placeholder="e.g. GMT+3"
               />
               <p className="text-[10px] text-zinc-500 mt-1">Default To ==&gt; GMT+3</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
