import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
    labData: LabData;
    onComplete: () => void;
    onBack: () => void;
    step: number;
    setStep: (updater: number | ((s: number) => number)) => void;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

type BasePair = 'A' | 'T' | 'G' | 'C';

const DNAReplicationVisual: React.FC<{
    templateStrand: BasePair[];
    selectedBases: (BasePair | null)[];
    baseColors: Record<BasePair, string>;
    replicationProgress: number;
}> = ({ templateStrand, selectedBases, baseColors, replicationProgress }) => (
    <div className="flex flex-col items-center gap-2 bg-card/40 dark:bg-white/5 p-6 rounded-xl border border-purple-100/50 w-full">
        <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2 font-mono">Template 3'</span>
            {templateStrand.map((base, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className={`w-10 h-10 ${baseColors[base]} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20`}>
                        {base}
                    </div>
                    <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                </div>
            ))}
            <span className="text-xs text-muted-foreground ml-2 font-mono">5'</span>
        </div>
        <div className="flex gap-1">
            {templateStrand.map((_, i) => (
                <div key={i} className="w-10 flex justify-center">
                    <div className={`w-0.5 h-6 ${replicationProgress > i * 20 ? 'bg-purple-400' : 'bg-slate-200 dark:bg-slate-700'} transition-colors duration-500`} />
                </div>
            ))}
        </div>
        <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2 font-mono">New 5'</span>
            {selectedBases.map((base, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                    <div
                        className={`w-10 h-10 ${base ? baseColors[base] : 'bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600'} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transition-all`}
                    >
                        {base || '?'}
                    </div>
                </div>
            ))}
            <span className="text-xs text-muted-foreground ml-2 font-mono">3'</span>
        </div>
    </div>
);

const DNAReplicationInteraction: React.FC<{
    baseColors: Record<BasePair, string>;
    handleBaseSelect: (base: BasePair) => void;
    resetStrand: () => void;
    checkReplication: () => void;
    isCompleted: boolean;
    selectedBases: (BasePair | null)[];
    replicationProgress: number;
}> = ({ baseColors, handleBaseSelect, resetStrand, checkReplication, isCompleted, selectedBases, replicationProgress }) => {
    return (
        <div className="space-y-6 w-full">
            <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">Click a base below to add it to the next empty slot:</p>
                <div className="flex justify-center gap-4">
                    {(['A', 'T', 'G', 'C'] as BasePair[]).map((base) => (
                        <div key={base} className="text-center group">
                            <button
                                className={`w-14 h-14 text-xl font-bold ${baseColors[base]} text-white rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={() => handleBaseSelect(base)}
                                disabled={isCompleted}
                            >
                                {base}
                            </button>
                            <p className="text-[10px] mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                                {base === 'A' ? 'Adenine' : base === 'T' ? 'Thymine' : base === 'G' ? 'Guanine' : 'Cytosine'}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={resetStrand}
                    className="w-full text-slate-500 hover:text-red-500 bg-transparent py-2 px-4 rounded-lg disabled:opacity-50 text-sm"
                    disabled={isCompleted && replicationProgress < 100}
                >
                    Clear & Reset Strand
                </button>
            </div>

            <button
                onClick={checkReplication}
                disabled={selectedBases.includes(null) || isCompleted}
                className="w-full bg-gradient-genetics-accent py-3 font-semibold rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
                Check Replication
            </button>
        </div>
    );
};

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
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
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />

                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
                        )}

                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}
                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1">Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DNAReplication: React.FC<ChapterProps> = ({ labData, onComplete, onBack, exercises, infoVisible, infoPlacement, settings }) => {
    const [selectedBases, setSelectedBases] = useState<(BasePair | null)[]>(Array(5).fill(null));
    const [replicationProgress, setReplicationProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentExercise = exercises[0];

    if (!currentExercise) return null;

    const templateStrand: BasePair[] = ['A', 'T', 'G', 'C', 'A'];
    const correctComplement: BasePair[] = ['T', 'A', 'C', 'G', 'T'];
    const baseColors: Record<BasePair, string> = {
        'A': 'bg-red-500', 'T': 'bg-blue-500',
        'G': 'bg-green-500', 'C': 'bg-yellow-500'
    };

    const handleBaseSelect = (base: BasePair) => {
        if (isCompleted) return;
        const emptyIndex = selectedBases.findIndex(b => b === null);
        if (emptyIndex !== -1) {
            const newBases = [...selectedBases];
            newBases[emptyIndex] = base;
            setSelectedBases(newBases);
        }
    };

    const checkReplication = () => {
        const allCorrect = selectedBases.every((base, i) => base === correctComplement[i]);
        if (allCorrect) {
            toast.success("Replication successful!");
            setIsCompleted(true);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                setReplicationProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 1000);
                }
            }, 200);
        } else {
            toast.error("Incorrect base pairing. Please try again.");
        }
    };

    const resetStrand = () => {
        setSelectedBases(Array(5).fill(null));
        setReplicationProgress(0);
        setIsCompleted(false);
    }

    const VisualContent = (
        <DNAReplicationVisual
            templateStrand={templateStrand}
            selectedBases={selectedBases}
            baseColors={baseColors}
            replicationProgress={replicationProgress}
        />
    );

    const InteractionContent = (
        <DNAReplicationInteraction 
            baseColors={baseColors}
            handleBaseSelect={handleBaseSelect}
            resetStrand={resetStrand}
            checkReplication={checkReplication}
            isCompleted={isCompleted}
            selectedBases={selectedBases}
            replicationProgress={replicationProgress}
        />
    );

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

export default DNAReplication;
