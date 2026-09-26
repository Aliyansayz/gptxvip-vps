import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, BookOpen, X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CODE_CONCEPT_CATEGORIES } from '../../../constants/codeConcepts';
import { InteractiveQuestion } from '../../../types';
import { FavoriteButton } from '../addtoFavorites/FavoriteButton';
import { CONCEPT_DATA_FILES } from '../courseDataFiles';

interface SearchConceptsViewProps {
  onSelectTopic: (categoryId: string) => void;
  onSelectConcept?: (categoryId: string, concept: InteractiveQuestion) => void;
  onExitSearch?: () => void;
}

interface SearchResult {
  categoryId: string;
  course: string;
  chapterTitle: string;
  activity: InteractiveQuestion;
}

interface LoadedCourseData {
  categoryId: string;
  course: string;
  chapter_title: string;
  tags: string[];
  interactive_questions: InteractiveQuestion[];
}

const SEARCH_CATEGORY_IDS = CODE_CONCEPT_CATEGORIES.filter((category) => category.id !== 'search').map((category) => category.id);
const TOTAL_SEARCH_DATA_FILES = SEARCH_CATEGORY_IDS.reduce(
  (count, categoryId) => count + (CONCEPT_DATA_FILES[categoryId]?.length ?? 0),
  0,
);

