import React, { useState, useEffect } from "react";
import DevLushSidebar from "./devLushTopicsView/DevLushSidebar";
import DevLushHub from "./devLushTopicsView/DevLushHub";
import DevLushRunner from "./devLushTopicsView/DevLushRunner";
import { DevLushSearchView } from "./devLushTopicsView/DevLushSearchView";
import { LabData, ConceptCourse } from "../../types";
import { toast } from "sonner";
import { ShieldAlert, ShoppingBag, Calculator, Bot, Database } from "lucide-react";
import devLushChaptersRaw from "./data";

interface EnrichedConceptData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  chapters: LabData[];
}

interface DevLushContainerProps {
  isLocked: boolean;
  onConsumeEnergy: () => boolean;
  initialChapterId?: string | null;
  onChapterOpened?: () => void;
  onSimulationComplete: () => void;
  onSearchClick: () => void;
  initialSearchOpen?: boolean;
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

export const DevLushContainer: React.FC<DevLushContainerProps> = ({
  isLocked,
  onConsumeEnergy,
  initialChapterId,
  onChapterOpened,
  onSimulationComplete,
  onSearchClick,
  initialSearchOpen = false,
  onExit,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    "offensive-ai-cybersecurity",
  );
  const [selectedChapter, setSelectedChapter] = useState<LabData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(initialSearchOpen);
  const [loading, setLoading] = useState(false);

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
      icon: topicIcons[course.id] || Bot,
      chapters: devLushChapters.filter(
        (ch) => ch.course.toLowerCase() === course.title.toLowerCase(),
      ),
    }),
  );

  // Deep linking from search/favorites
  useEffect(() => {
    if (initialChapterId && enrichedTopics.length > 0) {
      const foundChapter = devLushChapters.find(
        (c) => c.labComponentId === initialChapterId,
      );
      if (foundChapter) {
        const matchedTopic = enrichedTopics.find(
          (t) => t.title.toLowerCase() === foundChapter.course.toLowerCase(),
        );
        if (matchedTopic) {
          setActiveTopicId(matchedTopic.id);
          setSelectedChapter(foundChapter);
          if (onChapterOpened) onChapterOpened();
        }
      }
    }
  }, [initialChapterId]);

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
    }
  };

  const sidebarTopics = enrichedTopics.map((t) => ({
    id: t.id,
    title: t.title,
    icon: t.icon,
  }));

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Save scroll position when the user scrolls
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem(
      "devlush_scroll_pos_" + activeTopicId,
      e.currentTarget.scrollTop.toString(),
    );
  };

  // Callback ref to restore scroll position as soon as element mounts
  const setScrollRef = (el: HTMLDivElement | null) => {
    if (el) {
      scrollContainerRef.current = el;
      const savedScroll = sessionStorage.getItem(
        "devlush_scroll_pos_" + activeTopicId,
      );
      if (savedScroll) {
        const scrollTopVal = parseInt(savedScroll, 10);
        el.scrollTop = scrollTopVal;
        // Also schedule a secondary check just in case images/layouts load and shift height
        setTimeout(() => {
          if (el) el.scrollTop = scrollTopVal;
        }, 100);
      }
    } else {
      scrollContainerRef.current = null;
    }
  };

  // Also handle scroll restoration when switching topics
  useEffect(() => {
    if (!selectedChapter && scrollContainerRef.current) {
      const savedScroll =
        sessionStorage.getItem("devlush_scroll_pos_" + activeTopicId) || "0";
      const scrollTopVal = parseInt(savedScroll, 10);
      scrollContainerRef.current.scrollTop = scrollTopVal;
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTopVal;
        }
      }, 100);
    }
  }, [activeTopicId, selectedChapter]);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-black w-full relative">
      <DevLushSidebar
        topics={sidebarTopics}
        activeTopicId={activeTopicId}
        onTopicSelect={(id) => {
          setActiveTopicId(id);
          setSelectedChapter(null); // Go back to topic chapters lists
          setIsSearchOpen(false);
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        onExit={onExit}
      />

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <main className="flex-1 bg-slate-50 dark:bg-black overflow-hidden relative flex flex-col">
          {selectedChapter ? (
            <DevLushRunner
              chapter={selectedChapter}
              onBack={() => setSelectedChapter(null)}
              onComplete={() => {
                toast.success("Simulation Completed Successfully!");
                setSelectedChapter(null);
                onSimulationComplete();
              }}
            />
          ) : isSearchOpen ? (
            <DevLushSearchView
              devLushTopics={enrichedTopics}
              onStartChapter={handleStartChapter}
              onClose={() => setIsSearchOpen(false)}
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
                  onStartChapter={handleStartChapter}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DevLushContainer;
