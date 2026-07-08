import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { ChevronRightIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode; chapterTitle?: string }> = ({ exercise, visual, chapterTitle }) => {
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
                    <SaveTheoryButton 
                        theory={exercise.theory} 
                        courseType="bio" 
                        chapterTitle={chapterTitle}
                        exerciseTitle={exercise.title}
                    />
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

export const OsmosisTheoryVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Osmosis Principle</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
                <div className="w-12 h-16 border-2 border-blue-300 border-r-0 rounded-l-lg bg-blue-100 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-3/4 bg-blue-400/50"></div>
                    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="absolute top-4 right-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-[8px] mt-1 text-center">Low Solute<br/>(High Water)</div>
            </div>
            <div className="h-16 w-1 bg-blue-300 border-x border-dashed border-blue-500"></div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-16 border-2 border-blue-300 border-l-0 rounded-r-lg bg-blue-100 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1/2 bg-blue-400/50"></div>
                    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="absolute top-4 right-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="absolute bottom-4 right-2 w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-[8px] mt-1 text-center">High Solute<br/>(Low Water)</div>
            </div>
        </div>
        <div className="flex justify-center mt-2">
             <div className="text-blue-500 text-lg animate-pulse">➡️</div>
        </div>
        <p className="text-[10px] text-center mt-1 text-muted-foreground italic">Water moves to dilute the concentrated side.</p>
    </div>
);

export const ActiveTransportTheoryVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Active Transport</h4>
        <div className="flex flex-col items-center gap-2">
            <div className="text-[8px] font-bold text-muted-foreground">Low Concentration</div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="w-32 h-8 bg-purple-200 rounded-lg flex items-center justify-center relative border border-purple-400">
                <span className="text-[8px] font-bold text-purple-700">Protein Pump</span>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                    <div className="text-[8px] font-bold text-yellow-600">⚡ ATP</div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="text-[8px] font-bold text-muted-foreground">High Concentration</div>
        </div>
        <div className="flex justify-center mt-2">
             <div className="text-purple-500 text-lg">⬆️</div>
        </div>
        <p className="text-[10px] text-center mt-1 text-muted-foreground italic">Moving "uphill" against the crowd requires energy.</p>
    </div>
);

// --- Exercise UIs ---

export const OsmosisVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [concentrationLeft, setConcentrationLeft] = useState(80);
    const [concentrationRight, setConcentrationRight] = useState(20);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleOsmosis = () => {
        if (concentrationLeft > concentrationRight && !isAnimating) {
            setIsAnimating(true);
            const interval = setInterval(() => {
                setConcentrationLeft(prev => {
                    if (prev <= 50) {
                        clearInterval(interval);
                        setIsAnimating(false);
                        toast.success("Equilibrium reached!");
                        return 50;
                    }
                    return prev - 2;
                });
                setConcentrationRight(prev => prev < 50 ? prev + 2 : 50);
            }, 50);
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                {/* Left container */}
                <div className="relative w-32 h-40 bg-violet-500/20 rounded-lg border-2 border-violet-500/40 overflow-hidden shadow-inner">
                    <div className="absolute bottom-0 w-full bg-violet-500/50 transition-all duration-300 ease-linear" style={{ height: `${concentrationLeft}%` }} />
                    <div className="absolute top-2 left-2 text-xs font-bold text-primary-foreground bg-card/50 px-1 rounded">{concentrationLeft}%</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-foreground bg-card/40 px-2 py-0.5 rounded-full whitespace-nowrap">High Solute</div>
                </div>

                {/* Membrane */}
                <div className="flex flex-col items-center">
                    <div className="w-2 h-40 bg-gradient-bio-accent rounded-full relative shadow-md"></div>
                    <span className="text-[10px] mt-1 text-muted-foreground font-medium">Membrane</span>
                </div>

                {/* Right container */}
                <div className="relative w-32 h-40 bg-violet-500/10 rounded-lg border-2 border-violet-500/20 overflow-hidden shadow-inner">
                    <div className="absolute bottom-0 w-full bg-violet-500/40 transition-all duration-300 ease-linear" style={{ height: `${concentrationRight}%` }} />
                    <div className="absolute top-2 right-2 text-xs font-bold text-violet-500 bg-card/50 px-1 rounded">{concentrationRight}%</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-foreground bg-card/40 px-2 py-0.5 rounded-full whitespace-nowrap">Low Solute</div>
                </div>
            </div>

            <button 
              onClick={handleOsmosis} 
              disabled={isAnimating || concentrationLeft <= 50}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 text-sm shadow-md transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Start Osmosis
            </button>
        </div>
    );
};

