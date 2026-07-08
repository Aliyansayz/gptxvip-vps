import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Search,
  Info,
  ShieldAlert,
  Zap,
  Loader2,
  Activity,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  ListFilter,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { AllMetricsList } from "./AllMetricsList";
import { MetricsRightPane } from "./MetricsRightPane";
import { MetricSlider } from "./MetricSlider";
import { evaluateDiagnostics } from "./symptoms_state_manager";
import { SymptomDetailPane } from "../SymptomsLabTopics/SymptomDetailPane";
import { GetActiveAbnormalMetrics } from "./getActiveAbnormalMetrics";

export interface Metric {
  label: string;
  value: number;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  suspiciousDeviation?: number;
  criticalDeviation?: number;
  color: string;
  bg: string;
}

export interface Symptom {
  id: number;
  label: string;
  category: string;
  severity: string;
  description: string;
  causes: string;
  commonSigns: string[];
  emergency: string;
  bgImage: string;
  metrics: Metric[];
}

export const SymptomsLabView = ({
  verticalNav,
}: {
  verticalNav?: React.ReactNode;
}) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [metricValues, setMetricValues] = useState<Record<string, number>>({});
  const [showDictionary, setShowDictionary] = useState(false);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(false);
  const [showSymptomDetails, setShowSymptomDetails] = useState(false);
  const [showNormalReadings, setShowNormalReadings] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activatedMetricLabels, setActivatedMetricLabels] = useState<Set<string>>(new Set());
  const [metricsMousePos, setMetricsMousePos] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    fetch("/symptoms.json")
      .then((res) => res.text())
      .then((text) => {
        const data = text ? JSON.parse(text) : [];
        setSymptoms(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load symptoms:", err);
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(symptoms.map((s) => s.category)))];
  }, [symptoms]);

  const filteredSymptoms = symptoms.filter((s) => {
    const matchesSearch =
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentSymptom = filteredSymptoms[selectedIndex];

  const handleSymptomSelect = (id: number) => {
    const index = filteredSymptoms.findIndex(s => s.id === id);
    let targetSymptom: Symptom | undefined;
    
    if (index !== -1) {
      setSelectedIndex(index);
      targetSymptom = filteredSymptoms[index];
      // Auto-expand sidebar if it's collapsed so user sees the change
      if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      toast.info(`Switched to ${targetSymptom.label}`);
    } else {
      // If not in current filtered list, switch category to "All" and try again
      setSelectedCategory("All");
      const allIndex = symptoms.findIndex(s => s.id === id);
      if (allIndex !== -1) {
        setSelectedIndex(allIndex);
        targetSymptom = symptoms[allIndex];
        toast.info(`Switched specialty to find ${targetSymptom.label}`);
      }
    }

    // Apply "Mild" severity state when selecting a non-healthy symptom
    if (targetSymptom && targetSymptom.id !== 0) {
      setMetricValues((prev) => {
        const newValues = { ...prev };
        const healthyBaseline = symptoms.find(s => s.id === 0);
        
        targetSymptom?.metrics?.forEach((m) => {
          const baselineMetric = healthyBaseline?.metrics?.find(bm => bm.label === m.label) || m;
          
          let mildValue = (baselineMetric.normalMin + baselineMetric.normalMax) / 2;
          
          if (m.value > baselineMetric.normalMax) {
            // High abnormality -> Mildly high (just above normalMax)
            const rangeDifference = m.value - baselineMetric.normalMax;
            mildValue = baselineMetric.normalMax + (rangeDifference * 0.25);
          } else if (m.value < baselineMetric.normalMin) {
            // Low abnormality -> Mildly low (just below normalMin)
            const rangeDifference = baselineMetric.normalMin - m.value;
            mildValue = baselineMetric.normalMin - (rangeDifference * 0.25);
          }
          
          newValues[m.label] = mildValue;
        });
        return newValues;
      });
    }
  };

  const allMetrics = useMemo(() => {
    const metricsMap = new Map<string, Metric>();
    symptoms.forEach((s) => {
      s.metrics?.forEach((m) => {
        if (!metricsMap.has(m.label)) {
          metricsMap.set(m.label, m);
        }
      });
    });
    return Array.from(metricsMap.values());
  }, [symptoms]);

  const diagnosticBlocks = useMemo(() => {
    return evaluateDiagnostics(metricValues, symptoms, currentSymptom?.id);
  }, [metricValues, symptoms, currentSymptom?.id]);

  const activeMetrics = useMemo(() => {
    const map = new Map<string, Metric>();
    
    // 1. Always include metrics that have been "activated" (manually added or arrived with a symptom)
    allMetrics.forEach(m => {
      if (activatedMetricLabels.has(m.label)) {
        map.set(m.label, m);
      }
    });

    // 2. Add current symptom metrics (and track them as activated)
    currentSymptom?.metrics?.forEach((m) => {
      map.set(m.label, m);
    });

    // 3. Add metrics from confirmed or suspected symptoms
    const activeIds = diagnosticBlocks
      .filter((b) => b.status === "Confirmed" || b.status === "Suspected")
      .map((b) => b.symptomId);

    symptoms.forEach((s) => {
      if (activeIds.includes(s.id)) {
        s.metrics?.forEach((m) => {
          if (!map.has(m.label)) {
            map.set(m.label, m);
          }
        });
      }
    });

    return Array.from(map.values());
  }, [currentSymptom, symptoms, diagnosticBlocks, activatedMetricLabels, allMetrics]);

  // Track activated metrics when they appear
  useEffect(() => {
    if (activeMetrics.length > 0) {
      setActivatedMetricLabels(prev => {
        const next = new Set(prev);
        let changed = false;
        activeMetrics.forEach(m => {
          if (!next.has(m.label)) {
            next.add(m.label);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [activeMetrics]);

  // Initialize metric values
  useEffect(() => {
    if (symptoms.length > 0) {
      const healthyBaseline = symptoms.find(s => s.id === 0);
      setMetricValues((prev) => {
        const newValues = { ...prev };
        let hasChanges = false;
        
        // Strategy: Use healthy baseline values for everything first
        allMetrics.forEach((m) => {
          if (newValues[m.label] === undefined) {
            // Find this metric in healthy baseline if possible
            const baselineMetric = healthyBaseline?.metrics?.find(bm => bm.label === m.label);
            if (baselineMetric) {
              newValues[m.label] = baselineMetric.value;
            } else {
              // Fallback to midpoint of normal range
              newValues[m.label] = (m.normalMin + m.normalMax) / 2;
            }
            hasChanges = true;
          }
        });
        return hasChanges ? newValues : prev;
      });

      // Ensure we start at index 0 (Healthy Baseline)
      setSelectedIndex(0);
    }
  }, [symptoms, allMetrics]);

  // Track current symptom metrics
  useEffect(() => {
    if (currentSymptom?.metrics) {
      setMetricValues((prev) => {
        const newValues = { ...prev };
        let hasChanges = false;
        currentSymptom.metrics.forEach((m) => {
          if (newValues[m.label] === undefined) {
            newValues[m.label] = m.value;
            hasChanges = true;
          }
        });
        return hasChanges ? newValues : prev;
      });
    }
  }, [currentSymptom]);

  const handleMetricChange = (label: string, newVal: string) => {
    setMetricValues((prev) => ({ ...prev, [label]: parseFloat(newVal) }));
  };

  const handleResetSymptom = (symptomId: number) => {
    // If resetting Healthy Baseline (id 0), reset ALL active metrics to normal
    if (symptomId === 0) {
      setMetricValues((prev) => {
        const newValues = { ...prev };
        activeMetrics.forEach((m) => {
          newValues[m.label] = (m.normalMin + m.normalMax) / 2;
        });
        return newValues;
      });
      // Also reset current selection to 0
      setSelectedIndex(0);
      toast.success("Homeostatic global baseline restored");
      return;
    }

    const symptomToReset = symptoms.find((s) => s.id === symptomId);
    if (!symptomToReset || !symptomToReset.metrics) return;

    const healthyBaseline = symptoms.find(s => s.id === 0);

    setMetricValues((prev) => {
      const newValues = { ...prev };
      symptomToReset.metrics.forEach((m) => {
        // Try to find the "Healthy" value for this metric
        const baselineMetric = healthyBaseline?.metrics?.find(bm => bm.label === m.label);
        if (baselineMetric) {
          newValues[m.label] = baselineMetric.value;
        } else {
          newValues[m.label] = (m.normalMin + m.normalMax) / 2;
        }
      });
      return newValues;
    });

    // Strategy: If we are curing the current focus, shift back to Healthy Baseline
    if (currentSymptom?.id === symptomId) {
      setSelectedIndex(0);
    }

    toast.success(`Homeostatic baseline restored for ${symptomToReset.label}`);
  };

  const handleAddMetric = (metricToAdd: Metric) => {
    // Calculate a normal value (midpoint of normal range)
    const normalValue = (metricToAdd.normalMin + metricToAdd.normalMax) / 2;

    const metricWithNormalValue = {
      ...metricToAdd,
      value: normalValue,
    };

    setSymptoms((prevSymptoms) => {
      const newSymptoms = [...prevSymptoms];
      const actualSymptomId = currentSymptom.id;
      const symptomIndex = newSymptoms.findIndex(
        (s) => s.id === actualSymptomId,
      );

      if (symptomIndex !== -1) {
        const symptom = newSymptoms[symptomIndex];
        if (!symptom.metrics.some((m) => m.label === metricToAdd.label)) {
          newSymptoms[symptomIndex] = {
            ...symptom,
            metrics: [...symptom.metrics, metricWithNormalValue],
          };
        }
      }
      return newSymptoms;
    });

    setMetricValues((prev) => {
      if (prev[metricToAdd.label] === undefined) {
        return { ...prev, [metricToAdd.label]: normalValue };
      }
      return prev;
    });
  };

  const handleMetricsMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMetricsMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [],
  );

  // Auto-scroll logic
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const moveUp = useCallback(() => {
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : filteredSymptoms.length - 1,
    );
  }, [filteredSymptoms.length]);

  const moveDown = useCallback(() => {
    setSelectedIndex((prev) =>
      prev < filteredSymptoms.length - 1 ? prev + 1 : 0,
    );
  }, [filteredSymptoms.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          event.preventDefault();
          moveUp();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          event.preventDefault();
          moveDown();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveUp, moveDown]);

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return "text-red-500 border-red-500/30 bg-red-500/10";
      case "high":
        return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "medium":
        return "text-blue-500 border-blue-500/30 bg-blue-500/10";
      default:
        return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!currentSymptom) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-slate-500">
        No data available.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-black text-foreground overflow-hidden font-sans select-none relative">
      {/* Minimal Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 64 : 288 }}
        className="flex flex-col border-r border-slate-800 bg-slate-900 z-30 flex-shrink-0 relative group"
      >
        <div
          className={`p-6 border-b border-slate-800 transition-opacity duration-300 ${isSidebarCollapsed ? "opacity-0 invisible h-0 p-0 overflow-hidden" : "opacity-100 visible h-auto"}`}
        >
          <div className="mb-6 flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter size={12} /> Specialty Filter
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full appearance-none bg-slate-800 border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-8 text-sm font-medium text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors shadow-sm cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-800">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Toggle Button for Sidebar - Embedded */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`absolute -right-3 top-20 z-50 p-1.5 bg-slate-900 border border-slate-700 rounded-full text-slate-400 hover:text-cyan-400 transition-all shadow-md group-hover:scale-110 active:scale-95`}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={12} />
          ) : (
            <PanelLeftClose size={12} />
          )}
        </button>

        <nav
          className={`flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1 ${isSidebarCollapsed ? "flex flex-col items-center" : ""}`}
        >
          {filteredSymptoms.map((symptom, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={symptom.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => handleSymptomSelect(symptom.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all transform duration-300 outline-none text-left font-bold
                  ${
                    isSelected
                      ? "bg-cyan-900/50 text-cyan-400 border border-cyan-800 scale-[1.05] shadow-lg"
                      : "text-cyan-500 hover:text-cyan-300 border border-transparent hover:bg-slate-800 scale-100 hover:scale-[1.02]"
                  }
                  ${isSidebarCollapsed ? "justify-center p-2.5" : ""}
                `}
                title={isSidebarCollapsed ? symptom.label : ""}
              >
                {isSidebarCollapsed ? (
                  <div
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-cyan-400" : "bg-slate-600"}`}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block truncate tracking-wide ${isSelected ? "text-cyan-400" : ""}`}
                    >
                      {symptom.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mt-0.5">
                      {symptom.category}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col bg-slate-50 dark:bg-black overflow-hidden">
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsRightPaneOpen(!isRightPaneOpen)}
            className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors shadow-sm"
            title="Toggle Metrics Pane"
          >
            {isRightPaneOpen ? (
              <PanelRightClose size={18} />
            ) : (
              <PanelRightOpen size={18} />
            )}
          </button>
        </div>

        {/* Subtle Background Image */}
        <div
          key={currentSymptom.id}
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-black via-slate-50/90 dark:via-black/90 to-slate-50/60 dark:to-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-black via-transparent to-slate-50/80 dark:to-black/80 z-10" />
          <img
            src={currentSymptom.bgImage}
            alt="background"
            className="w-full h-full object-cover opacity-[0.05] grayscale mix-blend-multiply dark:mix-blend-lighten"
          />
        </div>

        {/* Minimal Interface Layout */}
        <div className="relative z-20 flex flex-col xl:flex-row h-full w-full max-w-[1600px] mx-auto overflow-y-auto scrollbar-hide gap-12 px-8 lg:px-16 py-16 pb-32">
          {/* Main workspace (Left/Center) */}
          <div className="flex-1 flex flex-col gap-16 min-w-0 max-w-4xl">
            {/* Information Section - Editorial Style */}
            <div className="w-full flex flex-col justify-center space-y-12">
              <div className="flex flex-col gap-10">
                {diagnosticBlocks.map((block) => (
                  <article
                    key={block.symptomId}
                    className="prose prose-slate dark:prose-invert max-w-none"
                  >
                    <div className="flex flex-col mb-4">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${block.status === "Confirmed" ? "text-red-600" : block.status === "Suspected" ? "text-orange-600" : "text-emerald-600"}`}
                      >
                        {block.category} • {block.status} • Severity:{" "}
                        {block.severity}
                      </span>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0 flex items-center gap-4">
                        {block.label}
                        {block.symptomId !== 0 && (
                          <button
                            onClick={() => handleResetSymptom(block.symptomId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer not-prose"
                            title="Normalize Metrics"
                          >
                            <RotateCcw size={12} /> Revert
                          </button>
                        )}
                      </h2>
                    </div>

                    <p className="text-sm font-medium text-slate-500 italic flex items-center justify-between">
                      <span>
                        {block.abnormalCount === 0 
                          ? "All monitored systems are within homeostatic baseline parameters." 
                          : `${block.abnormalCount} of ${block.totalCount} physiological metrics indicate abnormal deviations.`
                        }
                      </span>
                      {block.totalCount > block.abnormalCount && (
                        <button 
                          onClick={() => setShowNormalReadings(!showNormalReadings)}
                          className="text-[10px] uppercase tracking-wider font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/40 px-2 py-1 rounded-md transition-all active:scale-95"
                        >
                          {showNormalReadings ? "Hide normal readings" : "Show normal readings too"}
                        </button>
                      )}
                    </p>
                    <GetActiveAbnormalMetrics 
                      symptomId={block.symptomId} 
                      symptoms={symptoms} 
                      metricValues={metricValues} 
                      showNormal={showNormalReadings}
                    />
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                      {block.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowDictionary(!showDictionary)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm ${showDictionary ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white" : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
                >
                  <Activity size={16} /> Dictionary
                </button>
              </div>
            </div>

            {/* Minimal Metrics Control Panel */}
            <div className="w-full mt-16 pb-8 border-t border-slate-200 dark:border-slate-800 pt-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold tracking-tight text-2xl flex items-center gap-3">
                    Physiological Controls
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    Manipulate active symptomatic metrics to observe diagnostic
                    state shifts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {activeMetrics.map((metric) => (
                  <MetricSlider
                    key={metric.label}
                    metric={metric}
                    value={metricValues[metric.label] ?? metric.value}
                    onChange={(val) =>
                      handleMetricChange(metric.label, val.toString())
                    }
                  />
                ))}
              </div>
            </div>

            {/* Embedded Symptoms Detail */}
            <SymptomDetailPane
              symptom={currentSymptom}
              onSelectSymptom={handleSymptomSelect}
            />

            {/* Global Metrics Dictionary */}
            {showDictionary && <AllMetricsList allMetrics={allMetrics} />}
          </div>
        </div>

        {/* Minimal Footer */}
        <div
          className={`absolute bottom-4 right-0 z-30 pointer-events-none flex justify-end px-6 transition-all duration-300 ${isSidebarCollapsed ? "left-16" : "left-72"}`}
        ></div>
      </main>

      {/* Metrics Config Side Panel */}
      <MetricsRightPane
        isOpen={isRightPaneOpen}
        allMetrics={allMetrics}
        currentMetrics={currentSymptom.metrics || []}
        onAddMetric={handleAddMetric}
      />

      {/* Rightmost Vertical Navbar container */}
      <div className="absolute top-16 right-2 z-[60] pointer-events-none">
        <div className="pointer-events-auto">{verticalNav}</div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #e2e8f0;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #ffffff;
        }
        input[type='range']::-webkit-slider-runnable-track {
          background: transparent;
        }
        input[type='range']::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};
