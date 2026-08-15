# Code Concepts Architecture

Add your custom code, guidelines, or logic here. This file serves as a reference for rebuilding or extending the Code Concepts root components.

## Overview
- **Runners:** Handle the high-level orchestration of concepts and questions based on JSON.
- **Widgets:** Individual UI elements (like cards).
- **Interactions:** Drag & Drop, MCQs, and custom visual diagrams.

## User Notes
*Add your manual code here:*

Absorb each codeblock and integrate it inside the app there might be 4 files, ,
1) runner file
2) concept hub file
3) concept card file 
4) 


For each single question of json record use separate hub for question, 
there might be more than one question under single record of json sometimes not everytime 
it will be list of json whenevere it is. 


Code : 

Code block A : ```


import React from 'react';
import CoreConceptsHub from './CoreConceptsHub';

interface HubProps {
  isManualLock?: boolean;
  isEnergyDepleted?: boolean;
  completedIds?: Set<string | number>;
  consumeEnergy?: (id: string | number) => void;
  isChatBookOpen?: boolean;
  setIsChatBookOpen?: (isOpen: boolean) => void;
  onActivityStateChange?: (isOpen: boolean) => void;
  initialPayload?: any;
}

const CoreConcepts: React.FC<HubProps> = (props) => {
  return (
    <div className="flex-1 h-full">
      <CoreConceptsHub {...(props as any)} />
    </div>
  );
};

export default CoreConcepts;

```


```

import React from 'react';
import { InteractiveQuestion } from '../../types';
import { componentRegistry } from '../codeConceptsTopicsRegistry/componentRegistry';
import AIChatBook from '../AIChatBook';
import SaveButton from '../MySaves/SaveButton';

interface CoreConceptRunnerProps {
    concept: InteractiveQuestion;
    onBack: () => void;
    isChatBookOpen: boolean;
    onCloseChatBook: () => void;
    courseId: string;
}

const CoreConceptRunner: React.FC<CoreConceptRunnerProps> = ({ concept, onBack, isChatBookOpen, onCloseChatBook, courseId }) => {
    const VisualComponent = componentRegistry[concept.componentId];

    if (!VisualComponent) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-destructive">Error: Component Not Found</h2>
                <p>Component not found for ID: {concept.componentId}</p>
                <p>This usually means the exercise component hasn't been created (e.g., inside <strong>components/core_concepts_levels/topic-folder/</strong>) or registered in <strong>componentRegistry.ts</strong>.</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">Back</button>
            </div>
        );
    }

    const isWideComponent = concept.componentId === 'mp_diff_opt_lifeguard_solve';

    return (
        <div className="w-full h-full flex flex-col">
            <div className={`flex-1 overflow-y-auto custom-scrollbar ${isWideComponent ? 'max-w-7xl mx-auto w-full' : 'w-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <SaveButton
                        id={concept.componentId}
                        type="core_concept"
                        title={concept.title}
                        courseId={courseId}
                        menuAlign="left"
                        menuDirection="down"
                    />
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                        Back to Concepts
                    </button>
                </div>

                <div className="p-8 bg-card rounded-2xl shadow-xl">
                    <VisualComponent
                        exercise={concept}
                        onComplete={() => {
                            // Core concepts are for exploration, so "onComplete" can be a no-op.
                        }}
                    />
                </div>
            </div>
            {isChatBookOpen && <AIChatBook activityId={concept.componentId} onClose={onCloseChatBook} />}
        </div>
    );
};

export default CoreConceptRunner;

```



```

import React from 'react';
import { InteractiveQuestion } from '../../types';
import { PlayIcon, BookIcon, LockIcon } from '../icons/index';
import SaveButton from '../MySaves/SaveButton';

interface CoreConceptCardProps {
    concept: InteractiveQuestion;
    onStart: () => void;
    isLocked: boolean;
    courseId: string;
}

const CoreConceptCard: React.FC<CoreConceptCardProps> = ({ concept, onStart, isLocked, courseId }) => {
    return (
        <div className={`bg-card p-6 rounded-2xl shadow-lg transition-all duration-300 ${isLocked ? 'opacity-60 saturate-50' : 'hover:shadow-xl hover:-translate-y-1'} flex flex-col`}>
            <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                    <BookIcon className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-card-foreground leading-tight">{concept.title}</h3>
            </div>

            <p className="text-muted-foreground text-sm mt-1 mb-4 flex-grow">{concept.prompt}</p>

            <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-secondary-foreground">Concept Tested:</p>
                <p className="text-sm text-muted-foreground">{concept.concept_tested}</p>
            </div>

            {isLocked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed mt-auto">
                    <LockIcon className="w-5 h-5" />
                    Locked
                </button>
            ) : (
                <div className="flex gap-2 mt-auto">
                    <button onClick={onStart} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-accent text-primary-foreground font-bold shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all">
                        <PlayIcon className="w-5 h-5" />
                        Launch Activity
                    </button>
                    <SaveButton id={concept.componentId} type="core_concept" title={concept.title} courseId={courseId} />
                </div>
            )}
        </div>
    );
};

export default CoreConceptCard;