export const ActiveTransportVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [isPumping, setIsPumping] = useState(false);
    const pumpMolecule = () => {
        setIsPumping(true);
        setTimeout(() => setIsPumping(false), 1500);
    }
    return (
        <div className="space-y-4 w-full">
            <style>{`@keyframes pump-molecule { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-100px); opacity: 0; } } .animate-pump { animation: pump-molecule 1.5s ease-in forwards; }`}</style>
            <div className="w-full max-w-sm mx-auto aspect-video bg-background/50 rounded-lg border p-4 flex items-center justify-center">
                 <svg viewBox="0 0 100 60" className="w-full h-auto">
                    <rect x="0" y="25" width="100" height="10" fill="#e9d5ff" stroke="hsla(var(--accent), 0.5)"/>
                    <path d="M 40 35 C 40 45, 60 45, 60 35 L 60 25 C 60 15, 40 15, 40 25 Z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.5"/>
                    <text x="50" y="55" fontSize="4" fontWeight="bold" fill="hsl(var(--muted-foreground))" textAnchor="middle">Low Concentration</text>
                    <circle cx="30" cy="45" r="2.5" fill="#22c55e"/><circle cx="70" cy="48" r="2.5" fill="#22c55e"/>
                    <text x="50" y="10" fontSize="4" fontWeight="bold" fill="hsl(var(--muted-foreground))" textAnchor="middle">High Concentration</text>
                    <circle cx="10" cy="18" r="2.5" fill="#22c55e"/><circle cx="40" cy="20" r="2.5" fill="#22c55e"/><circle cx="90" cy="17" r="2.5" fill="#22c55e"/>
                    <g className={isPumping ? 'animate-pulse' : ''}>
                        <text x="88" y="48" fontSize="5" fontWeight="bold" fill="#f59e0b">ATP</text>
                    </g>
                    {isPumping && <circle cx="50" cy="45" r="2.5" fill="#22c55e" className="animate-pump" />}
                </svg>
            </div>
            <button onClick={pumpMolecule} disabled={isPumping} className="w-full max-w-sm mx-auto block bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 text-sm rounded-lg disabled:opacity-50">Pump Molecule (uses ATP)</button>
        </div>
    );
};

export const FacilitatedDiffusionVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [isDiffusing, setIsDiffusing] = useState(false);
    const startDiffusion = () => {
        setIsDiffusing(true);
        setTimeout(() => setIsDiffusing(false), 2000);
    }
    return (
         <div className="space-y-4 w-full">
             <style>{`@keyframes diffuse-molecule { from { transform: translateY(0); opacity: 1; } to { transform: translateY(80px); opacity: 1; } } .animate-diffuse { animation: diffuse-molecule 2s ease-in forwards; }`}</style>
            <div className="w-full max-w-sm mx-auto aspect-video bg-background/50 rounded-lg border p-4 flex items-center justify-center">
                 <svg viewBox="0 0 100 60" className="w-full h-auto">
                    <rect x="0" y="25" width="100" height="10" fill="#e9d5ff" stroke="hsla(var(--accent), 0.5)"/>
                    <path d="M 42 35 C 42 45, 58 45, 58 35 L 58 25 C 58 15, 42 15, 42 25 Z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.5"/>
                    <rect x="47" y="15" width="6" height="30" fill="#a855f7" fillOpacity="0.3" />
                    <text x="50" y="10" fontSize="4" fontWeight="bold" fill="hsl(var(--muted-foreground))" textAnchor="middle">High Concentration</text>
                    <path d="M 10 15 l 3 -5 l 3 5 l -1.5 -5 l -3 5 Z" fill="#ef4444"/><path d="M 85 15 l 3 -5 l 3 5 l -1.5 -5 l -3 5 Z" fill="#ef4444"/>
                    {isDiffusing ? <path d="M 47 20 l 3 -5 l 3 5 l -1.5 -5 l -3 5 Z" fill="#ef4444" className="animate-diffuse"/> : <path d="M 47 20 l 3 -5 l 3 5 l -1.5 -5 l -3 5 Z" fill="#ef4444" className="animate-pulse"/>}
                    <text x="50" y="55" fontSize="4" fontWeight="bold" fill="hsl(var(--muted-foreground))" textAnchor="middle">Low Concentration</text>
                    <text x="25" y="30" fontSize="3" fontWeight="bold" fill="hsl(var(--muted-foreground))">No Energy Required</text>
                </svg>
            </div>
            <button onClick={startDiffusion} disabled={isDiffusing} className="w-full max-w-sm mx-auto block bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 text-sm rounded-lg disabled:opacity-50">Start Diffusion</button>
        </div>
    );
};

export const CellularProcesses: React.FC<any> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [feedback, setFeedback] = useState<Record<string, { correct: boolean; text: string; } | null>>({});
    
    const currentExercise = exercises[step];

    const exerciseComponentMap: Record<string, React.FC<any>> = {
        'osmosis_demo': OsmosisVisual,
        'active_transport_q': ActiveTransportVisual,
        'facilitated_diffusion_q': FacilitatedDiffusionVisual,
    };

    const ActiveExerciseUI = currentExercise ? exerciseComponentMap[currentExercise.componentId] : null;

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
            {ActiveExerciseUI ? <ActiveExerciseUI exercise={currentExercise} /> : null}
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
        if (t.includes('osmosis')) return <OsmosisTheoryVisual />;
        if (t.includes('active') || t.includes('transport')) return <ActiveTransportTheoryVisual />;
        return null;
    })();

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} visual={theoryVisual} chapterTitle={labData.chapter_title} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default CellularProcesses;
