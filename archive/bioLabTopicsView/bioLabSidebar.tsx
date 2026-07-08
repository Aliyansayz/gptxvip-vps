import React from "react";

interface Topic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BioLabSidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const topicColorSchemes: Record<
  string,
  {
    text: string;
    bg: string;
    solidBg: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  proteomics: {
    text: "text-violet-500",
    bg: "bg-violet-500/10",
    solidBg: "bg-violet-500",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
  },
  "cellular-biology": {
    text: "text-violet-500",
    bg: "bg-violet-500/10",
    solidBg: "bg-violet-500",
    gradientFrom: "from-violet-500",
    gradientTo: "to-pink-500",
  },
  genetics: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    solidBg: "bg-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-400",
  },
  ecology: {
    text: "text-teal-500",
    bg: "bg-teal-500/10",
    solidBg: "bg-teal-500",
    gradientFrom: "from-teal-500",
    gradientTo: "to-cyan-400",
  },
  pathology: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    solidBg: "bg-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-500",
  },
  pharmacology: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    solidBg: "bg-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-sky-500",
  },
  physiology: {
    text: "text-rose-500",
    bg: "bg-rose-500/10",
    solidBg: "bg-rose-500",
    gradientFrom: "from-rose-500",
    gradientTo: "to-red-500",
  },
  "developmental-biology": {
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    solidBg: "bg-orange-500",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
  },
  neuroscience: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    solidBg: "bg-yellow-500",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-amber-500",
  },
  immunology: {
    text: "text-indigo-500",
    bg: "bg-indigo-500/10",
    solidBg: "bg-indigo-500",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-blue-600",
  },
  microbiology: {
    text: "text-lime-500",
    bg: "bg-lime-500/10",
    solidBg: "bg-lime-500",
    gradientFrom: "from-lime-500",
    gradientTo: "to-green-500",
  },
};

const defaultTopicColor = {
  text: "text-muted-foreground",
  bg: "bg-primary/10",
  gradientFrom: "from-primary",
  gradientTo: "to-blue-500",
};

const BioLabSidebar: React.FC<BioLabSidebarProps> = ({
  topics,
  activeTopicId,
  onTopicSelect,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    onTopicSelect(id);
  };

  return (
    <aside
      className={`bg-card border-r border-border flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
    >
      <div
        className={`flex items-center gap-2 mb-6 ${!isSidebarOpen && "justify-center"}`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          <ul>
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const colorScheme =
                topicColorSchemes[topic.id] || defaultTopicColor;
              return (
                <li key={topic.id} className="mb-1">
                  <a
                    href="#"
                    onClick={(e) => handleNavClick(e, topic.id)}
                    className={`flex items-center p-2.5 rounded-lg transition-all transform duration-300 font-normal text-sm w-full ${isActive ? `${colorScheme.bg} border-l-4 border-current scale-[1.05] shadow-sm` : `hover:bg-muted scale-100 hover:scale-[1.02] ${colorScheme.text}`}`}
                    title={topic.title}
                  >
                    <topic.icon
                      className={`w-5 h-5 flex-shrink-0 ${colorScheme.text} ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isSidebarOpen && (
                      <span
                        className={`truncate ${isActive ? `bg-gradient-to-r ${colorScheme.gradientFrom} ${colorScheme.gradientTo} bg-clip-text text-transparent` : colorScheme.text}`}
                      >
                        {topic.title}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default BioLabSidebar;
