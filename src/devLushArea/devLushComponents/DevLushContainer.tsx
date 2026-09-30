import React, { useState, useEffect, useRef } from "react";
import DevLushSidebar from "./devLushTopicsView/DevLushSidebar";
import DevLushHub from "./devLushTopicsView/DevLushHub";
import DevLushRunner from "./devLushTopicsView/DevLushRunner";
import { DevLushSearchView } from "./devLushTopicsView/DevLushSearchView";
import { LabData, ConceptCourse } from "./devLushTypes";
import { toast } from "sonner";
import { ShieldAlert, ShoppingBag, Calculator, Bot, Database } from "lucide-react";
import devLushChaptersRaw from "./data";
import { useFavorites } from "../agentDevRootComponents/FavoritesContext";
import { AgentLabsMobileLearningNav } from "../agentDevRootComponents/AgentLabsMobileLearningNav";
import { AgentLabsMobileTopicRail } from "../agentDevRootComponents/AgentLabsMobileTopicRail";

interface EnrichedConceptData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  chapters: LabData[];
  group: string;
}

interface DevLushContainerProps {
  isLocked: boolean;
  onConsumeEnergy: () => boolean;
  initialChapterId?: string | null;
  initialTopicId?: string;
  onChapterOpened?: () => void;
  onSimulationComplete?: () => void;
  onSearchClick: () => void;
  onSavedClick: () => void;
  onSearchClose?: () => void;
  initialSearchOpen?: boolean;
  routeChapterId?: string;
  onChapterRoutePush?: (chapterId: string) => void;
  onChapterRouteBack?: () => void;
  onTopicHubReplace?: () => void;
  onExit?: () => void;
}

// Static high-fidelity DevLush Course Curriculum Data
const devLushCourseData = [
  {
    id: "reinforcement-learning",
    title: "Reinforcement Learning",
    description:
      "Trial and error learning, reward systems, and physical simulations.",
    longDescription:
      "Explore how computational agents learn to master complex physical tasks through trial, error, and reward in simulated environments.",
  },
  {
    id: "agent-and-its-types",
    title: "Agent and its Types",
    description:
      "Enterprise agent architectures, orchestration patterns, and system coordination.",
    longDescription:
      "Explore foundational architectural patterns for multi-agent systems, from simple Orchestrator-Worker models to complex Coordination layers in enterprise environments.",
  },
  {
    id: "recommendation-agents",
    title: "Recommendation Agents",
    description:
      "Personalized recommendations based on user memory data.",
    longDescription:
      "Explore how Recommendation Agents use memory of user personalized data to provide relevant and personalized recommendations.",
  },
  {
    id: "web-bugbounty",
    title: "Web Bug Bounty",
    description:
      "Vulnerability analysis, web application security, and ethical hacking.",
    longDescription:
      "Study modern web vulnerabilities. Understand attack surface discovery, exploit high-impact authorization flaws like IDOR, and prioritize risks in bug bounty programs.",
  },
  {
    id: "offensive-ai-cybersecurity",
    title: "Offensive AI & Cybersecurity",
    description:
      "Autonomous security agents, perception-action reasoning, and prompt injection mitigation.",
    longDescription:
      "Explore the foundations of autonomous cyber operations. Analyze how LLM-driven agents map enterprise network architectures, and how hostile actors leverage context injection payloads to hijack execution shells.",
  },
  {
    id: "ecommerce-agents",
    title: "Ecommerce Agents",
    description:
      "Multi-agent synchronization, race conditions, and competitor feedback loops.",
    longDescription:
      "Investigate dynamic automated marketplace sandboxes. Understand concurrency collisions between parallel procurement agents, and analyze dynamic pricing cascades that lead to massive asset devaluation.",
  },
  {
    id: "accounting-agents",
    title: "Accounting Agents",
    description:
      "Benford's Law digital compliance, ledger audits, and precise decimal tools.",
    longDescription:
      "Study automated compliance in high-stakes financial operations. Analyze transaction datasets against logarithmic digit frequency distributions, and correct agent decimal rounding math errors.",
  },
  {
    id: "finance-agents",
    title: "Finance Agents",
    description:
      "Algorithmic trading, quantitative analysis, and risk management automation.",
    longDescription:
      "Explore how autonomous agents evaluate market conditions, execute high-frequency trades, and assess portfolio risk using statistical models and real-time market data APIs.",
  },
  {
    id: "devtools-agents",
    title: "Software Engineering (DevTools) Agents",
    description:
      "Autonomous code review, architectural analysis, and QA automation.",
    longDescription:
      "Discover how AI reviewers enforce system architecture patterns and how QA agents translate product requirements directly into comprehensive test suites.",
  },
  {
    id: "healthcare-agents",
    title: "Healthcare & Medical Triage Agents",
    description:
      "Clinical documentation, ambient intelligence, and medical research synthesis.",
    longDescription:
      "Analyze the impact of ambient agents drafting EHR notes and specialized research bots cross-referencing real-time medical journals with patient records.",
  },
  {
    id: "legal-agents",
    title: "Legal & Compliance Agents",
    description:
      "Autonomous contract parsing and dynamic regulatory monitoring.",
    longDescription:
      "Examine how enterprise legal agents ingest complex vendor agreements to redline liabilities and continuously monitor global compliance requirements.",
  },
  {
    id: "supplychain-agents",
    title: "Supply Chain & Logistics Agents",
    description:
      "Predictive inventory optimization and dynamic fleet rerouting.",
    longDescription:
      "Understand how agents predict demand spikes using external variables and autonomously restructure delivery routes during supply chain disruptions.",
  },
  {
    id: "marketing-agents",
    title: "Marketing Agents",
    description:
      "Autonomous campaign optimization, persona generation, and A/B testing.",
    longDescription:
      "Explore how autonomous agents manage marketing campaigns, optimize ad spend, dynamically segment users, and A/B test creatives in real-time.",
  },
  {
    id: "helpdesk-agents",
    title: "IT Helpdesk & Internal Support",
    description:
      "Zero-touch ticket resolution and autonomous system provisioning.",
    longDescription:
      "Learn how internal agents intercept IT support requests, validate HR policies, and autonomously provision software licenses via APIs.",
  },
  {
    id: "system-design",
    title: "System Design & Distributed Systems",
    description:
      "Database sharding, event-driven architecture, and system scalability.",
    longDescription:
      "Explore how robust distributed architectures are designed to handle scale, focusing on data partitioning strategies and asynchronous event processing.",
  }
];

