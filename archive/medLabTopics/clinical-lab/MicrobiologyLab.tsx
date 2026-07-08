import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, Microscope } from 'lucide-react';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  labData: any;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode; chapterTitle?: string }> = ({ exercise, visual, chapterTitle }) => {
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
                    <BookOpenText className="w-5 h-5 text-purple-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton 
                        theory={exercise.theory} 
                        courseType="med" 
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
                    
                    {visual && (
                        <div className="my-6">
                            {visual}
                        </div>
                    )}

                    {analogy && (
                        <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-200 dark:border-purple-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-purple-500" /> Analogy
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

const GramStainVisual = ({ type }: { type: 'positive' | 'negative' }) => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Microscope View (1000x)</h5>
        <div className="w-40 h-40 rounded-full bg-white border-4 border-slate-300 overflow-hidden relative shadow-inner flex items-center justify-center">
            {/* Background light */}
            <div className="absolute inset-0 bg-yellow-50/50"></div>
            
            {type === 'positive' ? (
                // Purple Clusters (Staph)
                <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                    <g fill="#7e22ce">
                        <circle cx="30" cy="30" r="4" />
                        <circle cx="35" cy="34" r="4" />
                        <circle cx="28" cy="36" r="4" />
                        <circle cx="32" cy="26" r="4" />
                        
                        <circle cx="60" cy="60" r="4" />
                        <circle cx="65" cy="64" r="4" />
                        <circle cx="58" cy="66" r="4" />
                        
                        <circle cx="70" cy="30" r="4" />
                        <circle cx="75" cy="34" r="4" />
                    </g>
                </svg>
            ) : (
                // Pink Rods (E. coli)
                <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                    <g fill="#ec4899">
                        <rect x="20" y="20" width="12" height="6" rx="3" transform="rotate(15 26 23)" />
                        <rect x="40" y="50" width="12" height="6" rx="3" transform="rotate(-10 46 53)" />
                        <rect x="70" y="30" width="12" height="6" rx="3" transform="rotate(45 76 33)" />
                        <rect x="60" y="70" width="12" height="6" rx="3" transform="rotate(5 66 73)" />
                        <rect x="30" y="80" width="12" height="6" rx="3" transform="rotate(-20 36 83)" />
                    </g>
                </svg>
            )}
        </div>
        <div className="mt-2 text-xs font-bold flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${type === 'positive' ? 'bg-purple-700' : 'bg-pink-500'}`}></span>
            {type === 'positive' ? 'Gram Positive (Purple)' : 'Gram Negative (Pink)'}
        </div>
    </div>
);

// --- Visual Analogy ---
export const GramStainMechanismVisual = () => (
    <div className="my-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">The "Sponge" Analogy</h4>
        <div className="flex justify-around items-end h-32">
            {/* Gram Positive */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex flex-col justify-end">
                     {/* Thick Peptidoglycan Layer */}
                    <div className="w-full h-16 bg-purple-600 rounded-t-lg border-2 border-purple-800 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmZmIiAvPjwvc3ZnPg==')]"></div>
                        <span className="text-white text-[10px] font-bold text-center leading-tight z-10">Thick Peptidoglycan<br/>(Traps Dye)</span>
                    </div>
                    {/* Membrane */}
                    <div className="w-full h-6 bg-yellow-200 border-2 border-yellow-400 rounded-b-lg flex items-center justify-center">
                        <span className="text-[8px] font-bold text-yellow-800">Plasma Membrane</span>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700">Gram Positive</span>
            </div>
            
            {/* Gram Negative */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex flex-col justify-end">
                    {/* Outer Membrane */}
                    <div className="w-full h-6 bg-pink-300 border-2 border-pink-500 rounded-t-lg flex items-center justify-center">
                         <span className="text-[8px] font-bold text-pink-900">Outer Membrane</span>
                    </div>
                    {/* Thin Peptidoglycan */}
                    <div className="w-full h-4 bg-purple-300 border-x-2 border-purple-400 flex items-center justify-center">
                         <span className="text-[8px] font-bold text-purple-900">Thin Wall</span>
                    </div>
                     {/* Inner Membrane */}
                    <div className="w-full h-6 bg-yellow-200 border-2 border-yellow-400 rounded-b-lg flex items-center justify-center">
                        <span className="text-[8px] font-bold text-yellow-800">Plasma Membrane</span>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-pink-600">Gram Negative</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-muted-foreground italic leading-tight">
            Gram Positive bacteria have a thick "sponge" wall that traps the purple crystal violet dye. Gram Negative have a thin wall protected by an outer membrane; the dye washes out, taking the pink counter-stain instead.
        </p>
    </div>
);

export const BacteriaShapesVisual = () => (
    <div className="my-4 p-4 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-900">
        <h4 className="text-[10px] font-bold text-fuchsia-600 uppercase tracking-widest text-center mb-4">Analogy: Pathogen Shapes</h4>
        <div className="flex justify-center items-center gap-6 h-28">
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
                    {/* Purple Grapes */}
                    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
                        <g fill="#7e22ce">
                            <circle cx="40" cy="40" r="12" />
                            <circle cx="60" cy="40" r="12" />
                            <circle cx="50" cy="60" r="12" />
                            <circle cx="40" cy="55" r="12" />
                            <circle cx="60" cy="55" r="12" />
                            <circle cx="50" cy="30" r="12" />
                        </g>
                    </svg>
                </div>
                <span className="text-[10px] mt-2 font-bold text-purple-700 dark:text-purple-400 text-center">Gram+ Cocci</span>
                <span className="text-[8px] text-muted-foreground">"Purple Grapes"</span>
            </div>
            
            <div className="text-xl text-muted-foreground font-bold opacity-50">VS</div>
            
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
                    {/* Pink Hot Dogs */}
                    <svg viewBox="0 0 100 100" className="w-full h-full p-2 drop-shadow-md">
                        <g fill="#ec4899">
                            <rect x="25" y="35" width="50" height="20" rx="10" transform="rotate(-15 50 45)" />
                            <rect x="20" y="65" width="40" height="15" rx="7.5" transform="rotate(25 40 70)" />
                        </g>
                    </svg>
                </div>
                <span className="text-[10px] mt-2 font-bold text-pink-700 dark:text-pink-400 text-center">Gram- Rods</span>
                <span className="text-[8px] text-muted-foreground">"Pink Hot Dogs"</span>
            </div>
        </div>
    </div>
);

export const MicrobiologyLab: React.FC<ChapterProps> = ({ labData, step, exercises, infoVisible, infoPlacement, settings }) => {
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
    if(correct) toast.success("Correct Identification"); else toast.error("Incorrect Identification");
  };

  const VisualContent = (
    <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-3 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Microscope className="w-6 h-6" />
            <span className="font-semibold">Microscope View</span>
        </div>
        {/* Visual for the Question */}
        <div className="flex justify-center">
             {question.componentId.includes('gram_pos') ? <GramStainVisual type="positive" /> : <GramStainVisual type="negative" />}
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
                        : 'bg-purple-500 text-white border-purple-600 shadow-md')
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
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Identify Organism
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
                visual={question.componentId === 'micro_case_1' ? <GramStainMechanismVisual /> : question.componentId === 'micro_case_2' ? <BacteriaShapesVisual /> : null} 
                chapterTitle={labData.chapter_title}
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
}
