import React, { useState } from 'react';
import { useFavorites } from './FavoritesContext';
import { CoreConceptCard } from '../codeConceptsView/CoreConceptCard';
import { FolderHeart, ChevronRight, LayoutGrid } from 'lucide-react';
import { InteractiveQuestion } from '../../../types';

interface FavoritesViewProps {
  onStartConcept: (concept: InteractiveQuestion) => void;
  onBack?: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onStartConcept, onBack }) => {
  const { collections } = useFavorites();
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(collections[0]?.id || null);

  const activeCollection = collections.find(c => c.id === activeCollectionId);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#050505] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Collections Sidebar */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 overflow-y-auto hidden md:block">
          <div className="p-6">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
              <FolderHeart className="text-rose-500 w-5 h-5" /> Favorites
            </h2>
            <div className="space-y-2">
              {collections.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCollectionId(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${activeCollectionId === c.id ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-900'}`}
                >
                  <span className="truncate pr-2 text-sm">{c.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-950 text-zinc-500">{c.items.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collection Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 relative">
          <div className="max-w-5xl mx-auto">
             <header className="mb-12 flex justify-between items-end">
               <div>
                  {onBack && (
                    <button onClick={onBack} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 mb-4 flex items-center gap-1">
                      <ChevronRight className="w-4 h-4 rotate-180" /> Back
                    </button>
                  )}
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                     {activeCollection?.name}
                  </h1>
                  <p className="text-sm text-zinc-500 mt-2">{activeCollection?.items.length} saved activities</p>
               </div>
             </header>

             {/* Grid */}
             {activeCollection && activeCollection.items.length > 0 ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {activeCollection.items.map(concept => (
                    <CoreConceptCard
                      key={concept.componentId}
                      concept={concept}
                      onStart={() => onStartConcept(concept)}
                      courseId={activeCollection.name}
                    />
                 ))}
               </div>
             ) : (
                <div className="border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-16 text-zinc-500 text-center flex flex-col items-center gap-4">
                  <LayoutGrid className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                  <p className="font-bold text-lg mb-1">Collection Empty</p>
                  <p className="text-sm max-w-sm">You haven't saved any activities to this collection yet. Browse the concepts and click the heart icon to save them here.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
