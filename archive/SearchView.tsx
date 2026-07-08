
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LabData, ConceptCourse } from '../types';
import { SearchIcon, PlayIcon } from './icons';
import { CourseIcon } from './CourseIcon';
import { RefreshCw } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface SearchResult extends LabData {
    matchingTags: string[];
    sourceType: 'lab' | 'medlab';
}

interface SearchViewProps {
    bioLabs: EnrichedConceptData[];
    medLabs: EnrichedConceptData[];
    onStartChapter: (chapter: LabData, type: 'lab' | 'medlab') => void;
    variant?: 'bio' | 'med';
}

const KeywordMarquee: React.FC<{ keywords: string[]; direction: 'ltr' | 'rtl'; onKeywordClick: (keyword: string) => void; isMed?: boolean }> = ({ keywords, direction, onKeywordClick, isMed }) => {
    const animationClass = direction === 'ltr' ? 'animate-slide-ltr' : 'animate-slide-rtl';
    // Ensure we have enough keywords to scroll smoothly
    const displayKeywords = keywords.length > 0 ? keywords : ['Loading...'];
    const allKeywords = [...displayKeywords, ...displayKeywords]; // Duplicate for seamless loop

    return (
        <div className={`relative flex overflow-x-hidden group rounded-full border ${isMed ? 'border-cyan-100 bg-cyan-50/50 dark:border-cyan-900/50 dark:bg-cyan-950/20' : 'border-border bg-muted/30'}`}>
            <div className={`flex w-max ${animationClass} group-hover:[animation-play-state:paused]`}>
                {allKeywords.map((keyword, index) => (
                    <button 
                        key={`${direction}-${index}-${keyword}`} 
                        onClick={() => onKeywordClick(keyword)}
                        className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors ${
                            isMed 
                            ? 'text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50' 
                            : 'text-muted-foreground hover:text-primary hover:bg-background'
                        }`}
                    >
                        {keyword}
                    </button>
                ))}
            </div>
        </div>
    );
};


export const SearchView: React.FC<SearchViewProps> = ({ bioLabs, medLabs, onStartChapter, variant = 'bio' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const [inlineSuggestion, setInlineSuggestion] = useState('');
    const [dropdownSuggestions, setDropdownSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const isMed = variant === 'med';
    const titleText = isMed ? 'Search MedLabs' : 'Search BioLabs';
    const descriptionText = isMed 
        ? 'Find clinical simulations, cases, and medical topics.' 
        : 'Find biology labs, concepts, and interactive exercises.';
    const placeholderText = isMed 
        ? "Search for 'ECG', 'diagnosis', 'diabetes', 'arrhythmia'..." 
        : "Search for 'mitochondria', 'osmosis', 'genetics', 'photosynthesis'...";
    
    const primaryColorClass = isMed ? 'text-cyan-600 dark:text-cyan-400' : 'text-primary';
    const bgIconClass = isMed ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-card';
    const ringClass = isMed ? 'focus:ring-cyan-500' : 'focus:ring-primary';

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

        const sourceData = isMed ? medLabs : bioLabs;
        
        sourceData.forEach(course => {
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
            });
        });
        return Array.from(phrases);
    }, [bioLabs, medLabs, isMed]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setInlineSuggestion('');
            setDropdownSuggestions([]);
            setSelectedIndex(-1);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        // Priority 1: Prefix matches (for inline suggestion)
        const prefixMatches = searchDictionary.filter(p => p.startsWith(term) && p !== term);
        // Priority 2: Contains matches (for dropdown)
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
            setIsFocused(false);
            (e.target as HTMLInputElement).blur();
        }
    };

    // Generate random keywords from the data
    const generateRandomKeywords = useCallback(() => {
        const sourceData = isMed ? medLabs : bioLabs;
        const allWords = new Set<string>();
        
        sourceData.forEach(course => {
            course.chapters.forEach(chapter => {
                // Add title words (filtering out common small words)
                chapter.chapter_title?.split(' ').forEach(w => {
                    const cleanWord = w.replace(/[^a-zA-Z]/g, '');
                    if (cleanWord.length > 3) allWords.add(cleanWord);
                });
                
                // Add tags
                chapter.interactive_questions?.forEach(q => {
                    q.tags?.forEach(t => allWords.add(t));
                });

                // Add concepts
                chapter.critical_concepts?.forEach(c => {
                    if (c.concept) allWords.add(c.concept);
                });
            });
        });

        // Convert to array, shuffle, and take top 20
        const shuffled = Array.from(allWords)
            .filter(w => w && w.length > 2)
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
        
        setKeywords(shuffled);
    }, [isMed, medLabs, bioLabs]);

    // Initial generation
    useEffect(() => {
        if ((isMed ? medLabs : bioLabs).length > 0) {
            generateRandomKeywords();
        }
    }, [generateRandomKeywords, isMed, medLabs.length, bioLabs.length]);

    const handleRefreshKeywords = () => {
        setIsRefreshing(true);
        generateRandomKeywords();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const keywords1 = keywords.slice(0, Math.ceil(keywords.length / 2));
    const keywords2 = keywords.slice(Math.ceil(keywords.length / 2));

    // Create a map of course titles to their specific icons from the enriched data
    const iconMap = useMemo(() => {
        const map: Record<string, React.ComponentType<any>> = {};
        [...bioLabs, ...medLabs].forEach(course => {
            map[course.title] = course.icon;
        });
        return map;
    }, [bioLabs, medLabs]);

    const allChapters = useMemo(() => {
        if (variant === 'med') {
            return medLabs.flatMap(course => course.chapters.map(c => ({ ...c, sourceType: 'medlab' as const })));
        }
        if (variant === 'bio') {
            return bioLabs.flatMap(course => course.chapters.map(c => ({ ...c, sourceType: 'lab' as const })));
        }
        const bio = bioLabs.flatMap(course => course.chapters.map(c => ({ ...c, sourceType: 'lab' as const })));
        const med = medLabs.flatMap(course => course.chapters.map(c => ({ ...c, sourceType: 'medlab' as const })));
        return [...bio, ...med];
    }, [bioLabs, medLabs, variant]);

    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const foundChapters = new Map<string, SearchResult>();

        allChapters.forEach(chapter => {
            const allMatchingTags = new Set<string>();
            // Search in chapter title
            if (chapter.chapter_title?.toLowerCase().includes(lowerCaseSearchTerm)) {
                allMatchingTags.add('Title Match');
            }
            // Search in course name
            if (chapter.course?.toLowerCase().includes(lowerCaseSearchTerm)) {
                allMatchingTags.add('Course Match');
            }

                // Search in interactive questions
                chapter.interactive_questions?.forEach(exercise => {
                    exercise.tags?.forEach(tag => {
                        if (tag.toLowerCase().includes(lowerCaseSearchTerm)) {
                            allMatchingTags.add(tag);
                        }
                    });
                    // Search in exercise text
                    if (exercise.title?.toLowerCase().includes(lowerCaseSearchTerm) || 
                        exercise.prompt?.toLowerCase().includes(lowerCaseSearchTerm)) {
                            allMatchingTags.add('Content Match');
                    }

                    // Search in clinical application and real life analogies
                    if (exercise.theory?.application?.toLowerCase().includes(lowerCaseSearchTerm)) {
                        allMatchingTags.add('Clinical Application');
                    }
                    if (exercise.theory?.analogy?.toLowerCase().includes(lowerCaseSearchTerm)) {
                        allMatchingTags.add('Real-life Analogy');
                    }
                });

            // Search in critical concepts
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
                        sourceType: chapter.sourceType
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
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <div className={`inline-block p-4 rounded-2xl shadow-sm mb-4 ${bgIconClass}`}>
                        <SearchIcon className={`w-12 h-12 ${primaryColorClass}`} />
                    </div>
                    <h1 className="text-6xl font-heading tracking-wide text-foreground">{titleText}</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        {descriptionText}
                    </p>
                </header>

                <div className="relative mb-8 z-30">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-20" />
                        
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder={placeholderText}
                            className={`w-full p-4 pl-12 pr-32 text-lg bg-card border-2 border-border rounded-full focus:outline-none focus:ring-2 ${ringClass} relative z-10`}
                        />

                        {/* Ghost Text Overlay */}
                        {inlineSuggestion && isFocused && searchTerm && (
                            <div className="absolute inset-0 px-4 pl-12 pr-32 py-4 text-lg border-2 border-transparent pointer-events-none z-20 flex items-center overflow-hidden whitespace-nowrap">
                                <span className="text-transparent">{searchTerm}</span>
                                <span className="text-muted-foreground/50">{inlineSuggestion.slice(searchTerm.length)}</span>
                            </div>
                        )}

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border shadow-sm ${isMed ? 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300' : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300'}`}>
                                {isMed ? 'MedLabs Only' : 'BioLabs Only'}
                            </div>
                        </div>
                    </div>

                    {/* Dropdown */}
                    {isFocused && dropdownSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {dropdownSuggestions.map((s, idx) => (
                                <div 
                                    key={s} 
                                    className={`px-6 py-3 cursor-pointer text-foreground flex items-center transition-colors ${idx === selectedIndex ? 'bg-cyan-100 dark:bg-cyan-900/40' : 'hover:bg-muted'}`}
                                    onClick={() => {
                                        setSearchTerm(s);
                                        setIsFocused(false);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <SearchIcon className={`w-4 h-4 mr-3 ${idx === selectedIndex ? 'text-cyan-600 dark:text-cyan-400' : 'text-muted-foreground/50'}`} />
                                    <span className="font-semibold">
                                        {s.toLowerCase().startsWith(searchTerm.toLowerCase()) ? (
                                            <>
                                                <span>{s.slice(0, searchTerm.length)}</span>
                                                <span className="text-muted-foreground font-normal">{s.slice(searchTerm.length)}</span>
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground font-normal">{s}</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="my-8">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Topics</span>
                        <button 
                            onClick={handleRefreshKeywords}
                            className={`p-1.5 rounded-full hover:bg-muted transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                            title="Refresh Topics"
                        >
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <KeywordMarquee keywords={keywords1} direction="ltr" onKeywordClick={setSearchTerm} isMed={isMed} />
                        <KeywordMarquee keywords={keywords2} direction="rtl" onKeywordClick={setSearchTerm} isMed={isMed} />
                    </div>
                </div>

                <div className="space-y-6">
                    {searchTerm.trim().length >= 2 && results.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No labs found matching your search.</p>
                        </div>
                    )}
                    {results.map(chapter => {
                        // Resolve the correct icon component
                        const SpecificIcon = iconMap[chapter.course];
                        const displayIcon = SpecificIcon ? <SpecificIcon className={`w-8 h-8 ${primaryColorClass} mt-1`} /> : <CourseIcon course={chapter.course} className={`w-8 h-8 ${primaryColorClass} mt-1`} />;
                        
                        return (
                        <div key={chapter.labComponentId} className={`bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-md ${isMed ? 'hover:border-cyan-500/30' : 'hover:border-primary/30'} relative group`}>
                             <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <FavoriteButton 
                                    id={chapter.labComponentId}
                                    type={chapter.sourceType === 'medlab' ? 'medlab' : 'lab'}
                                    title={chapter.chapter_title}
                                    courseId={chapter.course}
                                />
                             </div>
                             <div className="flex items-start gap-4 pl-8">
                                {displayIcon}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${primaryColorClass}`}>{chapter.course}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${chapter.sourceType === 'medlab' ? 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300' : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300'}`}>
                                            {chapter.sourceType === 'medlab' ? 'MedLab' : 'BioLab'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-heading tracking-wider text-card-foreground mt-1">{chapter.chapter_title}</h3>
                                </div>
                             </div>
                            <div className="my-4 pl-12">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Matching Tags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {chapter.matchingTags.slice(0, 5).map(tag => (
                                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-full ${isMed ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' : 'bg-primary/10 text-primary'}`}>{tag}</span>
                                    ))}
                                    {chapter.matchingTags.length > 5 && <span className="text-xs text-muted-foreground self-center">...and {chapter.matchingTags.length - 5} more</span>}
                                </div>
                            </div>
                            <div className="pl-12">
                                <button 
                                    onClick={() => onStartChapter(chapter, chapter.sourceType)} 
                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-primary-foreground shadow-md transition-shadow hover:shadow-lg ${chapter.sourceType === 'medlab' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500' : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500'}`}
                                >
                                    <PlayIcon className="w-5 h-5" />
                                    Start {chapter.sourceType === 'medlab' ? 'Simulation' : 'Chapter'}
                                </button>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
};
