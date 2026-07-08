import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { LabSettings } from '../../LabSettingsMenu';
import MorphogenGradientActivity from './MorphogenGradientActivity';
import HoxGeneBuilderActivity from './HoxGeneBuilderActivity';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';
import { TheoryVisual } from '../../TheoryVisual';

interface AdvancedMorphogenesisProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const TheoryPane: React.FC<{ exercise: Exercise & { theory?: { title: string; content: string; analogy?: string; application?: string } } ; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-orange-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: content }} />
                    
                    {analogy && (
                        <TheoryVisual 
                            analogyName={analogy} 
                            keywords={[title, content]} 
                        />
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {analogy && (
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                                <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-orange-500" /> Analogy
                                </h4>
                                <p className="text-xs italic leading-relaxed text-muted-foreground">"{analogy}"</p>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-3 h-3 text-blue-500" /> Application
                                </h4>
                                <p className="text-xs leading-relaxed text-muted-foreground">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdvancedMorphogenesis: React.FC<AdvancedMorphogenesisProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];

    if (!currentExercise) return null;

    let VisualContent = null;
    let InteractionContent = null;

    if (currentExercise.componentId === 'morphogen_gradient_activity') {
        return <MorphogenGradientActivity labData={{} as any} exercises={[currentExercise]} onComplete={() => {}} />;
    }

    if (currentExercise.componentId === 'hox_gene_builder_activity') {
        return <HoxGeneBuilderActivity labData={{} as any} exercises={[currentExercise]} onComplete={() => {}} />;
    }

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