```

```
import React, { useState, useEffect } from 'react';
import { coreConceptCourseData } from '../../constants';
import { CoreConceptsData, InteractiveQuestion, ConceptCourse } from '../../types';
import CoreConceptCard from './CoreConceptCard';
import CoreConceptsSidebar from './CoreConceptsSidebar';
import CoreConceptRunner from './CoreConceptRunner';

interface EnrichedConceptData extends ConceptCourse {
    concepts: CoreConceptsData | null;
}

interface CoreConceptsHubProps {
    isManualLock: boolean;
    isEnergyDepleted: boolean;
    completedIds: Set<string | number>;
    consumeEnergy: (id: string | number) => void;
    isChatBookOpen: boolean;
    setIsChatBookOpen: (isOpen: boolean) => void;
    onActivityStateChange: (isOpen: boolean) => void;
    initialPayload?: any;
}

const CoreConceptsHub: React.FC<CoreConceptsHubProps> = ({ isManualLock, isEnergyDepleted, completedIds, consumeEnergy, isChatBookOpen, setIsChatBookOpen, onActivityStateChange, initialPayload }) => {
    const [conceptTopics, setConceptTopics] = useState<EnrichedConceptData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTopicId, setActiveTopicId] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeConcept, setActiveConcept] = useState<InteractiveQuestion | null>(null);

    useEffect(() => {
        const fetchAllConcepts = async () => {
            const promises = coreConceptCourseData.map(async course => {
                const fileName = course.id === 'oscillations-waves' ? 'waves-and-oscillations' : course.id;
                const res = await fetch(`/core_concepts/${fileName}.json`);
                const data: CoreConceptsData | null = res.ok ? await res.json() : null;
                return { ...course, concepts: data };
            });

            const results = await Promise.all(promises);
            const validTopics = results.filter(r => r.concepts && r.concepts.interactive_questions.length > 0);
            setConceptTopics(validTopics as EnrichedConceptData[]);
            if (validTopics.length > 0) {
                setActiveTopicId(validTopics[0].id);
            }
            setIsLoading(false);
        };
        fetchAllConcepts();
    }, []);

    useEffect(() => {
        if (initialPayload && conceptTopics.length > 0) {
            const { itemId, courseId } = initialPayload;
            if (courseId) {
                setActiveTopicId(courseId);
                const topic = conceptTopics.find(t => t.id === courseId);
                if (topic && topic.concepts) {
                    const concept = topic.concepts.interactive_questions.find(q => q.componentId === itemId);
                    if (concept) {
                        handleStartConcept(concept);
                    }
                }
            }
        }
    }, [initialPayload, conceptTopics]);

    useEffect(() => {
        onActivityStateChange(activeConcept !== null);
    }, [activeConcept, onActivityStateChange]);

    const handleStartConcept = (concept: InteractiveQuestion) => {
        consumeEnergy(concept.componentId);
        setActiveConcept(concept);
    };

    const handleBackFromConcept = () => {
        setActiveConcept(null);
        setIsChatBookOpen(false);
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center">Loading Core Concepts...</div>;
    }

    const activeTopic = conceptTopics.find(t => t.id === activeTopicId);

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            <CoreConceptsSidebar
                topics={conceptTopics.map(t => ({ id: t.id, title: t.title, icon: t.icon }))}
                activeTopicId={activeTopicId}
                onTopicSelect={(id) => {
                    setActiveTopicId(id);
                    setActiveConcept(null);
                }}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeConcept ? (
                    <div className="p-8 h-full">
                        <CoreConceptRunner concept={activeConcept} onBack={handleBackFromConcept} isChatBookOpen={isChatBookOpen} onCloseChatBook={() => setIsChatBookOpen(false)} courseId={activeTopicId} />
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="max-w-6xl mx-auto">
                            {activeTopic && activeTopic.concepts ? (
                                (() => {
                                    const title = activeTopic.concepts.chapter_title || activeTopic.title;
                                    return (
                                        <>
                                            <header className="text-center max-w-2xl mx-auto mb-12">
                                                <div className="inline-block p-4 bg-card rounded-2xl shadow-sm mb-4">
                                                    <activeTopic.icon className="w-12 h-12 text-primary" />
                                                </div>
                                                <h2 className="text-4xl font-bold text-foreground bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                                                    {title}
                                                </h2>
                                                <p className="text-muted-foreground mt-2 text-lg">{activeTopic.longDescription}</p>
                                            </header>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {activeTopic.concepts.interactive_questions.map(question => {
                                                    const isCompleted = completedIds.has(question.componentId);
                                                    const isLocked = isManualLock || (isEnergyDepleted && !isCompleted);
                                                    return <CoreConceptCard key={question.componentId} concept={question} onStart={() => handleStartConcept(question)} isLocked={isLocked} courseId={activeTopicId} />
                                                })}
                                            </div>
                                        </>
                                    );
                                })()
                            ) : (
                                <div className="text-center text-muted-foreground mt-20">
                                    <h2 className="text-2xl font-bold">Welcome to the Core Concepts Hub</h2>
                                    <p className="mt-2">Select a topic from the sidebar to begin exploring interactive labs.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoreConceptsHub;

```



