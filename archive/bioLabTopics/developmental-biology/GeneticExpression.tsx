import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Zap, Stethoscope } from 'lucide-react';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';
import WaddingtonsLandscapeActivity from './WaddingtonsLandscapeActivity';
import { TheoryVisual } from '../../TheoryVisual';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const GeneExpressionVisual: React.FC<{ cellState: 'Stem' | 'Neuron' | 'Muscle' | 'Skin' | 'Unknown' }> = ({ cellState }) => {
    // Visual styles based on state
    const getCellStyle = () => {
        switch (cellState) {
            case 'Neuron': return 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-110';
            case 'Muscle': return 'bg-red-500 rounded-none w-32 h-16';
            case 'Skin': return 'bg-yellow-200 border-4 border-yellow-400';
            case 'Unknown': return 'bg-gray-400 animate-pulse';
            default: return 'bg-slate-300 rounded-full'; // Stem
        }
    };

    const getCellShape = () => {
        switch (cellState) {
            case 'Neuron': 
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        <circle cx="50" cy="50" r="20" />
                        <path d="M50 30 L50 10 M50 70 L50 90 M30 50 L10 50 M70 50 L90 50 M36 36 L20 20 M64 36 L80 20 M36 64 L20 80 M64 64 L80 80" stroke="currentColor" strokeWidth="4" />
                    </svg>
                );
            case 'Muscle': 
                return (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold tracking-widest">||||||</div>
                );
            default: return null;
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px] bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 w-full">
            <div className={`transition-all duration-500 relative flex items-center justify-center ${getCellStyle()} ${cellState !== 'Muscle' ? 'w-24 h-24 rounded-full' : ''}`}>
                {getCellShape()}
                <div className="absolute -bottom-10 whitespace-nowrap font-bold text-lg text-foreground">
                    {cellState === 'Unknown' ? '???' : `${cellState} Cell`}
                </div>
            </div>
        </div>
    );
};

const GeneExpressionInteraction: React.FC<{
    exercise: Exercise;
    activeGenes: Set<string>;
    toggleGene: (geneId: string) => void;
    checkResult: () => void;
    showResult: boolean;
    cellState: 'Stem' | 'Neuron' | 'Muscle' | 'Skin' | 'Unknown';
    setShowResult: (val: boolean) => void;
}> = ({ exercise, activeGenes, toggleGene, checkResult, showResult, cellState, setShowResult }) => {
    // Genes and their effects logic
    const genes = [
        { id: 'Neurogenin', label: 'Neurogenin (Ngn)', type: 'Neuron' },
        { id: 'MyoD', label: 'MyoD', type: 'Muscle' },
        { id: 'Keratin', label: 'Keratin', type: 'Skin' },
        { id: 'Sox2', label: 'Sox2 (Stem)', type: 'Stem' }
    ];

    return (
        <div className="space-y-6 w-full">
            <div className="bg-muted/30 p-6 rounded-xl border">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Transcription Factors</h4>
                <div className="space-y-3">
                    {genes.map(gene => (
                        <div key={gene.id} className="flex items-center justify-between">
                            <span className="font-mono text-sm">{gene.label}</span>
                            <button
                                onClick={() => toggleGene(gene.id)}
                                disabled={showResult && cellState === 'Neuron'}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${activeGenes.has(gene.id) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${activeGenes.has(gene.id) ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="font-semibold mb-4">{exercise.question}</p>
                {!showResult && (
                    <button 
                        onClick={checkResult}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
                    >
                        <Zap className="w-5 h-5" />
                        Differentiate
                    </button>
                )}
                
                {showResult && (
                    <div className={`mt-4 p-4 rounded-lg ${cellState === 'Neuron' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            {cellState === 'Neuron' ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                            <span className="font-bold text-lg">{cellState === 'Neuron' ? 'Success!' : 'Differentiation Failed'}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{cellState === 'Neuron' ? exercise.explanation : "This combination did not produce a Neuron. Hint: Neurons need Neurogenin."}</p>
                        {cellState !== 'Neuron' && (
                            <button onClick={() => setShowResult(false)} className="mt-2 text-sm text-primary underline">Try Again</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

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

export const GeneticExpression: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [activeGenes, setActiveGenes] = useState<Set<string>>(new Set());
    const [cellState, setCellState] = useState<'Stem' | 'Neuron' | 'Muscle' | 'Skin' | 'Unknown'>('Stem');
    const [showResult, setShowResult] = useState(false);

    // Reset state on exercise change
    useEffect(() => {
        setActiveGenes(new Set());
        setCellState('Stem');
        setShowResult(false);
    }, [currentExercise]);

    if (!currentExercise) return null;

    if (currentExercise.componentId === 'waddingtons_landscape_activity') {
        return <WaddingtonsLandscapeActivity labData={{} as any} exercises={[currentExercise]} onComplete={() => {}} />;
    }

    const determineCellState = (genes: Set<string>) => {
        // Simplified logic for the game
        if (genes.has('Neurogenin') && !genes.has('MyoD') && !genes.has('Keratin')) {
            setCellState('Neuron');
        } else if (genes.has('MyoD') && !genes.has('Neurogenin') && !genes.has('Keratin')) {
            setCellState('Muscle');
        } else if (genes.has('Keratin') && !genes.has('Neurogenin') && !genes.has('MyoD')) {
            setCellState('Skin');
        } else if (genes.has('Sox2') && genes.size === 1) {
            setCellState('Stem');
        } else if (genes.size === 0) {
            setCellState('Stem');
        } else {
            setCellState('Unknown'); // Conflicting signals
        }
    };

    const toggleGene = (geneId: string) => {
        if (showResult) return;
        const newActive = new Set<string>(activeGenes);
        if (newActive.has(geneId)) newActive.delete(geneId);
        else newActive.add(geneId);
        setActiveGenes(newActive);
        determineCellState(newActive);
    };

    const checkResult = () => {
        const correct = cellState === 'Neuron';
        setShowResult(true);
        if (correct) {
            toast.success("Success! You created a Neuron.");
        } else {
            toast.error("Incorrect cell type generated.");
        }
    };

    const VisualContent = <GeneExpressionVisual cellState={cellState} />;

    const InteractionContent = (
        <GeneExpressionInteraction 
            exercise={currentExercise}
            activeGenes={activeGenes}
            toggleGene={toggleGene}
            checkResult={checkResult}
            showResult={showResult}
            cellState={cellState}
            setShowResult={setShowResult}
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
