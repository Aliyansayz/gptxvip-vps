import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, FlaskConical } from 'lucide-react';
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

type UrineParameter = {
  name: string;
  result: string;
  normal: string;
  abnormal: boolean;
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
                    <BookOpenText className="w-5 h-5 text-amber-500" />
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
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
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

// --- Visual Analogy ---
export const LemonadeAnalogy = () => (
    <div className="my-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
        <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center mb-4">Specific Gravity Analogy</h4>
        <div className="flex justify-around items-end h-24">
            <div className="flex flex-col items-center">
                <div className="w-12 h-16 bg-yellow-100 border-2 border-yellow-300 rounded-b-lg relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[80%] bg-yellow-100 opacity-50"></div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-[10px] mt-1 font-bold">Dilute (1.005)</span>
                <span className="text-[9px] text-muted-foreground">Watery</span>
            </div>
            
            <div className="flex flex-col items-center">
                <div className="w-12 h-16 bg-amber-500/20 border-2 border-amber-600 rounded-b-lg relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[80%] bg-amber-500 opacity-80"></div>
                    <div className="flex justify-center gap-1 mt-8">
                        <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                    </div>
                </div>
                <span className="text-[10px] mt-1 font-bold">Conc. (1.030)</span>
                <span className="text-[9px] text-muted-foreground">Syrupy</span>
            </div>
        </div>
    </div>
);

export const BurglarAnalogyVisual = () => (
    <div className="my-4 p-4 bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-100 dark:border-sky-900">
        <h4 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest text-center mb-4">Analogy: The Burglar's Footprints</h4>
        <div className="flex justify-center items-center gap-8 h-24">
            <div className="relative flex flex-col items-center">
                {/* Clean Hallway */}
                <div className="w-16 h-12 border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                </div>
                <span className="text-[10px] mt-2 font-bold text-slate-500">Negative Nitrites</span>
            </div>
            
            <div className="text-xl text-muted-foreground font-bold">VS</div>
            
            <div className="relative flex flex-col items-center">
                {/* Footprints in Hallway */}
                <div className="w-16 h-12 border-2 border-red-300 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-950 flex justify-center items-center relative overflow-hidden">
                    <div className="absolute top-2 left-2 w-2 h-3 bg-red-400 rounded-full opacity-60 rotate-45"></div>
                    <div className="absolute bottom-2 right-4 w-2 h-3 bg-red-400 rounded-full opacity-60 rotate-45"></div>
                    <div className="absolute top-4 left-6 w-2 h-3 bg-red-400 rounded-full opacity-60 rotate-45"></div>
                </div>
                <span className="text-[10px] mt-2 font-bold text-red-500">Positive Nitrites</span>
            </div>
        </div>
    </div>
);

export const UrinalysisLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
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
    if(correct) toast.success("Correct Diagnosis"); else toast.error("Incorrect Diagnosis");
  };

  const exerciseData = question as any;

  const VisualContent = (
      <div className="flex flex-col gap-6 w-full">
          <div className="flex-1">
              {/* Urinalysis Results */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900">
              <div className="text-sm font-bold mb-4 text-amber-800 dark:text-amber-400 uppercase tracking-wide">Lab Report: Urinalysis</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exerciseData.results?.map((param: UrineParameter, idx: number) => (
                  <div 
                      key={idx}
                      className={`p-3 rounded-lg border flex flex-col justify-between ${
                      param.abnormal 
                          ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900' 
                          : 'bg-card border-border'
                      }`}
                  >
                      <div className="text-sm font-semibold text-foreground mb-1">{param.name}</div>
                      <div className={`text-xl font-bold ${param.abnormal ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {param.result}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Ref: {param.normal}</div>
                  </div>
                  ))}
              </div>
              </div>
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
                        : 'bg-amber-500 text-white border-amber-600 shadow-md')
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
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Confirm Diagnosis
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
                visual={question.componentId === 'urinalysis_case_1' ? <LemonadeAnalogy /> : question.componentId === 'urinalysis_case_2' ? <BurglarAnalogyVisual /> : null} 
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
}
