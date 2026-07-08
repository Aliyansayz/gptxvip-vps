import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Syringe,
  Info,
  HeartPulse,
  Thermometer,
  Zap,
  ChevronDown,
  Plus,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SymptomsVisual } from "./SymptomsVisual";

interface TreatmentStep {
  title: string;
  desc: string;
}

interface SymptomDetailData {
  id: number;
  label: string;
  category: string;
  severity: string;
  description: string;
  causes: string;
  commonSigns: string[];
  emergency: string;
  complications: string;
  vital_signs: string;
  treatment: TreatmentStep[];
  visual_prompt: string;
  visuals_inspirations: string;
}

interface SymptomDetailTemplateProps {
  data: SymptomDetailData;
  onSelectSymptom?: (id: number) => void;
}

export const SymptomDetailTemplate: React.FC<SymptomDetailTemplateProps> = ({
  data,
  onSelectSymptom,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [symptomsList, setSymptomsList] = useState<{id: number, label: string}[]>([]);

  useEffect(() => {
    fetch('/symptoms.json')
      .then(res => res.text())
      .then(text => setSymptomsList(text ? JSON.parse(text) : []))
      .catch(err => console.error(err));
  }, []);

  const handleSymptomClick = (id: number) => {
    if (onSelectSymptom) {
      onSelectSymptom(id);
    }
    setShowDropdown(false);
  };

  return (
    <article className="font-sans max-w-3xl mx-auto py-12 md:py-20 w-full animate-fade-in pb-32">
      {/* Header section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase mb-4 text-slate-500 dark:text-slate-400">
          <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
            {data.category}
          </span>
          <span
            className={`${(data.severity || "").toLowerCase() === "critical" ? "text-red-500" : "text-emerald-500"}`}
          >
            {data.severity || "Normal"} Severity
          </span>
        </div>
        <div className="flex items-center gap-4 mb-6 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            {data.label}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors group focus:outline-none"
            >
              <ChevronDown
                size={24}
                className={`text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-12 left-0 w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-5 origin-top-left"
                >
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <List size={16} className="text-cyan-500" />
                    Available Symptoms
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {symptomsList.map((s) => (
                      <button 
                        key={s.id} 
                        onClick={() => handleSymptomClick(s.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${s.id === data.id ? 'bg-cyan-50 border-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-serif mb-12">
          {data.description}
        </p>
      </div>

      {/* Experimental Visualization Section */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-widest uppercase">
            Theoretical Visualization
          </h3>
        </div>
        <SymptomsVisual symptomId={data.id} />
      </div>

      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif leading-relaxed">
        {/* Vital Signs Banner */}
        <div className="not-prose flex flex-col sm:flex-row sm:items-center gap-4 py-6 px-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl mb-12 border border-slate-200 dark:border-slate-800 shadow-sm">
          <HeartPulse size={28} className="text-cyan-500 mb-2 sm:mb-0" />
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Baseline Vital Signs Parameters
            </span>
            <span className="text-sm md:text-base font-mono text-slate-800 dark:text-slate-200 font-medium">
              {data.vital_signs}
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-12 mb-6 font-sans">
          Pathophysiology
        </h2>
        <p>
          <strong>Primary Etiology:</strong> {data.causes}
        </p>
        <p>
          <strong>Potential Complications:</strong> {data.complications}
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-12 mb-6 font-sans">
          Clinical Presentation
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 not-prose list-none p-0 mt-6 mb-12">
          {data.commonSigns.map((sign, i) => (
            <li
              key={i}
              className="flex items-center gap-4 py-3 border-b border-slate-200 dark:border-slate-800/80"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
              <span className="text-slate-800 dark:text-slate-200 text-lg font-sans font-medium">
                {sign}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-12 mb-8 font-sans">
          Intervention Protocol
        </h2>
        <div className="space-y-8 not-prose mb-16">
          {data.treatment.map((step, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="flex gap-6"
            >
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
                {i + 1}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-sans">
                  {step.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-serif">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-2xl not-prose shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle
              size={24}
              className="text-red-600 dark:text-red-400"
            />
            <h3 className="font-bold tracking-wider text-red-800 dark:text-red-300 text-sm uppercase">
              Emergency Threshold
            </h3>
          </div>
          <p className="text-red-800 dark:text-red-200/90 text-lg font-serif leading-relaxed">
            {data.emergency}
          </p>
        </div>
      </div>
    </article>
  );
};
