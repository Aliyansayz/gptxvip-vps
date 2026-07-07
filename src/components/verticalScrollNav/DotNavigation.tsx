import React from "react";

interface Section {
  id: string;
  label: string;
}

interface DotNavigationProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export const DotNavigation: React.FC<DotNavigationProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-5 py-5 px-2 bg-zinc-200/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-full border border-zinc-300/50 dark:border-white/10">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`relative w-1.5 h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group ${
                isActive
                  ? "bg-emerald-500 scale-[1.6] shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  : "bg-zinc-400 dark:bg-zinc-500 hover:bg-zinc-500 dark:hover:bg-zinc-400"
              }`}
              aria-label={section.label}
            >
              <div className="hidden sm:block absolute right-[30px] top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-2.5 py-1 rounded text-[0.65rem] font-semibold whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 border border-zinc-200 dark:border-white/10 shadow-sm group-hover:opacity-100 group-hover:right-[25px]">
                {section.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
