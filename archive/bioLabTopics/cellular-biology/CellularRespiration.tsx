import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
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
  settings: any;
}

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
                    <BookOpenText className="w-5 h-5 text-violet-500" />
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

// --- Theory Visuals ---

export const GlycolysisVisual = () => (
    <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl border border-pink-100 dark:border-pink-900">
        <h4 className="text-[10px] font-bold text-pink-600 uppercase tracking-widest text-center mb-4">Glycolysis Breakdown</h4>
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">Glucose (6C)</div>
            <div className="text-pink-300 text-lg">⬇️</div>
            <div className="flex gap-4">
                <div className="w-12 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-sm">Pyruvate (3C)</div>
                <div className="w-12 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-sm">Pyruvate (3C)</div>
            </div>
            <div className="flex items-center gap-2 mt-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="text-[9px] font-bold text-yellow-700 dark:text-yellow-400">Net Gain: 2 ATP</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Splitting sugar to release energy.</p>
    </div>
);

export const KrebsCycleVisual = () => (
    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">Krebs Cycle</h4>
        <div className="flex justify-center items-center relative h-24">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-orange-300 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[10px] font-bold text-orange-600">Cycle</div>
            </div>
            <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[8px] px-1 rounded border border-red-200">CO₂ Out</div>
            <div className="absolute bottom-0 left-0 bg-yellow-100 text-yellow-600 text-[8px] px-1 rounded border border-yellow-200">ATP Out</div>
            <div className="absolute top-0 left-0 bg-blue-100 text-blue-600 text-[8px] px-1 rounded border border-blue-200">NADH Out</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Extracting high-energy electrons.</p>
    </div>
);

export const ETCVisual = () => (
    <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl border border-cyan-100 dark:border-cyan-900">
        <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest text-center mb-4">Electron Transport Chain</h4>
        <div className="flex flex-col gap-2">
            <div className="h-4 bg-cyan-200 rounded-t-lg w-full flex items-center justify-center text-[8px] text-cyan-800 font-bold">High H+ Concentration</div>
            <div className="h-2 bg-gray-300 w-full"></div>
            <div className="flex justify-around">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-[8px]">I</div>
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-[8px]">II</div>
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-[8px]">III</div>
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white text-[8px] animate-pulse shadow-lg border-2 border-white">ATP Synthase</div>
            </div>
            <div className="h-4 bg-cyan-100 rounded-b-lg w-full flex items-center justify-center text-[8px] text-cyan-800 font-bold">Low H+ Concentration</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Using a proton gradient to generate massive ATP.</p>
    </div>
);

// --- Exercise UIs ---

export const GlycolysisUI: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    return (
        <div className="space-y-4 w-full">
            <div className="w-full max-w-sm mx-auto aspect-video bg-background/50 rounded-lg border p-4 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 200 120" className="w-full h-auto">
                    <g className="animate-fade-in">
                        <circle cx="100" cy="20" r="15" fill="#ec4899" />
                        <text x="100" y="22" textAnchor="middle" fontSize="6" fill="white" className="font-bold">Glucose</text>
                    </g>
                    <path d="M 100 35 V 50" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                     <path d="M 100 70 L 60 85" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                     <path d="M 100 70 L 140 85" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                    <g className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                        <circle cx="60" cy="95" r="10" fill="#a855f7" />
                        <text x="60" y="97" textAnchor="middle" fontSize="4" fill="white">Pyruvate</text>
                    </g>
                     <g className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                        <circle cx="140" cy="95" r="10" fill="#a855f7" />
                        <text x="140" y="97" textAnchor="middle" fontSize="4" fill="white">Pyruvate</text>
                    </g>
                     <g className="animate-fade-in" style={{animationDelay: '1s'}}>
                        <text x="170" y="65" fontSize="8" fill="#f59e0b" className="font-bold">+2 ATP</text>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export const KrebsCycleUI: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    return (
        <div className="space-y-4 w-full">
             <div className="w-full max-w-sm mx-auto aspect-square bg-background/50 rounded-lg border p-4 flex items-center justify-center">
                 <svg viewBox="-5 -5 110 110" className="w-full h-auto max-w-[200px]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="50" cy="50" r="2" fill="hsl(var(--foreground))" className="animate-spin" style={{ animation: 'spin 8s linear infinite' }} />
                    <text x="10" y="40" fontSize="8" fill="#a855f7">Pyruvate</text>
                    <text x="80" y="30" fontSize="8" fill="#f59e0b">ATP</text>
                    <text x="80" y="80" fontSize="8" fill="#ef4444">CO₂</text>
                 </svg>
             </div>
        </div>
    );
};