export const SearchConceptsView: React.FC<SearchConceptsViewProps> = ({ onSelectTopic, onSelectConcept, onExitSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [failedFileCount, setFailedFileCount] = useState(0);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const focusTimeout = window.setTimeout(() => inputRef.current?.focus(), 100);
    
    const fetchAllData = async () => {
      setIsLoading(true);
      const outcomes = await Promise.all(SEARCH_CATEGORY_IDS.map(async (categoryId) => {
        const files = CONCEPT_DATA_FILES[categoryId] || [];
        const fileResults = await Promise.all(files.map(async (fileName): Promise<Record<string, unknown> | null> => {
          try {
            const response = await fetch(`/code_concepts/${categoryId}/${fileName}`);
            if (!response.ok) throw new Error(`Request failed (${response.status})`);
            const json: unknown = await response.json();
            if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('Invalid course data');
            const payload = json as Record<string, unknown>;
            if (!Array.isArray(payload.interactive_questions)) throw new Error('Invalid course data');
            return payload;
          } catch {
            return null;
          }
        }));
        const loadedFiles = fileResults.filter((payload): payload is Record<string, unknown> => payload !== null);
        const merged: LoadedCourseData = {
          categoryId,
          course: '',
          chapter_title: '',
          tags: [],
          interactive_questions: [],
        };
        loadedFiles.forEach((payload) => {
          merged.course ||= typeof payload.course === 'string' ? payload.course : '';
          merged.chapter_title ||= typeof payload.chapter_title === 'string' ? payload.chapter_title : '';
          if (Array.isArray(payload.tags)) {
            merged.tags.push(...payload.tags.filter((tag): tag is string => typeof tag === 'string'));
          }
          const questions = (payload.interactive_questions as unknown[]).filter((question): question is InteractiveQuestion =>
            !!question && typeof question === 'object' &&
            typeof (question as InteractiveQuestion).componentId === 'string' &&
            typeof (question as InteractiveQuestion).type === 'string')
            .map((question) => ({
              ...question,
              title: typeof question.title === 'string' ? question.title : '',
              concept_tested: typeof question.concept_tested === 'string' ? question.concept_tested : '',
              prompt: typeof question.prompt === 'string' ? question.prompt : undefined,
              question: typeof question.question === 'string' ? question.question : undefined,
              difficulty: typeof question.difficulty === 'string' ? question.difficulty : 'basic',
            }));
          merged.interactive_questions.push(...questions);
        });
        return { data: loadedFiles.length ? merged : null, failedFiles: files.length - loadedFiles.length };
      }));
      const data = outcomes.flatMap((outcome) => outcome.data ? [outcome.data] : []);
      const failedCount = outcomes.reduce((count, outcome) => count + outcome.failedFiles, 0);
      const tagsSet = new Set<string>();
      data.forEach(d => {
        if (Array.isArray(d.tags)) {
          d.tags.forEach((t: string) => tagsSet.add(t));
        }
      });
      if (!cancelled) {
        setAllTags(Array.from(tagsSet));
        setAllData(data);
        setFailedFileCount(failedCount);
        setIsLoading(false);
      }
    };

    fetchAllData();
    return () => {
      cancelled = true;
      window.clearTimeout(focusTimeout);
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setAutocompleteSuggestion('');
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedResults: SearchResult[] = [];
    let possibleCompletions: string[] = [];

    allData.forEach(data => {
      // Collect tags for autocomplete
      if (Array.isArray(data.tags)) {
        data.tags.forEach((tag: string) => {
          if (tag.toLowerCase().startsWith(query)) {
            possibleCompletions.push(tag.toLowerCase());
          }
        });
      }

      if (data.interactive_questions) {
        data.interactive_questions.forEach((q: InteractiveQuestion) => {
          const qTitle = (q.title || '').toLowerCase();
          const qConcept = (q.concept_tested || '').toLowerCase();
          const qPrompt = (q.prompt || q.question || '').toLowerCase();

          if (qTitle.startsWith(query) || qConcept.startsWith(query)) {
            possibleCompletions.push(qTitle.startsWith(query) ? qTitle : qConcept);
          }

          if (
            qTitle.includes(query) ||
            qConcept.includes(query) ||
            qPrompt.includes(query) ||
            (Array.isArray(data.tags) && data.tags.some((tag: string) => tag.toLowerCase().includes(query)))
          ) {
            matchedResults.push({
              categoryId: data.categoryId,
              course: data.course,
              chapterTitle: data.chapter_title,
              activity: q
            });
          }
        });
      }
    });

    if (possibleCompletions.length > 0) {
      const bestMatch = possibleCompletions.sort((a, b) => a.length - b.length)[0];
      if (bestMatch.startsWith(query) && bestMatch !== query) {
        setAutocompleteSuggestion(searchQuery + bestMatch.slice(query.length));
      } else {
        setAutocompleteSuggestion('');
      }
    } else {
      setAutocompleteSuggestion('');
    }

    setResults(matchedResults);
  }, [searchQuery, allData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && autocompleteSuggestion) {
      e.preventDefault();
      setSearchQuery(autocompleteSuggestion);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[70vh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden px-4 py-5 md:px-12 md:py-8 relative">
        {onExitSearch && (
          <button 
            type="button"
            onClick={onExitSearch}
            aria-label="Return from Code Concepts search"
            title="Return to the previous learning view"
            className="absolute top-6 right-6 z-10 p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium pr-1 hidden sm:inline">Exit</span>
          </button>
        )}
        <div className="max-w-4xl w-full mx-auto pb-28 md:pb-20 mt-1 md:mt-12 flex flex-col h-full">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex p-3 md:p-4 rounded-2xl shadow-sm mb-3 md:mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Search className="w-7 h-7 md:w-12 md:h-12" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 m-0">
                Search Code Concepts
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 md:mt-3 text-sm md:text-lg">
                Instantly find interactive activities and snippets across all modules.
            </p>
          </div>

          <div className="relative mb-8 shadow-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-6 w-6 text-zinc-400" />
            </div>
            {/* Background container for autocomplete suggestion */}
            <div className="absolute inset-0 pl-12 pr-12 py-4 flex items-center pointer-events-none overflow-hidden rounded-xl border border-transparent">
              <span className="text-lg font-mono opacity-0">{searchQuery}</span>
              {autocompleteSuggestion && searchQuery && (
                <span className="text-lg text-emerald-500/40 select-none -ml-[1px]">
                  {autocompleteSuggestion.slice(searchQuery.length)}
                </span>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              aria-label="Search code concepts"
              className="block w-full pl-11 pr-12 py-3.5 md:py-4 bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-base md:text-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow relative z-0 bg-transparent font-medium"
              placeholder="Search concepts, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
              </div>
            )}
            {autocompleteSuggestion && (
              <div className="absolute top-full left-0 mt-2 text-xs text-zinc-400 flex items-center gap-1">
                Press <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-[10px]">Tab</kbd> to autocomplete
              </div>
            )}
          </div>

          {failedFileCount > 0 && (
            <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <span>
                {failedFileCount === TOTAL_SEARCH_DATA_FILES
                  ? "Search data could not be loaded."
                  : `${failedFileCount} curriculum file${failedFileCount === 1 ? "" : "s"} could not be loaded, so results may be incomplete.`}
              </span>
              <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} disabled={isLoading} className="rounded-lg border border-current/30 px-3 py-1.5 font-bold disabled:opacity-50">
                {isLoading ? "Retrying…" : "Retry"}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
            {!searchQuery.trim() && (
              <div className="py-12 flex flex-col items-center">
                <div className="text-center text-zinc-500 mb-8">
                  <BookOpen className="w-12 h-12 mb-4 opacity-20 mx-auto" />
                  <p>Start typing to search activities</p>
                </div>
                <KeywordStreamlines keywords={allTags} onSelect={setSearchQuery} />
              </div>
            )}

            {searchQuery.trim() && results.length === 0 && !isLoading && (
              <div className="py-20 text-center text-zinc-500">
                <p className="text-xl">
                  {failedFileCount > 0 && failedFileCount < TOTAL_SEARCH_DATA_FILES
                    ? `No results found in the course data that loaded for "${searchQuery}".`
                    : failedFileCount === 0
                    ? `No results found for "${searchQuery}".`
                    : "Search results are unavailable until course data loads."}
                </p>
              </div>
            )}

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-20">
                {results.map((result, index) => (
                  <article
                    key={`${result.categoryId}-${result.activity.componentId}-${index}`}
                    className="relative flex flex-col rounded-xl border border-zinc-200 bg-white transition-all hover:border-emerald-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 group"
                  >
                    <button
                      type="button"
                      aria-label={`Open lesson: ${result.activity.title || result.activity.concept_tested || "Code concept"}`}
                      onClick={() => onSelectConcept
                        ? onSelectConcept(result.categoryId, result.activity)
                        : onSelectTopic(result.categoryId)}
                      className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                    />
                    <div className="pointer-events-none relative z-10 flex flex-col p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          result.activity.difficulty === 'advanced' ? 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400' :
                          result.activity.difficulty === 'intermediate' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {result.activity.difficulty || "basic"}
                        </span>
                        <span className="pr-9 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                          {(result.activity.type || "activity").replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="mb-1 mt-2 text-lg font-bold text-zinc-900 transition-colors group-hover:text-emerald-500 dark:text-zinc-100">
                        {result.activity.title || result.activity.concept_tested || "Untitled lesson"}
                      </h4>
                      <p className="mb-4 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {result.activity.concept_tested || "Code concept"} — {result.activity.prompt || result.activity.question || "Interactive testing"}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                        <span className="text-[11px] font-mono font-medium text-zinc-500">// {result.course || "Course"} • {result.chapterTitle || "Lessons"}</span>
                        <ArrowRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-zinc-600" />
                      </div>
                    </div>
                    <div className="absolute right-4 top-4 z-20">
                      <FavoriteButton concept={result.activity} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

const KeywordStreamlines = ({ keywords, onSelect }: { keywords: string[], onSelect: (w: string) => void }) => {
  // We want to ensure we have enough keywords to fill the screen nicely without looking too empty.
  const displayKeywords = keywords.length > 5 ? keywords : [...keywords, 'HFT', 'C++', 'Algorithms', 'Networking', 'Quant', 'Python'].slice(0, 8);
  const lowerKeywords = ['Arbitrage', 'Liquidity', 'Order Book', 'Execution', 'Slippage', 'Market Making', 'Backtesting', 'Alpha'];
  
  return (
    <div className="relative w-full overflow-hidden py-12" style={{ perspective: '2000px' }}>
      <style>{`
        .aperture-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 40px;
            align-items: center;
            overflow: visible;
            mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            transform-style: preserve-3d;
        }

        .ribbon-track {
            display: flex;
            width: max-content;
            min-width: 100%;
            height: 60px;
            align-items: center;
            backdrop-filter: blur(12px);
            transform-style: preserve-3d;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
        }

        .track-ltr {
            background: linear-gradient(90deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.05));
            border-top: 2px solid transparent;
            border-bottom: 2px solid transparent;
            border-image: linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981) 1;
            animation: twistLTR 8s ease-in-out infinite;
        }

        .track-rtl {
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.05), rgba(16, 185, 129, 0.05));
            border-top: 2px solid transparent;
            border-bottom: 2px solid transparent;
            border-image: linear-gradient(90deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6) 1;
            animation: twistRTL 8s ease-in-out infinite;
        }

        .aperture-container:hover .ribbon-track {
            background: rgba(16, 185, 129, 0.1);
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
        }

        .aperture-container:hover .keyword-text {
            color: #10b981;
        }

        @keyframes twistRTL {
            0%, 100% { transform: rotateX(10deg) skewY(1deg); }
            50% { transform: rotateX(-15deg) skewY(-1deg) scaleY(0.9); }
        }

        @keyframes twistLTR {
            0%, 100% { transform: rotateX(-10deg) skewY(-1deg); }
            50% { transform: rotateX(15deg) skewY(1deg) scaleY(0.9); }
        }

        .track-scroller {
            display: flex;
            width: max-content;
            height: 100%;
            align-items: center;
        }

        .scroller-ltr {
            animation: flowLTR 90s linear infinite;
        }

        .scroller-rtl {
            animation: flowRTL 90s linear infinite;
        }

        @keyframes flowRTL {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        @keyframes flowLTR {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }

        .stream-segment {
            display: flex;
            align-items: center;
            padding: 0 50px;
            white-space: nowrap;
            transform-style: preserve-3d;
        }

        .scroller-ltr .stream-segment {
            animation: surgeLTR 4s ease-in-out infinite;
        }

        .scroller-rtl .stream-segment {
            animation: surgeRTL 4s ease-in-out infinite;
        }

        @keyframes surgeLTR {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
        }

        @keyframes surgeRTL {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-20px); }
        }

        .keyword-text {
            color: currentColor;
            font-size: 1.25rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.5;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-block;
            cursor: pointer;
        }

        .stream-segment:hover .keyword-text {
            opacity: 1;
            transform: scale(1.15) translateZ(20px);
            color: #10b981;
            text-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
        }
      `}</style>
      
      <div className="aperture-container text-zinc-800 dark:text-zinc-200">
        <div className="ribbon-track track-ltr">
            <div className="track-scroller scroller-ltr">
                {displayKeywords.map((word, i) => (
                    <div key={`ltr1-${i}`} className="stream-segment" style={{ animationDelay: `${i * 0.5}s` }}>
                        <span className="keyword-text" onClick={() => onSelect(word)}>{word}</span>
                    </div>
                ))}
                {displayKeywords.map((word, i) => (
                    <div key={`ltr2-${i}`} className="stream-segment" style={{ animationDelay: `${(i + displayKeywords.length) * 0.5}s` }}>
                        <span className="keyword-text" onClick={() => onSelect(word)}>{word}</span>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="ribbon-track track-rtl">
            <div className="track-scroller scroller-rtl">
                {lowerKeywords.map((word, i) => (
                    <div key={`rtl1-${i}`} className="stream-segment" style={{ animationDelay: `${i * 0.5}s` }}>
                        <span className="keyword-text" onClick={() => onSelect(word)}>{word}</span>
                    </div>
                ))}
                {lowerKeywords.map((word, i) => (
                    <div key={`rtl2-${i}`} className="stream-segment" style={{ animationDelay: `${(i + lowerKeywords.length) * 0.5}s` }}>
                        <span className="keyword-text" onClick={() => onSelect(word)}>{word}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
