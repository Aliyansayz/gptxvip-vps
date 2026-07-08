
import React, { useState, useEffect } from 'react';
import BioLabSidebar from './bioLabTopicsView/bioLabSidebar';
import CoreConceptsHub from './bioLabTopicsView/bioLabTopicsHub';
import BioLabRunner from './bioLabTopicsView/bioLabRunner';
import { coreConceptCourseData } from '../constants';
import { LabData, ConceptCourse } from '../types';
import { toast } from 'sonner';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface BiolabContentProps {
    initialChapterId?: string | null;
    onChapterOpened?: () => void;
    onConsumeEnergy: () => boolean;
    isLocked: boolean;
    onSimulationComplete: () => void;
}

export const BiolabContent: React.FC<BiolabContentProps> = ({ initialChapterId, onChapterOpened, onConsumeEnergy, isLocked, onSimulationComplete }) => {
    const [activeTopicId, setActiveTopicId] = useState<string>('proteomics'); 
    const [selectedChapter, setSelectedChapter] = useState<LabData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bioTopics, setBioTopics] = useState<EnrichedConceptData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBioLabs = async () => {
            try {
                // Fetch all available topics corresponding to the sidebar items
                const files = [
                    'proteomics', 
                    'cellular-biology', 
                    'genetics', 
                    'ecology', 
                    'pathology', 
                    'pharmacology', 
                    'physiology', 
                    'developmental-biology', 
                    'neuroscience',
                    'immunology',
                    'microbiology',
                    'genetic-engineering'
                ];
                
                const responses = await Promise.all(
                    files.map(f => fetch(`/bio_topics/${f}.json`).then(res => {
                        if (!res.ok) throw new Error(`Missing ${f}`);
                        return res.text().then(text => text ? JSON.parse(text) : []);
                    }).catch(err => {
                        console.warn(`Failed to fetch ${f}:`, err);
                        return [];
                    }))
                );

                const allLabs = responses.flat().filter(Boolean) as LabData[];

                // Merge labs with course metadata
                const enriched = coreConceptCourseData.map(course => ({
                    ...course,
                    chapters: allLabs.filter(lab => 
                        lab.course.toLowerCase() === course.title.toLowerCase() || 
                        lab.course.toLowerCase() === course.id.toLowerCase()
                    )
                }));
                
                setBioTopics(enriched);
            } catch (e) {
                console.error("Failed to load BioLabs", e);
                toast.error("Failed to load Biology content");
            } finally {
                setLoading(false);
            }
        };
        fetchBioLabs();
    }, []);

    // Handle deep linking from favorites
    useEffect(() => {
        if (initialChapterId && bioTopics.length > 0 && !loading) {
            let foundChapter: LabData | undefined;
            let foundTopicId: string | undefined;

            for (const topic of bioTopics) {
                const chapter = topic.chapters.find(c => c.labComponentId === initialChapterId);
                if (chapter) {
                    foundChapter = chapter;
                    foundTopicId = topic.id;
                    break;
                }
            }

            if (foundChapter && foundTopicId) {
                setActiveTopicId(foundTopicId);
                setSelectedChapter(foundChapter);
                if (onChapterOpened) onChapterOpened();
            }
        }
    }, [initialChapterId, bioTopics, loading, onChapterOpened]);

    const handleStartChapter = (chapter: LabData) => {
        if (isLocked) {
            toast.error("Simulation Locked: Insufficient Energy or App Locked");
            return;
        }
        if (onConsumeEnergy()) {
            setSelectedChapter(chapter);
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-black">
            <BioLabSidebar 
                topics={coreConceptCourseData} 
                activeTopicId={activeTopicId} 
                onTopicSelect={(id) => {
                    setActiveTopicId(id);
                    setSelectedChapter(null); // Return to Hub when switching topics
                }}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 overflow-hidden relative">
                {selectedChapter ? (
                    <BioLabRunner 
                        chapter={selectedChapter} 
                        onBack={() => setSelectedChapter(null)}
                        onComplete={() => {
                            toast.success("Chapter Completed!");
                            setSelectedChapter(null);
                            onSimulationComplete();
                        }}
                    />
                ) : (
                    <CoreConceptsHub 
                        conceptTopics={bioTopics} 
                        isLoading={loading} 
                        activeTopicId={activeTopicId} 
                        onStartChapter={handleStartChapter}
                        isManualLock={false}
                        isEnergyDepleted={false}
                        completedIds={new Set()}
                        isChatBookOpen={false}
                        setIsChatBookOpen={() => {}}
                        onActivityStateChange={() => {}}
                    />
                )}
            </div>
        </div>
    );
};
