
import React, { useState, useEffect } from 'react';
import { coreConceptCourseData } from '../../constants';
import { LabData, Exercise, ConceptCourse } from '../../types';
import { toast } from 'sonner';
import { LockIcon, PlayIcon } from '../icons';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface BioLabHubProps {
    conceptTopics: EnrichedConceptData[];
    isLoading: boolean;
    isManualLock: boolean;
    isEnergyDepleted: boolean;
    completedIds: Set<string | number>;
    onStartChapter: (chapter: LabData) => void;
    isChatBookOpen: boolean;
    setIsChatBookOpen: (isOpen: boolean) => void;
    onActivityStateChange: (isOpen: boolean) => void;
    onTopicChange?: (topic: string) => void;
    activeTopicId: string;
}

const ChapterCard: React.FC<{
    chapter: LabData;
    onStart: () => void;
    isLocked: boolean;
    isCompleted: boolean;
}> = ({ chapter, onStart, isLocked, isCompleted }) => {
    const totalExercises = chapter.interactive_questions.length;
    return (
        <div className={`bg-card p-6 rounded-2xl border ${isLocked ? 'opacity-60 saturate-50 cursor-not-allowed' : 'hover:border-primary hover:shadow-lg hover:-translate-y-1'} transition-all duration-300 flex flex-col group`}>
            <h4 className="font-heading text-2xl tracking-wide text-black dark:text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-fuchsia-600 group-hover:to-purple-500 group-hover:bg-[size:200%_auto] group-hover:animate-gradient">
                {chapter.chapter_title}
            </h4>
            <p className="text-sm text-muted-foreground mt-2 mb-4 flex-grow">{totalExercises} interactive exercises to master core concepts.</p>
            <div className="flex items-center text-xs text-muted-foreground mb-4 flex-wrap gap-2">
                {chapter.critical_concepts.slice(0, 2).map(c => (
                    <span key={c.concept} className="bg-muted px-2 py-1 rounded-full">{c.concept}</span>
                ))}
                 {chapter.critical_concepts.length > 2 && <span className="text-xs text-muted-foreground">+ {chapter.critical_concepts.length-2} more</span>}
            </div>
            <button
                onClick={onStart}
                disabled={isLocked}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-primary/40 hover:shadow-lg transition-shadow"
            >
                {isLocked ? <LockIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                <span>{isCompleted ? 'Review Chapter' : 'Start Chapter'}</span>
            </button>
        </div>
    );
}

const CoreConceptsHub: React.FC<BioLabHubProps> = ({ 
    conceptTopics,
    isLoading,
    isManualLock, 
    isEnergyDepleted, 
    completedIds, 
    onStartChapter,
    activeTopicId
}) => {
    const activeTopic = conceptTopics.find(t => t.id === activeTopicId);

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center h-full"><p className="text-muted-foreground">Loading Core Concepts...</p></div>;
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    {activeTopic ? (
                        <>
                            <header className="text-center max-w-3xl mx-auto mb-12">
                                <div className="inline-block p-4 bg-card rounded-2xl shadow-sm mb-4">
                                    <activeTopic.icon className="w-12 h-12 text-primary" />
                                </div>
                                <h2 className="text-6xl font-heading tracking-wide text-foreground bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient">
                                    {activeTopic.title}
                                </h2>
                                <p className="text-muted-foreground mt-2 text-lg">{activeTopic.longDescription}</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {activeTopic.chapters.map(chapter => {
                                    const isCompleted = completedIds.has(chapter.labComponentId);
                                    const isLocked = isManualLock || (isEnergyDepleted && !isCompleted);
                                    return (
                                        <ChapterCard 
                                            key={chapter.labComponentId} 
                                            chapter={chapter} 
                                            onStart={() => onStartChapter(chapter)} 
                                            isLocked={isLocked} 
                                            isCompleted={isCompleted} 
                                        />
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground mt-20 h-full flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold">Welcome to the BioLabs Hub</h2>
                            <p className="mt-2">Select a topic from the sidebar to begin exploring interactive labs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoreConceptsHub;