const devLushChapters = devLushChaptersRaw as LabData[];
const COMPLETED_LABS_STORAGE_KEY = 'gptxvip_agent_labs_completed_chapters';
const TOPIC_GOAL_GROUPS: Record<string, string> = {
  'reinforcement-learning': 'Foundations',
  'agent-and-its-types': 'Foundations',
  'recommendation-agents': 'Foundations',
  'web-bugbounty': 'Build and secure',
  'offensive-ai-cybersecurity': 'Build and secure',
  'devtools-agents': 'Build and secure',
  'system-design': 'Build and secure',
  'ecommerce-agents': 'Applied work',
  'accounting-agents': 'Applied work',
  'finance-agents': 'Applied work',
  'healthcare-agents': 'Applied work',
  'legal-agents': 'Applied work',
  'supplychain-agents': 'Applied work',
  'marketing-agents': 'Applied work',
  'helpdesk-agents': 'Applied work',
};
const TOPIC_GROUP_ORDER = ['Foundations', 'Build and secure', 'Applied work'];

const readCompletedLabs = (): string[] => {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(COMPLETED_LABS_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const MOBILE_TOPIC_LABELS: Record<string, string> = {
  "agent-and-its-types": "Agent Types",
  "recommendation-agents": "Recommendations",
  "offensive-ai-cybersecurity": "AI Security",
  "ecommerce-agents": "Ecommerce",
  "accounting-agents": "Accounting",
  "finance-agents": "Finance",
  "devtools-agents": "DevTools",
  "healthcare-agents": "Healthcare",
  "legal-agents": "Legal",
  "supplychain-agents": "Supply Chain",
  "marketing-agents": "Marketing",
  "helpdesk-agents": "Helpdesk",
  "system-design": "System Design",
};

const readTopicScroll = (topicId: string): number => {
  try {
    const parsed = Number.parseInt(sessionStorage.getItem(`devlush_scroll_pos_${topicId}`) || "0", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

const saveTopicScroll = (topicId: string, scrollTop: number) => {
  try {
    sessionStorage.setItem(`devlush_scroll_pos_${topicId}`, String(Math.max(0, scrollTop)));
  } catch {
    // Topic browsing remains usable when browser storage is unavailable.
  }
};

export const DevLushContainer: React.FC<DevLushContainerProps> = ({
  isLocked,
  onConsumeEnergy,
  initialChapterId,
  initialTopicId,
  onChapterOpened,
  onSimulationComplete,
  onSearchClick,
  onSavedClick,
  onSearchClose,
  initialSearchOpen = false,
  routeChapterId,
  onChapterRoutePush,
  onChapterRouteBack,
  onTopicHubReplace,
  onExit,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    "offensive-ai-cybersecurity",
  );
  const [selectedChapter, setSelectedChapter] = useState<LabData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(initialSearchOpen);
  const [loading, setLoading] = useState(false);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(readCompletedLabs);
  const routeChapterEntryRef = useRef<string | undefined>(undefined);
  const mobileTopicRailRef = useRef<HTMLDivElement>(null);
  const { favorites } = useFavorites();

  useEffect(() => {
    try { window.localStorage.setItem(COMPLETED_LABS_STORAGE_KEY, JSON.stringify(completedChapterIds)); } catch { /* Progress remains available in this session. */ }
  }, [completedChapterIds]);

  useEffect(() => {
    setIsSearchOpen(initialSearchOpen);
  }, [initialSearchOpen]);

  // Rich mapping of icons to topics
  const topicIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    "reinforcement-learning": Bot,
    "agent-and-its-types": Bot,
    "web-bugbounty": ShieldAlert,
    "offensive-ai-cybersecurity": ShieldAlert,
    "ecommerce-agents": ShoppingBag,
    "accounting-agents": Calculator,
    "finance-agents": Calculator,
    "devtools-agents": Bot,
    "healthcare-agents": Calculator,
    "legal-agents": ShieldAlert,
    "supplychain-agents": ShoppingBag,
    "marketing-agents": Bot,
    "helpdesk-agents": Bot,
    "system-design": Database,
    "recommendation-agents": Bot,
  };

  const enrichedTopics: EnrichedConceptData[] = devLushCourseData.map(
    (course) => ({
      ...course,
      group: TOPIC_GOAL_GROUPS[course.id] || 'Applied work',
      icon: topicIcons[course.id] || Bot,
      chapters: devLushChapters.filter(
        (ch) => ch.course.toLowerCase() === course.title.toLowerCase(),
      ),
    }),
  ).sort((a, b) => TOPIC_GROUP_ORDER.indexOf(a.group) - TOPIC_GROUP_ORDER.indexOf(b.group));

  useEffect(() => {
    if (!initialTopicId) return;
    const topicExists = enrichedTopics.some((topic) => topic.id === initialTopicId);
    if (!topicExists) {
      toast.error("This Agent Labs topic is no longer available.");
      return;
    }
    setActiveTopicId(initialTopicId);
    setSelectedChapter(null);
    setIsSearchOpen(false);
  }, [initialTopicId]);

  // Deep linking from search/favorites
  useEffect(() => {
    if (initialChapterId && enrichedTopics.length > 0) {
      const foundChapter = devLushChapters.find(
        (c) => c.labComponentId === initialChapterId,
      );
      const matchedTopic = enrichedTopics.find((topic) =>
        topic.chapters.some((chapter) => chapter.labComponentId === initialChapterId),
      );
      if (!foundChapter || !matchedTopic) {
        toast.error("This saved lab is no longer available.");
        onChapterOpened?.();
        return;
      }
      if (isLocked || !onConsumeEnergy()) {
        toast.error("Simulation Locked: Insufficient Energy or App Locked");
        onChapterOpened?.();
        return;
      }
      setActiveTopicId(matchedTopic.id);
      setSelectedChapter(foundChapter);
      onChapterOpened?.();
    }
  }, [initialChapterId]);

  useEffect(() => {
    if (!routeChapterId) {
      if (routeChapterEntryRef.current) {
        routeChapterEntryRef.current = undefined;
        setSelectedChapter(null);
        setIsSearchOpen(initialSearchOpen);
      }
      return;
    }

    routeChapterEntryRef.current = routeChapterId;
    const matchedTopic = enrichedTopics.find((topic) =>
      topic.chapters.some((chapter) => chapter.labComponentId === routeChapterId),
    );
    const chapter = matchedTopic?.chapters.find((item) => item.labComponentId === routeChapterId);
    if (!chapter || !matchedTopic) {
      setSelectedChapter(null);
      return;
    }

    setActiveTopicId(matchedTopic.id);
    setSelectedChapter(chapter);
    setIsSearchOpen(false);
  }, [routeChapterId, initialSearchOpen]);

  // Auto sidebar collapse during active runner simulation
  useEffect(() => {
    setIsSidebarOpen(!selectedChapter);
  }, [selectedChapter]);

  const handleStartChapter = (chapter: LabData) => {
    if (isLocked) {
      toast.error("Simulation Locked: Insufficient Energy or App Locked");
      return;
    }
    if (onConsumeEnergy()) {
      setSelectedChapter(chapter);
      setIsSearchOpen(false);
      onChapterRoutePush?.(chapter.labComponentId);
    }
  };

  const handleReturnFromChapter = () => {
    setSelectedChapter(null);
    if (routeChapterId) onChapterRouteBack?.();
  };

  const sidebarTopics = enrichedTopics.map((t) => ({
    id: t.id,
    title: t.title,
    icon: t.icon,
    group: t.group,
  }));

  const selectTopic = (id: string) => {
    setActiveTopicId(id);
    setSelectedChapter(null);
    setIsSearchOpen(false);
    if (routeChapterId || initialSearchOpen) onTopicHubReplace?.();
  };

  const showTopicHub = () => {
    setSelectedChapter(null);
    setIsSearchOpen(false);
    if (initialSearchOpen || routeChapterId) {
      if (onTopicHubReplace) onTopicHubReplace();
      else onSearchClose?.();
    }
  };

  useEffect(() => {
    if (selectedChapter || isSearchOpen) return;
    mobileTopicRailRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  }, [activeTopicId, isSearchOpen, selectedChapter]);

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Save scroll position when the user scrolls
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    saveTopicScroll(activeTopicId, e.currentTarget.scrollTop);
  };

  // Callback ref to restore scroll position as soon as element mounts
  const setScrollRef = (el: HTMLDivElement | null) => {
    if (el) {
      scrollContainerRef.current = el;
      const scrollTopVal = readTopicScroll(activeTopicId);
      el.scrollTop = scrollTopVal;
      // Also schedule a secondary check just in case images/layouts load and shift height
      setTimeout(() => {
        if (el) el.scrollTop = scrollTopVal;
      }, 100);
    } else {
      scrollContainerRef.current = null;
    }
  };

  // Also handle scroll restoration when switching topics
  useEffect(() => {
    if (!selectedChapter && scrollContainerRef.current) {
      const scrollTopVal = readTopicScroll(activeTopicId);
      scrollContainerRef.current.scrollTop = scrollTopVal;
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTopVal;
        }
      }, 100);
    }
  }, [activeTopicId, selectedChapter]);

  return (
    <div className="relative flex h-full w-full min-w-0 overflow-hidden bg-slate-50 dark:bg-black">
      <DevLushSidebar
        topics={sidebarTopics}
        activeTopicId={activeTopicId}
        onTopicSelect={selectTopic}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSearchClick={() => {
          setIsSearchOpen(true);
          onSearchClick();
        }}
        onExit={onExit}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {!selectedChapter && !isSearchOpen && (
          <AgentLabsMobileTopicRail
            topics={sidebarTopics}
            activeTopicId={activeTopicId}
            onTopicSelect={selectTopic}
            onSearchClick={() => { setIsSearchOpen(true); onSearchClick(); }}
            topicLabels={MOBILE_TOPIC_LABELS}
            containerRef={mobileTopicRailRef}
          />
        )}
        <main className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-black ${selectedChapter ? "" : "pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0"}`}>
          {selectedChapter ? (
            <DevLushRunner
              chapter={selectedChapter}
              onBack={handleReturnFromChapter}
              onComplete={() => {
                setCompletedChapterIds((current) => current.includes(selectedChapter.labComponentId) ? current : [...current, selectedChapter.labComponentId]);
                toast.success("Simulation Completed Successfully!");
                handleReturnFromChapter();
                onSimulationComplete?.();
              }}
            />
          ) : isSearchOpen ? (
            <DevLushSearchView
              devLushTopics={enrichedTopics}
              onStartChapter={handleStartChapter}
              onClose={() => {
                setIsSearchOpen(false);
                onSearchClose?.();
              }}
            />
          ) : (
            <div
              ref={setScrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto custom-scrollbar flex relative"
            >
              <div className="flex-1 flex flex-col min-h-fit pb-16">
                <DevLushHub
                  devLushTopics={enrichedTopics}
                  isLoading={loading}
                  activeTopicId={activeTopicId}
                  completedChapterIds={completedChapterIds}
                  onStartChapter={handleStartChapter}
                />
              </div>
            </div>
          )}
        </main>
        {!selectedChapter && (
          <AgentLabsMobileLearningNav
            activeTab={isSearchOpen ? "search" : "learn"}
            savedCount={favorites.length}
            onLearn={showTopicHub}
            onSearch={() => { if (!isSearchOpen) { setIsSearchOpen(true); onSearchClick(); } }}
            onSaved={onSavedClick}
          />
        )}
      </div>
    </div>
  );
};

export default DevLushContainer;
