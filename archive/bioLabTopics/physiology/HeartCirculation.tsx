
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { HeartIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { Activity, Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface HeartCirculationProps {
  onComplete: () => void;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

// ... TheoryPane component (unchanged) ...
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

                        
                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
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

const HeartCirculationUI: React.FC<{ question: Exercise; onAnswered: () => void }> = ({ question, onAnswered }) => {
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [heartBeating, setHeartBeating] = useState(true);

  const structures = [
    { id: 'right-atrium', name: 'Right Atrium', clickable: false },
    { id: 'right-ventricle', name: 'Right Ventricle', clickable: true },
    { id: 'pulmonary-artery', name: 'Pulmonary Artery', clickable: true },
    { id: 'lungs', name: 'Lungs', clickable: true },
    { id: 'pulmonary-veins', name: 'Pulmonary Veins', clickable: false },
    { id: 'left-atrium', name: 'Left Atrium', clickable: false },
    { id: 'left-ventricle', name: 'Left Ventricle', clickable: false },
    { id: 'aorta', name: 'Aorta', clickable: false },
  ];

  const handleStructureClick = (structureId: string) => {
    if (showResult || question.type !== 'path') return;
    
    const structure = structures.find(s => s.id === structureId);
    if (!structure?.clickable || selectedPath.includes(structureId)) return;
    
    const correctPath = (question as any).correctPath as string[];
    const newPath = [...selectedPath, structureId];
    setSelectedPath(newPath);
    
    if (newPath.length === correctPath.length) {
      const isPathCorrect = newPath.every((id, i) => id === correctPath[i]);
      setIsCorrect(isPathCorrect);
      setShowResult(true);
      if (isPathCorrect) {
          toast.success("Correct path!");
          onAnswered();
      }
      else toast.error("Incorrect path. Try again.");
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if(showResult) return;
    const correct = answer === question.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) {
        toast.success("Correct!");
        onAnswered();
    }
    else toast.error("Incorrect.");
  };

  const isSelected = (id: string) => selectedPath.includes(id);
  const getSelectionOrder = (id: string) => selectedPath.indexOf(id) + 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
              <h3 className="font-heading text-3xl tracking-wider text-card-foreground">{question.title}</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">Cardiovascular System</p>
          </div>
      </div>
      <p className="text-muted-foreground text-lg">{question.prompt}</p>

      {/* Realistic Heart Visualization */}
      <div className="mb-6 mt-4 flex justify-center">
          <div className="relative w-full max-w-lg">
            <svg 
              viewBox="0 0 400 380" 
              className={`w-full h-auto drop-shadow-xl ${heartBeating ? 'animate-pulse' : ''}`}
              style={{ animationDuration: '1.2s' }}
            >
              {/* Lungs */}
              <g 
                onClick={() => handleStructureClick('lungs')}
                className={`cursor-pointer transition-all duration-300 ${isSelected('lungs') ? 'opacity-100 filter brightness-110' : 'hover:opacity-90'}`}
              >
                <path d="M 40 100 Q 20 150, 30 220 Q 40 280, 80 300 Q 120 310, 140 280 Q 150 240, 145 180 Q 140 120, 100 90 Q 60 70, 40 100" fill="#f472b6" stroke="#db2777" strokeWidth="2"/>
                <path d="M 360 100 Q 380 150, 370 220 Q 360 280, 320 300 Q 280 310, 260 280 Q 250 240, 255 180 Q 260 120, 300 90 Q 340 70, 360 100" fill="#f472b6" stroke="#db2777" strokeWidth="2"/>
                <text x="65" y="200" fontSize="12" fill="white" fontWeight="bold">Lungs</text>
                <text x="305" y="200" fontSize="12" fill="white" fontWeight="bold">Lungs</text>
                {isSelected('lungs') && (<circle cx="85" cy="180" r="14" fill="#eab308" stroke="white" strokeWidth="2"></circle>)}
                 {isSelected('lungs') && (<text x="85" y="185" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">{getSelectionOrder('lungs')}</text>)}
              </g>

              {/* Pulmonary Arteries */}
              <g onClick={() => handleStructureClick('pulmonary-artery')} className={`cursor-pointer transition-all duration-300 ${isSelected('pulmonary-artery') ? 'opacity-100 filter brightness-110' : 'hover:opacity-90'}`}>
                <path d="M 200 130 Q 180 110, 150 105 Q 120 100, 100 120" fill="none" stroke={isSelected('pulmonary-artery') ? '#3b82f6' : '#60a5fa'} strokeWidth="14" strokeLinecap="round"/>
                <path d="M 200 130 Q 220 110, 250 105 Q 280 100, 300 120" fill="none" stroke={isSelected('pulmonary-artery') ? '#3b82f6' : '#60a5fa'} strokeWidth="14" strokeLinecap="round"/>
                {isSelected('pulmonary-artery') && (<circle cx="200" cy="120" r="14" fill="#eab308" stroke="white" strokeWidth="2" />)}
              </g>

              {/* Heart Body */}
              <g>
                <path d="M 200 300 Q 130 260, 135 190 Q 140 140, 165 130 Q 185 125, 200 140 Q 215 125, 235 130 Q 260 140, 265 190 Q 270 260, 200 300" fill="url(#heartGradient)" stroke="#7f1d1d" strokeWidth="3"/>
                <line x1="200" y1="140" x2="200" y2="290" stroke="#7f1d1d" strokeWidth="2" opacity="0.3" />
              </g>
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#991b1b" /></linearGradient>
              </defs>

              {/* Chambers - Right Ventricle */}
              <g onClick={() => handleStructureClick('right-ventricle')} className={`cursor-pointer ${isSelected('right-ventricle') ? '' : 'hover:opacity-80'}`}>
                <path d="M 155 200 L 195 200 L 195 270 L 175 285 L 155 270 Z" fill={isSelected('right-ventricle') ? '#3b82f6' : '#1e3a8a'} fillOpacity="0.4" stroke="white" strokeWidth="1" />
                <text x="175" y="240" fontSize="10" fill="white" textAnchor="middle" fontWeight="600">RV</text>
                {isSelected('right-ventricle') && (<circle cx="175" cy="240" r="14" fill="#eab308" stroke="white" strokeWidth="2"></circle>)}
              </g>
              
              {/* Chambers - Left Ventricle */}
              <g>
                <path d="M 205 200 L 245 200 L 245 270 L 225 285 L 205 270 Z" fill="#991b1b" fillOpacity="0.4" stroke="white" strokeWidth="2" />
                <text x="225" y="240" fontSize="10" fill="white" textAnchor="middle" fontWeight="600">LV</text>
                <text x="225" y="260" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle">Thick Wall</text>
              </g>

              {/* Selection Indicators */}
              {isSelected('right-ventricle') && (<text x="175" y="244" fontSize="10" fill="black" textAnchor="middle" fontWeight="bold">{getSelectionOrder('right-ventricle')}</text>)}
              {isSelected('pulmonary-artery') && (<text x="200" y="124" fontSize="10" fill="black" textAnchor="middle" fontWeight="bold">{getSelectionOrder('pulmonary-artery')}</text>)}
            </svg>
          </div>
      </div>

      {question.type === 'path' && (
        <>
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-muted/30 rounded-xl border border-dashed">
                <span className="text-sm font-semibold text-muted-foreground mr-2">Path:</span>
                <span className="bg-card border px-3 py-1 rounded-full text-xs font-bold text-foreground">1. Right Atrium</span>
                {selectedPath.map((id, i) => (
                    <React.Fragment key={id}>
                        <span className="text-muted-foreground">→</span>
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            {i + 2}. {structures.find(s => s.id === id)?.name}
                        </span>
                    </React.Fragment>
                ))}
                {selectedPath.length < 3 && <span className="text-sm text-muted-foreground italic ml-2 animate-pulse">Select next structure...</span>}
            </div>
            {!showResult && selectedPath.length > 0 && (
                <button 
                    className="w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    onClick={() => setSelectedPath([])}
                >
                    Reset Path
                </button>
            )}
        </>
      )}

      {question.type === 'select' && (
        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((option) => (
            <button
              key={option}
              className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl border-2 transition-all ${
                  selectedAnswer === option 
                    ? (isCorrect ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300')
                    : 'bg-card hover:bg-muted hover:border-primary/50'
              }`}
              onClick={() => handleSelectAnswer(option)}
              disabled={showResult}
            >
              <span className="text-base font-medium">{option}</span>
            </button>
          ))}
        </div>
      )}

      {/* Result Feedback */}
      {showResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
          <div className="mt-0.5">
            {isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" /> : <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />}
          </div>
          <div>
            <span className="block font-bold text-sm mb-1">{isCorrect ? 'Excellent!' : 'Not quite right'}</span>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};


export const ValveVisual = () => (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">One-Way Flow</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="relative w-16 h-8 border-2 border-red-500 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-red-400 opacity-20"></div>
                <div className="w-1 h-full bg-red-600 rotate-12 origin-top"></div>
            </div>
            <div className="text-red-500 font-bold text-xl">→</div>
            <div className="w-16 h-8 border-2 border-red-500 rounded-full bg-red-400 opacity-40"></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Valves prevent backflow, keeping blood moving in one direction.</p>
    </div>
);

export const HeartCirculation: React.FC<HeartCirculationProps> = ({ onComplete, step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  if (!currentExercise) return null;

  const theoryVisual = currentExercise.type === "path" ? <ValveVisual /> : null;

  const ExerciseContent = <HeartCirculationUI question={currentExercise} onAnswered={() => {}} />;

  return (
    <>
        {infoVisible && infoPlacement === 'side' ? (
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-lg border">{ExerciseContent}</div>
                <aside className="lg:col-span-1 sticky top-24 h-fit">
                    <TheoryPane exercise={currentExercise} visual={theoryVisual} />
                </aside>
            </div>
        ) : (
            <div className="bg-card p-6 rounded-lg border">
                {ExerciseContent}
            </div>
        )}

        {infoVisible && infoPlacement === 'bottom' && (
            <div className="mt-6">
                <TheoryPane exercise={currentExercise} visual={theoryVisual} />
            </div>
        )}
    </>
  );
};
