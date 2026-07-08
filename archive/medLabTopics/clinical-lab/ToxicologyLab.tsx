import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;

    const { title, content, analogy } = exercise.theory;

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
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    
                    {visual && (
                        <div className="my-6">
                            {visual}
                        </div>
                    )}

                    {analogy && (
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-200 dark:border-orange-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-orange-500" /> Analogy
                            </h4>
                            <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    );
};

const DrugScreenVisual = ({ positiveDrug }: { positiveDrug?: string }) => {
    const drugs = ['OPI', 'COC', 'AMP', 'THC'];

    const Strip = ({ label, isPositive }: { label: string, isPositive: boolean, key?: any }) => (
        <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-24 bg-white border border-slate-300 rounded-sm relative shadow-sm flex flex-col items-center pt-2">
                {/* Control Line (Always present) */}
                <div className="w-6 h-1 bg-red-500 rounded-full mb-4"></div>
                <span className="text-[8px] text-slate-400 -mt-4 mb-4">C</span>

                {/* Test Line (Absent if positive) */}
                {!isPositive && <div className="w-6 h-1 bg-red-500 rounded-full"></div>}
                <span className="text-[8px] text-slate-400 -mt-1">T</span>
                
                {/* Absorbent Pad */}
                <div className="absolute bottom-0 w-full h-4 bg-slate-200 border-t border-slate-300"></div>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
        </div>
    );

    return (
        <div className="my-4 p-6 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-4 tracking-wider">5-Panel Urine Screen</h5>
            <div className="flex gap-4 flex-wrap justify-center">
                {drugs.map(drug => (
                    <Strip key={drug} label={drug} isPositive={drug === positiveDrug} />
                ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground italic text-center max-w-xs">
                *Note: In drug screens, the <strong>absence</strong> of a Test (T) line indicates a positive result.
            </div>
        </div>
    );
};

// --- Visual Analogy ---
export const AntibodyKeyVisual = () => (
    <div className="my-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">Antibodies = "Custom Keys"</h4>
        <div className="flex justify-around items-center h-24">
            {/* Drug Molecule */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center relative">
                    <div className="w-6 h-6 bg-red-500 rounded-sm transform rotate-45"></div>
                    <span className="absolute -bottom-6 text-[10px] font-bold text-muted-foreground">Drug (Antigen)</span>
                </div>
            </div>

            {/* Arrow */}
            <div className="text-orange-400">➜</div>

            {/* Antibody Capture */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 border-2 border-orange-400 rounded-lg flex items-center justify-center relative bg-white dark:bg-slate-900">
                    {/* Y-Shape Antibody */}
                    <svg width="40" height="40" viewBox="0 0 40 40" className="absolute opacity-20">
                        <path d="M10 10 L20 25 L30 10 M20 25 L20 40" stroke="orange" strokeWidth="4" fill="none" />
                    </svg>
                    {/* Trapped Drug */}
                    <div className="w-4 h-4 bg-red-500 rounded-sm transform rotate-45 animate-pulse"></div>
                </div>
                <span className="text-[10px] font-bold text-orange-600">Captured!</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-muted-foreground italic leading-tight">
            The test strip has special Y-shaped antibodies designed to grab ONLY specific drug molecules, like a key fitting into a lock.
        </p>
    </div>
);

export const ToxicologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  if (!question) return null;

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) toast.success("Correct Interpretation"); else toast.error("Incorrect Interpretation");
  };

  // Determine positive drug based on title/content
  let positiveDrug: string | undefined = undefined;
  if (question.title.includes('Opioid')) positiveDrug = 'OPI';
  if (question.title.includes('Cocaine')) positiveDrug = 'COC';

  const VisualContent = (
    <div className="w-full space-y-6">
        <div className="flex items-center gap-3 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-semibold">Toxicology Screen</span>
        </div>
        {/* Visual for the Question */}
        <div className="flex justify-center">
             <DrugScreenVisual positiveDrug={positiveDrug} />
        </div>
    </div>
  );

  const InteractionContent = (
      <div className="space-y-4">
        <p className="font-semibold">{question.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options?.map((option) => (
            <button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswer === option
                    ? (showResult 
                        ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                        : 'bg-orange-500 text-white border-orange-600 shadow-md')
                    : 'bg-card hover:bg-muted'
            } ${showResult ? 'opacity-90 cursor-not-allowed' : ''}`}
            >
            <span className="font-medium">{option}</span>
            </button>
        ))}
        </div>

        {!showResult && (
            <button 
                onClick={handleCheck} 
                disabled={!selectedAnswer} 
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Confirm Result
            </button>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
            {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div>
              <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
  );

  return (
    <MedLabLayout
        title={question.title}
        prompt={question.prompt}
        visualContent={VisualContent}
        interactionContent={InteractionContent}
        theoryContent={
            <TheoryPane 
                exercise={question} 
                visual={<AntibodyKeyVisual />} 
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
};
