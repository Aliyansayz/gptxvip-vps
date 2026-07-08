
import React from 'react';
import { LabData, ConceptCourse } from '../../types';
import { LockIcon, PlayIcon } from '../icons';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface MedLabHubProps {
    medTopics: EnrichedConceptData[];
    isLoading: boolean;
    onStartChapter: (chapter: LabData) => void;
    activeTopicId: string;
}

const MedChapterCard: React.FC<{
    chapter: LabData;
    onStart: () => void;
}> = ({ chapter, onStart }) => {
    const totalExercises = chapter.interactive_questions.length;
    return (
        <div className="bg-card p-6 rounded-xl border border-border hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col group">
            <h4 className="font-heading text-2xl tracking-wide text-black dark:text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:via-blue-600 group-hover:to-cyan-500 group-hover:bg-[size:200%_auto] group-hover:animate-gradient">
                {chapter.chapter_title}
            </h4>
            <p className="text-sm text-muted-foreground mt-2 mb-4 flex-grow">{totalExercises} clinical simulation(s).</p>
            <div className="flex items-center text-xs text-muted-foreground mb-4 flex-wrap gap-2">
                {chapter.critical_concepts.slice(0, 3).map(c => (
                    <span key={c.concept} className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded-md font-mono">{c.concept}</span>
                ))}
            </div>
            <button
                onClick={onStart}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md hover:shadow-lg transition-all"
            >
                <PlayIcon className="w-5 h-5" />
                <span>Launch Simulation</span>
            </button>
        </div>
    );
}

const MedLabHub: React.FC<MedLabHubProps> = ({ 
    medTopics,
    isLoading,
    onStartChapter,
    activeTopicId
}) => {
    const activeTopic = medTopics.find(t => t.id === activeTopicId);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-xl font-heading tracking-wide">
                    Initializing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">Medical Simulations</span>...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-black h-fit">
            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    {activeTopic ? (
                        <>
                            <header className="mb-12 border-b border-border pb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-cyan-600 rounded-lg shadow-lg">
                                        <activeTopic.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-5xl font-heading tracking-wide text-foreground">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                                            {activeTopic.title}
                                        </span>
                                    </h2>
                                </div>
                                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">{activeTopic.longDescription}</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeTopic.chapters.map(chapter => (
                                    <MedChapterCard 
                                        key={chapter.labComponentId} 
                                        chapter={chapter} 
                                        onStart={() => onStartChapter(chapter)} 
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground mt-20 h-full flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold">Select a Clinical Specialty</h2>
                            <p className="mt-2">Choose a medical field from the sidebar to begin clinical simulations.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedLabHub;
