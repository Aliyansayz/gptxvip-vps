import React, { useState, useEffect } from "react";
import { BookOpen, Activity, Loader2, Search, X } from "lucide-react";
import { TermDefinition } from "../types";
import { TermCard } from "../finhub/glossaryTerms/TermCard";

type SectionType = "dictionary" | "volatility";

interface SectionData {
  header: { title: string; description: string };
  terms: TermDefinition[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSectionData = (value: unknown): value is SectionData => {
  if (!isRecord(value) || !isRecord(value.header) ||
      typeof value.header.title !== "string" || typeof value.header.description !== "string" ||
      !Array.isArray(value.terms)) return false;

  const termIds = new Set<string>();
  for (const term of value.terms) {
    if (!isRecord(term) || typeof term.id !== "string" || term.id.length === 0 || termIds.has(term.id) ||
        typeof term.term !== "string" || typeof term.definition !== "string" ||
        (term.subheading !== undefined && typeof term.subheading !== "string") ||
        (term.example !== undefined && typeof term.example !== "string") ||
        (term.points !== undefined && (!Array.isArray(term.points) || !term.points.every((point) => typeof point === "string"))) ||
        (term.visualContext !== undefined && (!isRecord(term.visualContext) ||
          typeof term.visualContext.type !== "string" || typeof term.visualContext.prompt !== "string" ||
          typeof term.visualContext.description !== "string"))) return false;
    termIds.add(term.id);
  }
  return true;
};

export const KeyTermsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("dictionary");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [dictionaryData, setDictionaryData] = useState<SectionData>({
    header: { title: "", description: "" },
    terms: []
  });

  const [volatilityData, setVolatilityData] = useState<SectionData>({
    header: { title: "", description: "" },
    terms: []
  });

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(false);
    const readSection = async (url: string): Promise<SectionData> => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Key terms request failed (${response.status})`);
      const data: unknown = await response.json();
      if (!isSectionData(data)) throw new Error("Key terms data has an invalid shape");
      return data;
    };
    Promise.all([
      readSection('/key-terms-dictionary.json'),
      readSection('/key-terms-volatility.json')
    ])
      .then(([dictData, volData]) => {
        if (cancelled) return;
        setDictionaryData(dictData);
        setVolatilityData(volData);
      })
      .catch(err => {
        console.error("Error loading terms:", err);
        if (!cancelled) setLoadError(true);
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const activeData = activeSection === "dictionary" ? dictionaryData : volatilityData;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredTerms = normalizedQuery
    ? activeData.terms.filter((term) => [
        term.term,
        term.subheading,
        term.definition,
        term.example,
        ...(term.points || []),
      ].filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedQuery))
    : activeData.terms;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
        <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Loading Key Terms...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="mx-auto flex min-h-[300px] max-w-xl flex-col items-center justify-center gap-3 text-center">
        <p className="font-semibold text-zinc-800 dark:text-zinc-100">Key terms could not be loaded.</p>
        <p className="text-sm text-zinc-500">Check the connection, then retry.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Section Toggle Pill Menu */}
      <div className="flex justify-center mb-8">
        <div role="group" aria-label="Key terms section" className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            aria-pressed={activeSection === "dictionary"}
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
            type="button"
            aria-pressed={activeSection === "volatility"}
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

      <div id="terms-list" className="space-y-8">
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

        {activeData.terms.length > 0 && (
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            <label htmlFor="key-terms-search" className="sr-only">Find a term in {activeData.header.title || "Key Terms"}</label>
            <input
              id="key-terms-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search terms, definitions, and examples"
              aria-controls="terms-list"
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:hover:bg-zinc-800" aria-label="Clear term search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {activeData.terms.length === 0 ? (
          <p role="status" className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">No terms are available in this section yet.</p>
        ) : filteredTerms.length === 0 ? (
          <div role="status" className="rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">No terms match “{query.trim()}”.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950/30">Clear search</button>
          </div>
        ) : <div className="space-y-12">
          <p role="status" aria-live="polite" className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing {filteredTerms.length} of {activeData.terms.length} terms
          </p>
          {filteredTerms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>}
      </div>
    </div>
  );
};
