
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { readingContent } from '../../data/readingContent';
import { BookOpenText, ChevronLeft } from 'lucide-react';

// --- Background Components ---

const TealBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <circle cx="15" cy="15" r="10" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
        <circle cx="0" cy="0" r="45" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" fill="none" strokeDasharray="8 8" />
        <circle cx="0" cy="0" r="90" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" fill="none" strokeDasharray="12 12" />
        <circle cx="100" cy="100" r="60" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />
    </svg>
);

const SunsetBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 100 Q 50 50 100 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
        <path d="M0 90 Q 50 40 100 90" stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="0.5" />
        <path d="M0 80 Q 50 30 100 80" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="0.5" />
        <circle cx="80" cy="20" r="15" fill="url(#sun-gradient)" opacity="0.3" />
        <defs>
            <radialGradient id="sun-gradient">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

const MidnightBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 50 }, (_, i) => i).map((i) => (
            <circle
                key={i}
                cx={(i * 37 + 13) % 100}
                cy={(i * 61 + 29) % 100}
                r={(i % 5 + 1) / 10}
                fill="white"
                opacity={0.2 + (i % 8) * 0.08}
            />
        ))}
        <path d="M 20 20 L 25 35 L 40 40 L 25 45 L 20 60 L 15 45 L 0 40 L 15 35 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />
    </svg>
);

const ForestBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 100 C 30 60, 70 60, 100 100 L 100 100 L 0 100 Z" fill="rgba(255,255,255,0.1)" />
        <path d="M0 100 C 40 70, 80 90, 100 100 L 100 100 L 0 100 Z" fill="rgba(255,255,255,0.1)" />
        <circle cx="90" cy="10" r="30" fill="rgba(255,255,255,0.05)" />
        <path d="M 50 0 L 50 100" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
    </svg>
);

const topicNames: Record<string, string> = {
    'cell-biology': 'Cellular Biology',
    'genetics': 'Genetics',
    'physiology': 'Physiology',
    'developmental': 'Developmental Biology',
    'neuroscience': 'Neuroscience',
    'pathology': 'Pathology',
    'pharmacology': 'Pharmacology',
    'microbiology': 'Microbiology',
    'immunology': 'Immunology',
    'genetic-engineering': 'Genetic Engineering',
    'proteomics': 'Proteomics',
    'bioinformatics': 'Bioinformatics',
    'biochemistry': 'Biochemistry',
};

const topicThemes: Record<string, 'teal' | 'sunset' | 'midnight' | 'forest'> = {
    'cell-biology': 'teal',
    'genetics': 'midnight',
    'physiology': 'sunset',
    'developmental': 'forest',
    'neuroscience': 'midnight',
    'pathology': 'sunset',
    'pharmacology': 'teal',
    'microbiology': 'forest',
    'immunology': 'sunset',
    'genetic-engineering': 'midnight',
    'proteomics': 'teal',
    'bioinformatics': 'forest',
    'biochemistry': 'sunset',
};

const topicKeys = Object.keys(readingContent);