export const ETCSimulationUI: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    return (
        <div className="space-y-4 w-full">
            <div className="w-full max-w-sm mx-auto aspect-video bg-background/50 rounded-lg border p-4 flex flex-col justify-between">
                <div className="text-center font-semibold text-xs uppercase tracking-wide text-muted-foreground">High H+ Concentration</div>
                <div className="w-full h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex justify-around items-center">
                    <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center animate-spin" style={{animationDuration: '3s', animationIterationCount: 'infinite'}}><Zap className="w-8 h-8 text-yellow-300"/></div>
                </div>
                 <div className="text-center font-semibold text-xs uppercase tracking-wide text-muted-foreground">ATP Synthase</div>
            </div>
        </div>
    );
};

export const CellularRespiration: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [feedback, setFeedback] = useState<Record<string, { correct: boolean; text: string; } | null>>({});
    const currentExercise = exercises[step];

    if (!currentExercise) return null;

    const exerciseComponentMap: Record<string, React.FC<any>> = {
        'glycolysis_drag_drop': GlycolysisUI,
        'krebs_cycle_visualizer': KrebsCycleUI,
        'etc_simulation': ETCSimulationUI,
    };
    
    const ActiveExerciseUI = exerciseComponentMap[currentExercise.componentId];

    const handleSelectOption = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentExercise.componentId]: option }));
        setFeedback(prev => ({ ...prev, [currentExercise.componentId]: null }));
    };

    const checkAnswer = () => {
        const selectedAnswer = answers[currentExercise.componentId];
        if (!selectedAnswer) return;
        const isCorrect = selectedAnswer === currentExercise.answer;
        if (isCorrect) {
            toast.success("Correct!");
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: true, text: currentExercise.explanation || "Correct!" } }));
        } else {
            toast.error("Not quite right.");
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: false, text: "Incorrect. Please try again." } }));
        }
    };
    
    const currentFeedback = feedback[currentExercise.componentId];
    const currentAnswer = answers[currentExercise.componentId];

    const VisualContent = (
        <div className="w-full flex justify-center">
            {ActiveExerciseUI ? <ActiveExerciseUI exercise={currentExercise} /> : <p>Exercise visual not found.</p>}
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4 w-full">
            <p className="font-semibold text-lg">{currentExercise.question}</p>
            <div className="grid gap-2">
                {currentExercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => handleSelectOption(opt)} 
                        disabled={!!currentFeedback} 
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            currentAnswer === opt 
                                ? 'bg-violet-600 text-white border-violet-700 shadow-md' 
                                : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!currentFeedback && (
                <button 
                    onClick={checkAnswer} 
                    disabled={!currentAnswer} 
                    className="mt-4 w-full px-4 py-3 bg-gradient-bio-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                >
                    Check Answer
                </button>
            )}
            {currentFeedback && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 text-sm animate-fade-in ${currentFeedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    {currentFeedback.text}
                </div>
            )}
        </div>
    );

    const theoryVisual = (() => {
        const t = currentExercise.title.toLowerCase();
        if (t.includes('glycolysis')) return <GlycolysisVisual />;
        if (t.includes('krebs') || t.includes('citric')) return <KrebsCycleVisual />;
        if (t.includes('electron') || t.includes('etc')) return <ETCVisual />;
        return null;
    })();

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} visual={theoryVisual} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default CellularRespiration;
