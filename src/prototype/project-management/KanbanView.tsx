import { useState, type DragEvent } from 'react';
import { Layout, MessageSquare, Clock, Info, MoreVertical, ChevronDown, UserPlus, Plus, MoreHorizontal } from 'lucide-react';

import { initialKanbanData, projectDetailData } from './data';

export function KanbanView() {
  const [boardData, setBoardData] = useState(initialKanbanData);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; sourceColId: string } | null>(null);

  const handleDragStart = (e, cardId, sourceColId) => {
    setActiveCardId(cardId);
    setDraggedCard({ cardId, sourceColId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragEnd = () => {
    setActiveCardId(null);
    setDraggedCard(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const moveCard = (cardId: string, sourceColId: string, targetColId: string) => {
    if (sourceColId === targetColId) return;
    setBoardData(previous => {
      const source = previous.find(column => column.id === sourceColId);
      const card = source?.cards.find(item => item.id === cardId);
      if (!card || !previous.some(column => column.id === targetColId)) return previous;
      return previous.map(column => ({
        ...column,
        cards: column.id === sourceColId ? column.cards.filter(item => item.id !== cardId)
          : column.id === targetColId ? [...column.cards, card] : column.cards,
      }));
    });
  };

  const handleDrop = (event: DragEvent, targetColId: string) => {
    event.preventDefault();
    if (draggedCard) moveCard(draggedCard.cardId, draggedCard.sourceColId, targetColId);
    handleDragEnd();
  };

  return (
    <div className="min-w-max h-full flex flex-col">
      <div className="w-full h-32 md:h-48 bg-slate-200/80 rounded-[2rem] mb-6 shrink-0 shadow-sm border border-slate-200/50"></div>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 shrink-0 px-2 max-w-5xl">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
            {projectDetailData.title}
          </h2>
          <p className="text-[13px] font-medium text-slate-400">
            Created by {projectDetailData.author} on {projectDetailData.date}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 pt-1">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold">
            <Info size={16} /> Project Details
          </button>
          <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 shrink-0 px-2 max-w-5xl">
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors shadow-sm">
            New <ChevronDown size={14} />
          </button>
          <button className="bg-emerald-100/50 hover:bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors">
            <UserPlus size={14} /> Invite People
          </button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm">Edit</button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm">Private</button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm flex items-center gap-2">
            <MessageSquare size={14} className="text-emerald-500" /> 45 Comments
          </button>
        </div>
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#F8FAFC] bg-slate-300 ${i !== 0 ? '-ml-2' : ''}`}></div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#F8FAFC] bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold -ml-2 z-10 shadow-sm">
            5+
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex gap-6 h-full items-start w-max px-2 pt-2 pb-12">
           {boardData.map((column) => (
              <div 
                key={column.id} 
                className="w-[340px] flex flex-col gap-4 h-full min-h-[600px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                 <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="font-extrabold text-slate-900 text-base">{column.title} <span className="text-slate-500 font-semibold text-sm">({column.cards.length})</span></h3>
                    <button className="w-7 h-7 rounded-full bg-emerald-100/50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                      <Plus size={16} />
                    </button>
                 </div>

                 {column.cards.map(card => {
                    const isActive = activeCardId === card.id;
                    return (
                    <div 
                      key={card.id} 
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white border border-slate-100/80 rounded-[1.25rem] p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isActive ? 'rotate-[-4deg] scale-[1.02] shadow-xl relative z-50 ring-2 ring-emerald-500/20 mt-2 mb-4 translate-x-2' : 'mb-1'}`}
                    >
                       <div className="flex items-center justify-between mb-3.5">
                          <div className={`flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider ${card.tagColor}`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${card.tagBg}`}></div>
                             {card.tag}
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                       </div>
                       
                       <h4 className="font-bold text-slate-900 text-sm mb-4 leading-snug pr-4">{card.title}</h4>
                       <select className="mb-4 w-full rounded-lg border border-slate-200 p-2 text-xs" aria-label={`Move ${card.title}`} value={column.id} onChange={event => moveCard(card.id, column.id, event.target.value)}>
                         {boardData.map(target => <option key={target.id} value={target.id}>{target.title}</option>)}
                       </select>
                       
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-5">
                         <div className={`h-full rounded-full transition-all duration-500 ${card.progressColor}`} style={{ width: `${card.progress}%` }}></div>
                       </div>
                       
                       <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            {[...Array(card.avatars)].map((_, i) => (
                              <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-slate-200 ${i !== 0 ? '-ml-2.5' : ''}`}></div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                            <Clock size={12} /> {card.due}
                          </div>
                       </div>
                    </div>
                    );
                 })}

                 {column.cards.length === 0 && (
                    <div className="border-[1.5px] border-dashed border-slate-300 rounded-[1.25rem] flex items-center justify-center py-6 bg-slate-200/30 text-slate-400 text-xs font-bold gap-2 mt-1">
                       <Layout size={14} className="opacity-50" /> Move card here
                    </div>
                 )}
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

