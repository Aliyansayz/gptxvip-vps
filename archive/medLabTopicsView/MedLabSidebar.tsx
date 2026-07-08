import React from "react";

interface Topic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MedLabSidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearchClick: () => void;
}

const MedLabSidebar: React.FC<MedLabSidebarProps> = ({
  topics,
  activeTopicId,
  onTopicSelect,
  isSidebarOpen,
  setIsSidebarOpen,
  onSearchClick,
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
      className={`bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
    >
      <div
        className={`flex items-center gap-2 mb-8 ${!isSidebarOpen && "justify-center"}`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-6 w-6 text-cyan-400 hover:text-cyan-300 flex-shrink-0"
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
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-white truncate tracking-wider">
            MED<span className="text-cyan-400">LABS</span>
          </h1>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={onSearchClick}
          className={`flex items-center w-full p-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/30 transition-all ${!isSidebarOpen && "justify-center"}`}
          title="Search MedLabs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          {isSidebarOpen && (
            <span className="font-semibold text-sm">Search MedLabs</span>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          <ul>
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              return (
                <li key={topic.id} className="mb-2">
                  <a
                    href="#"
                    onClick={(e) => handleNavClick(e, topic.id)}
                    className={`flex items-center p-2 text-sm w-full font-bold transition-all duration-300 transform rounded-lg ${isActive ? "bg-cyan-900/50 text-cyan-400 border border-cyan-800 scale-[1.05] shadow-lg" : "text-cyan-500 border border-transparent hover:bg-slate-800 hover:text-cyan-300 scale-100 hover:scale-[1.02]"}`}
                    title={topic.title}
                  >
                    <topic.icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-cyan-400" : "text-cyan-500"} ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isSidebarOpen && (
                      <span className={`truncate`}>{topic.title}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        {!isSidebarOpen && (
          <div className="flex-1 flex items-center justify-center">
            <h2
              className="font-bold text-slate-700 uppercase tracking-widest"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Medical Simulation
            </h2>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MedLabSidebar;