export const ReadingView: React.FC<{ onBrowseTopics: () => void }> = ({ onBrowseTopics }) => {
    const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);
    const [readingProgress, setReadingProgress] = useState(0);

    const getThemeStyles = (theme: string) => {
        switch (theme) {
            case 'teal':
                return {
                    card: 'bg-gradient-to-br from-[#2D9C8D] to-[#0C4D58]',
                    text: 'text-teal-100',
                    bgComponent: <TealBackground />
                };
            case 'sunset':
                return {
                    card: 'bg-gradient-to-br from-orange-400 to-rose-600',
                    text: 'text-orange-100',
                    bgComponent: <SunsetBackground />
                };
            case 'midnight':
                return {
                    card: 'bg-gradient-to-br from-indigo-500 to-slate-900',
                    text: 'text-indigo-100',
                    bgComponent: <MidnightBackground />
                };
            case 'forest':
                return {
                    card: 'bg-gradient-to-br from-emerald-500 to-teal-900',
                    text: 'text-emerald-100',
                    bgComponent: <ForestBackground />
                };
            default:
                 return {
                    card: 'bg-slate-800',
                    text: 'text-white',
                    bgComponent: null
                };
        }
    };

    const currentTopicData = selectedTopicKey ? readingContent[selectedTopicKey] : null;
    const detailStyles = selectedTopicKey ? getThemeStyles(topicThemes[selectedTopicKey] || 'teal') : null;

    return (
        <AnimatePresence mode="wait">
            {selectedTopicKey && currentTopicData && detailStyles ? (
                <motion.div 
                    key="detail-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full bg-background overflow-y-auto custom-scrollbar scroll-smooth relative"
                    onScroll={(event) => {
                        const element = event.currentTarget;
                        const scrollableHeight = element.scrollHeight - element.clientHeight;
                        setReadingProgress(scrollableHeight > 0 ? Math.min(100, Math.round((element.scrollTop / scrollableHeight) * 100)) : 100);
                    }}
                >
                    {/* Header */}
                    <div className={`sticky top-0 z-50 ${detailStyles.card} shadow-md transition-all duration-300`}>
                        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                            {detailStyles.bgComponent}
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
                            <button 
                                onClick={() => {
                                    setSelectedTopicKey(null);
                                    setReadingProgress(0);
                                }}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                                aria-label="Back to Reading Library topics"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                                    {topicNames[selectedTopicKey] || selectedTopicKey}
                                </h1>
                                <p className="text-white/80 text-sm mt-1">Reading Material</p>
                            </div>
                        </div>
                        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-3 text-xs text-white/85">
                            <div className="mb-1 flex items-center justify-between gap-4">
                                <span>Reading Library · {Object.keys(currentTopicData).length} sections</span>
                                <span>{readingProgress}% read</span>
                            </div>
                            <div
                                role="progressbar"
                                aria-label="Reading progress"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={readingProgress}
                                className="h-1.5 overflow-hidden rounded-full bg-white/20"
                            >
                                <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${readingProgress}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-4 pb-24 pt-12">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={selectedTopicKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-12"
                                >
                                    {Object.values(currentTopicData).map((subtopic, index) => (
                                        <section key={subtopic.title} aria-labelledby={`reading-section-${index}`} className="bg-gradient-to-br from-card via-card to-muted/30 border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                            <h2 id={`reading-section-${index}`} className="font-heading text-3xl tracking-wide text-card-foreground mb-6 border-b-2 border-primary/10 pb-4 relative z-10">
                                                {subtopic.title}
                                            </h2>
                                            <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
                                                {subtopic.content}
                                            </p>
                                        </section>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="list-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full bg-slate-50 dark:bg-black/50 p-6 overflow-y-auto custom-scrollbar"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 text-center pt-8">
                            <div className="inline-flex items-center justify-center bg-card rounded-2xl shadow-sm border border-border/50 p-3 mb-6">
                                <BookOpenText className="text-primary w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-bold text-foreground mb-4 font-heading tracking-wide">Reading Library</h1>
                            <p className="text-muted-foreground">A concise knowledge base of core biology topics.</p>
                        </div>

                        {topicKeys.length === 0 ? (
                            <div role="status" className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                                <BookOpenText className="mx-auto mb-4 h-8 w-8 text-primary" />
                                <h2 className="text-xl font-bold text-foreground">No reading material is published yet</h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The Reading Library currently has no topic content. Browse Agent Labs topics for available interactive learning.</p>
                                <button type="button" onClick={onBrowseTopics} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                                    Browse Agent Labs topics
                                </button>
                            </div>
                        ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                            {topicKeys.map((topicKey) => {
                                const theme = topicThemes[topicKey] || 'teal';
                                const styles = getThemeStyles(theme);
                                const chapterCount = Object.keys(readingContent[topicKey]).length;
                                
                                return (
                                    <button
                                        type="button"
                                        key={topicKey} 
                                        onClick={() => setSelectedTopicKey(topicKey)}
                                        aria-label={`Open ${topicNames[topicKey] || topicKey}, ${chapterCount} ${chapterCount === 1 ? 'chapter' : 'chapters'}`}
                                        className={`relative w-full appearance-none border-0 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${styles.card} flex flex-col cursor-pointer min-h-[240px] text-left`}
                                    >
                                        {/* Dynamic Background SVG */}
                                        <div className="absolute inset-0 opacity-50">
                                            {styles.bgComponent}
                                        </div>

                                        {/* Content Container */}
                                        <div className="relative z-10 p-8 flex flex-col h-full">
                                            
                                            {/* Header */}
                                            <div className="mb-6 flex items-center space-x-2 opacity-70">
                                                <span className="h-px w-4 bg-white"></span>
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Topic</span>
                                            </div>

                                            {/* Topic Title */}
                                            <div className="relative mb-6 flex-grow">
                                                <h2 className="text-3xl font-bold text-white leading-tight font-heading relative z-10 px-2 drop-shadow-sm">
                                                    {topicNames[topicKey] || topicKey}
                                                </h2>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                                                <p className="text-sm text-white/90 font-medium">
                                                    {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
                                                </p>
                                                <div className="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm">
                                                    <BookOpenText className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
