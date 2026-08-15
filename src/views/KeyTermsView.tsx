import React, { useState, useEffect } from "react";
import { BookOpen, Activity, Loader2 } from "lucide-react";
import { TermDefinition } from "../types";
import { TermCard } from "../finhub/glossaryTerms/TermCard";

type SectionType = "dictionary" | "volatility";

interface SectionData {
  header: { title: string; description: string };
  terms: TermDefinition[];
}

export const KeyTermsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("dictionary");
  const [isLoading, setIsLoading] = useState(true);

  const [dictionaryData, setDictionaryData] = useState<SectionData>({
    header: { title: "", description: "" },
    terms: []
  });

  const [volatilityData, setVolatilityData] = useState<SectionData>({
    header: { title: "", description: "" },
    terms: []
  });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/key-terms-dictionary.json').then(res => res.json()),
      fetch('/key-terms-volatility.json').then(res => res.json())
    ])
      .then(([dictData, volData]) => {
        setDictionaryData({
          header: dictData.header || { title: "", description: "" },
          terms: dictData.terms || []
        });
        setVolatilityData({
          header: volData.header || { title: "", description: "" },
          terms: volData.terms || []
        });
      })
      .catch(err => console.error("Error loading terms:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const activeData = activeSection === "dictionary" ? dictionaryData : volatilityData;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
        <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Loading Key Terms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Section Toggle Pill Menu */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveSection("dictionary")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeSection === "dictionary"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            General Dictionary
          </button>
          <button
            onClick={() => setActiveSection("volatility")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeSection === "volatility"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Activity className="w-4 h-4" />
            Volatility Matrix
          </button>
        </div>
      </div>

      <div id="terms-list">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            {activeSection === "dictionary" ? (
              <BookOpen className="w-6 h-6" />
            ) : (
              <Activity className="w-6 h-6" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 m-0 transition-opacity duration-300">
              {activeData.header.title || "Key Terms"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 transition-opacity duration-300">
              {activeData.header.description}
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {activeData.terms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>
      </div>
    </div>
  );
};
