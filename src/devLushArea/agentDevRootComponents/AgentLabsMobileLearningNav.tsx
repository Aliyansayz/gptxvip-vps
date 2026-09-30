import type { FC } from 'react';
import { BookOpen, Heart, Search } from 'lucide-react';

type MobileLearningTab = 'learn' | 'search' | 'saved';

interface AgentLabsMobileLearningNavProps {
  activeTab: MobileLearningTab;
  savedCount: number;
  onLearn: () => void;
  onSearch: () => void;
  onSaved: () => void;
}

export const AgentLabsMobileLearningNav: FC<AgentLabsMobileLearningNavProps> = ({
  activeTab,
  savedCount,
  onLearn,
  onSearch,
  onSaved,
}) => (
  <nav
    aria-label="Agent Labs learning navigation"
    className="absolute inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-slate-500 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
  >
    {[
      { id: 'learn' as const, label: 'Learn', icon: BookOpen, onClick: onLearn },
      { id: 'search' as const, label: 'Explore', icon: Search, onClick: onSearch },
      { id: 'saved' as const, label: 'Saved', icon: Heart, onClick: onSaved },
    ].map(({ id, label, icon: Icon, onClick }) => (
      <button
        key={id}
        type="button"
        onClick={onClick}
        aria-current={activeTab === id ? 'page' : undefined}
        className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          activeTab === id
            ? 'text-indigo-600 dark:text-indigo-300'
            : 'hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <span className="relative">
          <Icon className="h-5 w-5" strokeWidth={activeTab === id ? 2.5 : 2} />
          {id === 'saved' && savedCount > 0 && (
            <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-rose-500 px-1 text-[9px] leading-4 text-white">
              {savedCount}
            </span>
          )}
        </span>
        {label}
      </button>
    ))}
  </nav>
);
