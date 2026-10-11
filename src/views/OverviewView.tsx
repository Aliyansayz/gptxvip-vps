import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  Shield, 
  Clock, 
  Layers, 
  TrendingUp,
  Activity
} from "lucide-react";

interface StrategyItem {
  label?: string;
  name: string;
  description: string;
}

interface StrategySection {
  id: string;
  title: string;
  icon: string;
  themeColor: string;
  intro?: string;
  philosophy?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  items?: StrategyItem[];
}

interface StrategyData {
  strategyArchitecture: {
    header: {
      title: string;
      description: string;
    };
    sections: StrategySection[];
  };
}

const IconMap: Record<string, React.ElementType> = {
  Activity,
  Shield,
  TrendingUp,
  Clock,
  Zap,
  Layers
};

const ColorMap: Record<string, string> = {
  emerald: "text-emerald-500 bg-emerald-500/10",
  blue: "text-blue-500 bg-blue-500/10",
  purple: "text-purple-500 bg-purple-500/10",
  amber: "text-amber-500 bg-amber-500/10",
  yellow: "text-yellow-400 bg-yellow-400/10"
};

const getStrategySectionId = (id: string) => `strategy-section-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
const getStrategyHeadingId = (id: string) => `strategy-heading-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

export const OverviewView: React.FC = () => {
  const [data, setData] = useState<StrategyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch("/strategy-overview.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Strategy data request failed (${res.status})`);
        return res.json();
      })
      .then((json: StrategyData) => {
        if (!json?.strategyArchitecture?.header || !Array.isArray(json.strategyArchitecture.sections)) {
          throw new Error("Strategy data has an invalid shape");
        }
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        console.error("Error loading strategy data:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="font-semibold text-zinc-800 dark:text-zinc-100">Strategy overview is unavailable.</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">The page could not load its content. Try again in a moment.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </div>
    );
  }

  const { header, sections } = data.strategyArchitecture;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-16 pb-20"
    >
      {/* Header Section */}
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
          {header.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {header.description}
        </p>
      </div>

      {sections.length > 1 && (
        <nav aria-label="Strategy overview sections" className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${getStrategySectionId(section.id)}`}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-emerald-500/40 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-emerald-300"
            >
              {section.title}
            </a>
          ))}
        </nav>
      )}

      {/* Article Content */}
      <div className="space-y-20">
        {sections.map((section) => {
          const Icon = IconMap[section.icon] || Activity;
          const colorClasses = ColorMap[section.themeColor] || ColorMap.emerald;
          const sectionId = getStrategySectionId(section.id);
          const headingId = getStrategyHeadingId(section.id);

          if (section.id === "advance-strategies") {
            return (
              <section key={section.id} id={sectionId} aria-labelledby={headingId} className="scroll-mt-24 p-8 bg-zinc-900 dark:bg-zinc-950 rounded-3xl text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <Layers className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <h2 id={headingId} className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-zinc-300">
                    {section.subtitle}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {section.tags?.map(tag => (
                      <div key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.id === "common-indicators") {
            return (
              <section key={section.id} id={sectionId} aria-labelledby={headingId} className="relative scroll-mt-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]}`}>
                    <Icon className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
                  </div>
                  <h2 id={headingId} className="text-2xl font-bold">{section.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {section.intro}
                    </p>
                    <ul className="space-y-4 mt-6 list-none p-0">
                      {section.items?.map((item) => (
                        <li key={item.label} className="flex gap-4">
                          <span className={`font-bold min-w-[120px] ${colorClasses.split(' ')[0]}`}>{item.label}</span>
                          <span className="text-sm text-zinc-500">{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Signal Philosophy</h4>
                    <p className="italic text-zinc-500 text-sm leading-relaxed">
                      "{section.philosophy}"
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          if (section.id === "threshold-exits") {
            return (
              <section key={section.id} id={sectionId} aria-labelledby={headingId} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]}`}>
                    <Icon className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
                  </div>
                  <h2 id={headingId} className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.items?.map(item => (
                    <div key={item.name} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <h4 className="font-bold mb-2">{item.name}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <p className="text-[10px] uppercase font-bold tracking-tighter text-blue-500/60 text-center">Static Risk Management Layer</p>
                  </div>
                </div>
              </section>
            );
          }

          // Default layout for Indicator and Time Bounded (Side by side in the grid)
          return (
            <section key={section.id} id={sectionId} aria-labelledby={headingId} className="space-y-6 scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]}`}>
                  <Icon className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
                </div>
                <h2 id={headingId} className="text-xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items?.map(item => (
                  <div key={item.name} className="group p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                    <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-zinc-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
};
