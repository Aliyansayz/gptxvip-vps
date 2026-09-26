import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LabData, ConceptCourse } from '../devLushTypes';
import { SearchIcon, PlayIcon } from '../../agentDevRootComponents/icons';
import { CourseIcon } from '../../agentDevRootComponents/CourseIcon';
import { RefreshCw, X } from 'lucide-react';
import { getThemeColorClass } from '../themeHelpers';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface SearchResult extends LabData {
    matchingTags: string[];
}

interface DevLushSearchViewProps {
    devLushTopics: EnrichedConceptData[];
    onStartChapter: (chapter: LabData) => void;
    onClose: () => void;
}

const KeywordMarquee: React.FC<{ keywords: string[]; direction: 'ltr' | 'rtl'; onKeywordClick: (keyword: string) => void }> = ({ keywords, direction, onKeywordClick }) => {
    const animationClass = direction === 'ltr' ? 'animate-slide-ltr' : 'animate-slide-rtl';
    const displayKeywords = keywords.length > 0 ? keywords : ['Loading...'];
    const allKeywords = [...displayKeywords, ...displayKeywords]; 

    return (
        <div className={`relative flex overflow-x-hidden group rounded-full border border-indigo-200 bg-indigo-50/50 dark:border-sky-800/50 dark:bg-sky-900/20`}>
            <div className={`flex w-max ${animationClass} group-hover:[animation-play-state:paused]`}>
                {allKeywords.map((keyword, index) => (
                    <button 
                        type="button"
                        key={`${direction}-${index}-${keyword}`} 
                        onClick={() => onKeywordClick(keyword)}
                        className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors text-sky-500 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-sky-800/50`}
                    >
                        {keyword}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const DevLushSearchView: React.FC<DevLushSearchViewProps> = ({ devLushTopics, onStartChapter, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const [inlineSuggestion, setInlineSuggestion] = useState('');
    const [dropdownSuggestions, setDropdownSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const titleText = 'Search DevLush';
    const descriptionText = 'Find agent workflows, autonomous simulations, and architectural models.';
    const placeholderText = "Search for 'cybersecurity', 'fraud', 'ecommerce', 'audit'...";
    
    const primaryColorClass = 'text-sky-500 dark:text-indigo-400';
    const bgIconClass = 'bg-indigo-100 dark:bg-sky-800/30';
    const ringClass = 'focus:ring-indigo-500';

    const searchDictionary = useMemo(() => {
        const phrases = new Set<string>();
        const addPhrase = (text: string | undefined) => {
            if (!text) return;
            const clean = text.trim().toLowerCase();
            if (clean.length > 2) phrases.add(clean);
            const words = clean.split(/[\s,.-]+/);
            if (words.length > 1) {
                words.forEach(w => {
                    if (w.length > 3) phrases.add(w);
                });
            }
        };

        devLushTopics.forEach(course => {
            addPhrase(course.title);
            course.chapters.forEach(chapter => {
                addPhrase(chapter.chapter_title);
                addPhrase(chapter.course);
                chapter.interactive_questions?.forEach(q => {
                    q.tags?.forEach(addPhrase);
                });
                chapter.critical_concepts?.forEach(c => {
                    addPhrase(c.concept);
                });
                chapter.tags?.forEach(addPhrase);
            });
        });
        return Array.from(phrases);
    }, [devLushTopics]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setInlineSuggestion('');
            setDropdownSuggestions([]);
            setSelectedIndex(-1);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        const prefixMatches = searchDictionary.filter(p => p.startsWith(term) && p !== term);
        const containsMatches = searchDictionary.filter(p => !p.startsWith(term) && p.includes(term));
        
        const allMatches = [...prefixMatches, ...containsMatches];
        
        if (prefixMatches.length > 0) {
            prefixMatches.sort((a, b) => a.length - b.length);
            const bestMatch = prefixMatches[0];
            setInlineSuggestion(searchTerm + bestMatch.slice(term.length));
        } else {
            setInlineSuggestion('');
        }

        if (allMatches.length > 0) {
            setDropdownSuggestions(allMatches.slice(0, 8));
        } else {
            setDropdownSuggestions([]);
        }
        setSelectedIndex(-1);
    }, [searchTerm, searchDictionary]);

    const handleClose = useCallback(() => {
        onClose();
        window.requestAnimationFrame(() => {
            document.querySelector<HTMLButtonElement>('[aria-label="Search Agent Labs topics"]')?.focus();
        });
    }, [onClose]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < dropdownSuggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
        } else if (e.key === 'Tab') {
            if (inlineSuggestion) {
                e.preventDefault();
                setSearchTerm(inlineSuggestion);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0) {
                setSearchTerm(dropdownSuggestions[selectedIndex]);
                setSelectedIndex(-1);
            } else if (inlineSuggestion) {
                setSearchTerm(inlineSuggestion);
            }
            setIsFocused(false);
            (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleClose();
        }
    };

    const generateRandomKeywords = useCallback(() => {
        const allWords = new Set<string>();
        
        devLushTopics.forEach(course => {
            course.chapters.forEach(chapter => {
                chapter.chapter_title?.split(' ').forEach(w => {
                    const cleanWord = w.replace(/[^a-zA-Z]/g, '');
                    if (cleanWord.length > 3) allWords.add(cleanWord);
                });
                
                chapter.interactive_questions?.forEach(q => {
                    q.tags?.forEach(t => allWords.add(t));
                });
                
                chapter.tags?.forEach(t => allWords.add(t));

                chapter.critical_concepts?.forEach(c => {
                    if (c.concept) allWords.add(c.concept);
                });
            });
        });

        const shuffled = Array.from(allWords)
            .filter(w => w && w.length > 2)
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
        
        setKeywords(shuffled);
    }, [devLushTopics]);

    useEffect(() => {
        if (devLushTopics.length > 0) {
            generateRandomKeywords();
        }
    }, [generateRandomKeywords, devLushTopics.length]);

    const handleRefreshKeywords = () => {
        setIsRefreshing(true);
        generateRandomKeywords();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const keywords1 = keywords.slice(0, Math.ceil(keywords.length / 2));
    const keywords2 = keywords.slice(Math.ceil(keywords.length / 2));

    const iconMap = useMemo(() => {
        const map: Record<string, React.ComponentType<any>> = {};
        devLushTopics.forEach(course => {
            map[course.title] = course.icon;
        });
        return map;
    }, [devLushTopics]);

    const allChapters = useMemo(() => {
        return devLushTopics.flatMap(course => course.chapters.map(c => ({ ...c })));
    }, [devLushTopics]);

    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const foundChapters = new Map<string, SearchResult>();

        allChapters.forEach(chapter => {
            const allMatchingTags = new Set<string>();
            if (chapter.chapter_title?.toLowerCase().includes(lowerCaseSearchTerm)) {
                allMatchingTags.add('Title Match');
            }
            if (chapter.course?.toLowerCase().includes(lowerCaseSearchTerm)) {
                allMatchingTags.add('Course Match');
            }

            chapter.interactive_questions?.forEach(exercise => {
                exercise.tags?.forEach(tag => {
                    if (tag.toLowerCase().includes(lowerCaseSearchTerm)) {
                        allMatchingTags.add(tag);
                    }
                });
                if (exercise.title?.toLowerCase().includes(lowerCaseSearchTerm) || 
                    exercise.prompt?.toLowerCase().includes(lowerCaseSearchTerm)) {
                        allMatchingTags.add('Content Match');
                }
            });

            chapter.tags?.forEach(tag => {
                if (tag.toLowerCase().includes(lowerCaseSearchTerm)) {
                    allMatchingTags.add(tag);
                }
            });

            chapter.critical_concepts?.forEach(c => {
                if (c.concept?.toLowerCase().includes(lowerCaseSearchTerm) || 
                    c.elaboration?.toLowerCase().includes(lowerCaseSearchTerm)) {
                        allMatchingTags.add(c.concept);
                }
            });

            if (allMatchingTags.size > 0) {
                if (!foundChapters.has(chapter.labComponentId)) {
                    foundChapters.set(chapter.labComponentId, {
                        ...chapter,
                        matchingTags: Array.from(allMatchingTags),
                    });
                } else {
                    const existing = foundChapters.get(chapter.labComponentId)!;
                    allMatchingTags.forEach(tag => existing.matchingTags.push(tag));
                    existing.matchingTags = [...new Set(existing.matchingTags)];
                }
            }
        });

        setResults(Array.from(foundChapters.values()));

    }, [searchTerm, allChapters]);

    return (
        <div role="search" aria-label="Agent Labs topic search" className="h-full w-full overflow-y-auto custom-scrollbar p-8 bg-slate-50 dark:bg-black relative">
            <button 
                type="button"
                onClick={handleClose}
                aria-label="Close topic search and return to topics"
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors z-50 text-slate-500"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl mx-auto pt-4">
                <header className="text-center mb-8">
                    <div className={`inline-block p-4 rounded-2xl shadow-sm mb-4 ${bgIconClass}`}>
                        <SearchIcon className={`w-12 h-12 ${primaryColorClass}`} />
                    </div>
                    <h1 className="text-6xl font-heading tracking-wide text-slate-900 dark:text-white">{titleText}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        {descriptionText}
                    </p>
                </header>

                <div className="relative mb-8 z-30">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-20" />
                        
                        <input
                            aria-label="Search Agent Labs topic labs"
                            aria-controls="agent-labs-topic-search-results"
                            type="text"
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder={placeholderText}
                            className={`w-full p-4 pl-12 pr-12 text-lg bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 ${ringClass} text-slate-900 dark:text-white relative z-10`}
                        />

                        {inlineSuggestion && isFocused && searchTerm && (
                            <div className="absolute inset-0 px-4 pl-12 pr-12 py-4 text-lg border-2 border-transparent pointer-events-none z-20 flex items-center overflow-hidden whitespace-nowrap">
                                <span className="text-transparent">{searchTerm}</span>
                                <span className="text-slate-400/50">{inlineSuggestion.slice(searchTerm.length)}</span>
                            </div>
                        )}
                    </div>

                    {isFocused && dropdownSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {dropdownSuggestions.map((s, idx) => (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    key={s} 
                                    className={`w-full px-6 py-3 text-left text-slate-900 dark:text-white flex items-center transition-colors ${idx === selectedIndex ? 'bg-indigo-50 dark:bg-sky-800/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    onClick={() => {
                                        setSearchTerm(s);
                                        setIsFocused(false);
                                        document.querySelector<HTMLInputElement>('[aria-label="Search Agent Labs topic labs"]')?.focus();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <SearchIcon className={`w-4 h-4 mr-3 ${idx === selectedIndex ? 'text-sky-500 dark:text-indigo-400' : 'text-slate-400'}`} />
                                    <span className="font-semibold">
                                        {s.toLowerCase().startsWith(searchTerm.toLowerCase()) ? (
                                            <>
                                                <span>{s.slice(0, searchTerm.length)}</span>
                                                <span className="text-slate-500 dark:text-slate-400 font-normal">{s.slice(searchTerm.length)}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-500 dark:text-slate-400 font-normal">{s}</span>
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="my-8">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suggested Topics</span>
                        <button 
                            type="button"
                            onClick={handleRefreshKeywords}
                            className={`p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                            title="Refresh Topics"
                        >
                            <RefreshCw className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <KeywordMarquee keywords={keywords1} direction="ltr" onKeywordClick={setSearchTerm} />
                        <KeywordMarquee keywords={keywords2} direction="rtl" onKeywordClick={setSearchTerm} />
                    </div>
                </div>

                <div id="agent-labs-topic-search-results" role="region" aria-label="Topic lab search results" className="space-y-6">
                    {searchTerm.trim().length >= 2 && results.length === 0 && (
                        <div role="status" aria-live="polite" className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400">No topic labs match “{searchTerm}”. Try a broader term or choose a suggested topic.</p>
                            <button type="button" onClick={() => setSearchTerm('')} className="mt-3 text-sm font-semibold text-sky-600 hover:underline dark:text-indigo-300">Clear search</button>
                        </div>
                    )}
                    {results.map(chapter => {
                        const theme = getThemeColorClass(chapter.course);
                        const SpecificIcon = iconMap[chapter.course];
                        const displayIcon = SpecificIcon ? <SpecificIcon className={`w-8 h-8 ${theme.text} mt-1`} /> : <CourseIcon course={chapter.course} className={`w-8 h-8 ${theme.text} mt-1`} />;
                        
                        return (
                        <div key={chapter.labComponentId} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all duration-300 hover:shadow-md ${theme.hoverBorder} relative group`}>
                             <div className="flex items-start gap-4 pl-2">
                                {displayIcon}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${theme.text}`}>{chapter.course}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}>
                                            Simulation
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-heading tracking-wider text-slate-900 dark:text-white mt-1">{chapter.chapter_title}</h3>
                                </div>
                             </div>
                            <div className="my-4 pl-12">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Matching Tags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {chapter.matchingTags.slice(0, 5).map(tag => (
                                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-full ${theme.bgSoft} ${theme.text} border ${theme.borderSoft}`}>{tag}</span>
                                    ))}
                                    {chapter.matchingTags.length > 5 && <span className="text-xs text-slate-500 dark:text-slate-400 self-center">...and {chapter.matchingTags.length - 5} more</span>}
                                </div>
                            </div>
                            <div className="pl-12">
                                <button 
                                    onClick={() => onStartChapter(chapter)} 
                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-shadow hover:shadow-lg bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`}
                                >
                                    <PlayIcon className="w-5 h-5" />
                                    Launch Agent Sandbox
                                </button>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
};
