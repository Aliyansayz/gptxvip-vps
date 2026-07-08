import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Scissors, Target, ChevronRightIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from 'lucide-react';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface GeneticEngineeringProps {
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

type CrisprStep = 'guide-rna' | 'target' | 'cut' | 'edit' | 'repair';

const crisprSteps: { id: CrisprStep; label: string; description: string }[] = [
  { id: 'guide-rna', label: 'Design Guide RNA', description: 'Create RNA sequence matching target gene' },
  { id: 'target', label: 'Target DNA', description: 'Guide RNA binds to complementary DNA sequence' },
  { id: 'cut', label: 'Cas9 Cuts', description: 'Cas9 enzyme makes double-strand break' },
  { id: 'edit', label: 'Insert/Delete', description: 'Add new gene or remove defective sequence' },
  { id: 'repair', label: 'DNA Repair', description: 'Cell repairs DNA with desired changes' },
];

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

const GeneticEngineering: React.FC<GeneticEngineeringProps> = ({ 
  labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings 
}) => {
  const [completedSteps, setCompletedSteps] = useState<CrisprStep[]>([]);
  const [crisprStep, setCrisprStep] = useState<CrisprStep>('guide-rna');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentExercise = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  if (!currentExercise) return null;

  const handleNext = () => {
      if (step < exercises.length - 1) {
          setStep(step + 1);
      } else {
          onComplete();
      }
  };

  const handleCrisprStep = (stepId: CrisprStep) => {
    if (showResult || completedSteps.includes(stepId)) return;
    
    const expectedStep = crisprSteps[completedSteps.length].id;
    if (stepId === expectedStep) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      setCrisprStep(stepId);
      
      if (newCompleted.length === 5) {
        setIsCorrect(true);
        setShowResult(true);
        toast.success("CRISPR Sequence Complete!");
      }
    } else {
        toast.error("Incorrect step order. Follow the biological process.");
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
      if (!selectedAnswer) return;
      
      const correct = selectedAnswer === currentExercise.answer;
      setIsCorrect(correct);
      setShowResult(true);
      
      if (correct) {
          toast.success("Correct!");
      } else {
          toast.error("Incorrect. Try again.");
      }
  };

  const VisualContent = (
    <div className="w-full flex flex-col items-center justify-center min-h-[300px] bg-card/50 rounded-xl p-6">
      {currentExercise.type === 'crispr' ? (
        <div className="relative w-full max-w-2xl">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Scissors className="w-3 h-3" />
            <span>CRISPR-Cas9 Gene Editing</span>
            </div>

            <svg viewBox="0 0 500 200" className="w-full h-auto bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30">
            {/* DNA Double Helix */}
            <g className="dna-strand">
                {/* Top strand */}
                <path 
                d="M 50 70 Q 100 50, 150 70 Q 200 90, 250 70 Q 300 50, 350 70 Q 400 90, 450 70" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="8"
                strokeLinecap="round"
                />
                {/* Bottom strand */}
                <path 
                d="M 50 130 Q 100 150, 150 130 Q 200 110, 250 130 Q 300 150, 350 130 Q 400 110, 450 130" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="8"
                strokeLinecap="round"
                />
                {/* Base pairs */}
                {[80, 120, 160, 200, 280, 320, 360, 400].map((x, i) => (
                <line key={i} x1={x} y1="75" x2={x} y2="125" stroke="currentColor" className="text-slate-400" strokeWidth="3" />
                ))}
                
                {/* Target site */}
                <rect x="220" y="60" width="60" height="80" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" rx="5" />
                <text x="250" y="55" textAnchor="middle" className="text-[10px] fill-amber-600 font-medium">Target</text>
            </g>

            {/* Cas9 enzyme */}
            {completedSteps.includes('target') && (
                <g className="animate-pulse">
                <ellipse cx="250" cy="100" rx="40" ry="25" fill="#10b981" opacity="0.8" />
                <text x="250" y="105" textAnchor="middle" className="text-[11px] fill-white font-bold">Cas9</text>
                </g>
            )}

            {/* Cut indicator */}
            {completedSteps.includes('cut') && (
                <g>
                <line x1="250" y1="60" x2="250" y2="140" stroke="#dc2626" strokeWidth="3" strokeDasharray="8,4" />
                <text x="250" y="160" textAnchor="middle" className="text-[10px] fill-red-600">✂️ Cut</text>
                </g>
            )}

            {/* New gene insertion */}
            {completedSteps.includes('edit') && (
                <g>
                <rect x="235" y="85" width="30" height="30" fill="#8b5cf6" rx="3" />
                <text x="250" y="105" textAnchor="middle" className="text-[9px] fill-white font-bold">NEW</text>
                </g>
            )}

            {/* Repair complete */}
            {completedSteps.includes('repair') && (
                <g>
                <circle cx="250" cy="30" r="15" fill="#22c55e" />
                <text x="250" y="35" textAnchor="middle" className="text-sm fill-white">✓</text>
                </g>
            )}

            {/* Guide RNA */}
            {completedSteps.includes('guide-rna') && (
                <g>
                <path d="M 250 180 L 250 145" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
                <text x="250" y="195" textAnchor="middle" className="text-[10px] fill-orange-600">Guide RNA</text>
                </g>
            )}

            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                </marker>
            </defs>
            </svg>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Progress: {completedSteps.length}/5 steps
            </p>
        </div>
      ) : (
        <div className="text-center p-8">
            <Target className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-foreground mb-2">Genetic Engineering Concept</h3>
            <p className="text-muted-foreground max-w-md">
                Select the correct answer to verify your understanding of genetic engineering principles.
            </p>
        </div>
      )}
    </div>
  );

  const InteractionContent = (
    <div className="space-y-6 w-full">
        {currentExercise.type === 'crispr' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
              {crisprSteps.map((s, index) => {
                const isCompleted = completedSteps.includes(s.id);
                const isNext = completedSteps.length === index;
                
                return (
                  <button
                    key={s.id}
                    onClick={() => handleCrisprStep(s.id)}
                    disabled={showResult}
                    className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-full
                        ${isCompleted 
                            ? "bg-emerald-500 text-white border-emerald-600" 
                            : isNext 
                                ? "bg-card border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg scale-105" 
                                : "bg-card border-border text-muted-foreground opacity-70 hover:opacity-100"
                        }
                    `}
                  >
                    <span className="text-xs font-bold mb-1">{index + 1}. {s.label}</span>
                    {isCompleted && <CheckCircle className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-3">
                {currentExercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`
                            w-full p-4 text-left rounded-lg border transition-all
                            ${selectedAnswer === option 
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium ring-1 ring-emerald-500" 
                                : "bg-card border-border hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
                            }
                            ${showResult && option === currentExercise.answer ? "bg-green-100 border-green-500 dark:bg-green-900/20" : ""}
                            ${showResult && selectedAnswer === option && option !== currentExercise.answer ? "bg-red-100 border-red-500 dark:bg-red-900/20" : ""}
                        `}
                    >
                        {option}
                    </button>
                ))}
                {!showResult && (
                    <button 
                        onClick={checkAnswer} 
                        disabled={!selectedAnswer}
                        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Check Answer
                    </button>
                )}
            </div>
        )}

        {showResult && (
            <div className={`p-4 rounded-lg border-l-4 animate-fade-in ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                <div className="flex items-start gap-3">
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                        <p className="font-bold text-foreground">{isCorrect ? 'Correct!' : 'Not quite right'}</p>
                        <p className="text-sm text-muted-foreground mt-1">{currentExercise.explanation}</p>
                    </div>
                </div>
                <button 
                    onClick={handleNext} 
                    className="mt-4 w-full px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                    {step < exercises.length - 1 ? 'Next Question' : 'Complete Chapter'} <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        )}
    </div>
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

export default GeneticEngineering;
