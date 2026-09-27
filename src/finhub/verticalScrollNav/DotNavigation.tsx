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
    <nav aria-label="Project sections" className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1">
      <div className="flex flex-col items-center gap-5 py-5 px-2 bg-zinc-200/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-full border border-zinc-300/50 dark:border-white/10">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className="group relative grid h-11 w-11 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              aria-label={section.label}
              aria-current={isActive ? "location" : undefined}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isActive
                  ? "scale-[1.6] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  : "bg-zinc-400 group-hover:bg-zinc-500 dark:bg-zinc-500 dark:group-hover:bg-zinc-400"
              }`} />
              <span className="hidden sm:block absolute right-10 top-1/2 -translate-y-1/2 rounded border border-zinc-200 bg-white px-2.5 py-1 text-[0.65rem] font-semibold whitespace-nowrap text-zinc-900 opacity-0 pointer-events-none shadow-sm transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
