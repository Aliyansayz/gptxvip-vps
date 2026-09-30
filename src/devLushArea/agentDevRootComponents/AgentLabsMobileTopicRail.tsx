import type { ComponentType, Ref } from 'react';
import { Search } from 'lucide-react';

export interface AgentLabsMobileTopic {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  group?: string;
}

interface AgentLabsMobileTopicRailProps {
  topics: AgentLabsMobileTopic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  onSearchClick: () => void;
  sectionLabel?: string;
  heading?: string;
  ariaLabel?: string;
  topicLabels?: Record<string, string>;
  containerRef?: Ref<HTMLDivElement>;
}

export const AgentLabsMobileTopicRail = ({
  topics,
  activeTopicId,
  onTopicSelect,
  onSearchClick,
  sectionLabel = 'Agent Labs',
  heading = 'Choose a topic',
  ariaLabel = 'Choose an Agent Labs topic',
  topicLabels = {},
  containerRef,
}: AgentLabsMobileTopicRailProps) => (
  <div ref={containerRef} className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden">
    <div className="flex items-center justify-between gap-3 px-4 py-2">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">{sectionLabel}{topics.find((topic) => topic.id === activeTopicId)?.group ? ` · ${topics.find((topic) => topic.id === activeTopicId)?.group}` : ''}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{heading}</p>
      </div>
      <button
        type="button"
        onClick={onSearchClick}
        aria-label={`Search ${sectionLabel}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-300"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
    <nav aria-label={ariaLabel} className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {topics.map((topic) => {
        const Icon = topic.icon;
        const selected = activeTopicId === topic.id;
        return (
          <button
            key={topic.id}
            type="button"
            aria-current={selected ? 'page' : undefined}
            aria-label={topic.title}
            title={topic.title}
            onClick={() => onTopicSelect(topic.id)}
            className={`flex min-h-11 max-w-52 shrink-0 items-center gap-2 rounded-full border px-3 text-left text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{topicLabels[topic.id] || topic.title}</span>
          </button>
        );
      })}
    </nav>
  </div>
);

export default AgentLabsMobileTopicRail;
