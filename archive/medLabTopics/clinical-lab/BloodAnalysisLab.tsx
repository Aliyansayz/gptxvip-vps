import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { CheckCircle, XCircle, Droplets, AlertTriangle, Stethoscope, Truck } from 'lucide-react';
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

type BloodParameter = {
  name: string;
  value: number;
  unit: string;
  normal: string;
  category: 'low' | 'normal' | 'high';
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
                    <BookOpenText className="w-5 h-5 text-red-500" />
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

                        {(analogy || application) && <hr className="border-border opacity-50" />}

                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-4 h-4 text-yellow-500" />
                                    Real Life Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-blue-500" />
                                    Clinical Application
                                </h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const TruckAnalogy = () => (
    <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Anemia = Supply Chain Crisis</h4>
        <div className="relative h-20 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
            {/* Road Markings */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-white"></div>
            
            {/* Trucks (RBCs) */}
            <div className="absolute top-2 left-[10%] animate-slide-ltr" style={{animationDuration: '4s'}}>
                <Truck className="w-8 h-8 text-red-600" />
                <div className="w-4 h-4 bg-blue-400 rounded-sm absolute -top-1 left-2 animate-bounce"></div> {/* Oxygen Box */}
            </div>
            
            {/* Few Trucks */}
            <div className="absolute bottom-2 left-[60%] animate-slide-ltr" style={{animationDuration: '5s'}}>
                <Truck className="w-8 h-8 text-red-600 opacity-50" /> 
                {/* No box */}
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic leading-tight">
            Not enough trucks (Low RBC) or trucks are empty (Low Hemoglobin) = City (Tissues) starves.
        </p>
    </div>
);

export const HbA1cAnalogyVisual = () => (
    <div className="my-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">Traffic Analogy</h4>
        <div className="flex justify-center items-center gap-6 h-24">
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-12 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center p-1 shadow-sm">
                    {/* Snapshot of traffic */}
                    <div className="w-full h-full flex flex-wrap gap-1 justify-center items-center opacity-80 mt-1">
                        <div className="w-3 h-2 bg-red-400 rounded-sm"></div>
                        <div className="w-3 h-2 bg-red-400 rounded-sm"></div>
                    </div>
                </div>
                <span className="text-[10px] mt-2 font-bold text-slate-700 dark:text-slate-300 text-center">Glucose Test</span>
                <span className="text-[8px] text-muted-foreground">Snapshot (Right Now)</span>
            </div>
            
            <div className="text-xl text-muted-foreground font-bold">VS</div>
            
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-12 bg-orange-100 dark:bg-orange-900/40 border-2 border-orange-300 dark:border-orange-700 rounded-lg flex items-center justify-center overflow-hidden relative shadow-sm">
                    {/* Traffic report graph */}
                    <svg viewBox="0 0 100 40" className="w-full h-full opacity-70">
                        <path d="M0 30 Q 25 10, 50 25 T 100 15" fill="none" stroke="currentColor" strokeWidth="4" className="text-orange-500" />
                        <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-red-500 opacity-50" />
                    </svg>
                </div>
                <span className="text-[10px] mt-2 font-bold text-orange-700 dark:text-orange-400 text-center">HbA1c Test</span>
                <span className="text-[8px] text-muted-foreground">Average (3 Months)</span>
            </div>
        </div>
    </div>
);

export const BloodAnalysisLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = exercises[step];
  const exerciseData = question as any;

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

  const getStatusColor = (param: any) => {
      if (param.category === 'low') return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      if (param.category === 'high') return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
  };

  const getStatusIcon = (param: any) => {
      if (param.category === 'low') return '↓';
      if (param.category === 'high') return '↑';
      return '✓';
  };

  const VisualContent = (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground mt-1">Review the panel below and select the best diagnosis.</p>
            </div>
        </div>

        <div className="flex-1">
            {/* Results Panel */}
            <div className="bg-muted/30 rounded-xl p-4 border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exerciseData.results?.map((param: BloodParameter, idx: number) => (
                <div 
                    key={idx}
                    className={`p-4 rounded-lg border flex flex-col justify-between ${getStatusColor(param)}`}
                >
                    <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm uppercase tracking-wide opacity-80">{param.name}</span>
                    <span className="font-bold text-lg flex items-center gap-1">
                        {param.value} <span className="text-sm font-normal opacity-70">{param.unit}</span> {getStatusIcon(param)}
                    </span>
                    </div>
                    <div className="text-xs opacity-70 border-t border-current/20 pt-2 mt-1">
                    Reference: {param.normal}
                    </div>
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
                        : 'bg-red-500 text-white border-red-600 shadow-md')
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
                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  {isCorrect ? 'Correct Diagnosis!' : 'Not quite right'}
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
                visual={question.componentId === 'blood_case_1' ? <TruckAnalogy /> : question.componentId === 'blood_case_2' ? <HbA1cAnalogyVisual /> : null} 
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
};
