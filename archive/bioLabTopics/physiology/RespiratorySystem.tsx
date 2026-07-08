
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { WindIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface RespiratorySystemProps {
  onComplete: () => void;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
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
                    <BookOpenText className="w-5 h-5 text-sky-500" />
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

const RespiratorySystemUI: React.FC<{ question: Exercise; onAnswered: () => void }> = ({ question, onAnswered }) => {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [bloodO2, setBloodO2] = useState(40);
  const [bloodCO2, setBloodCO2] = useState(46);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        if (phase === 'inhale') {
          setBloodO2(prev => Math.min(prev + 5, 98));
          setBloodCO2(prev => Math.max(prev - 2, 40));
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isAnimating, phase]);

  const handleBreathCycle = () => {
    setIsAnimating(true);
    setPhase('inhale');
    setBloodO2(40);
    setBloodCO2(46);
    
    setTimeout(() => {
      setPhase('exhale');
    }, 2000);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 4000);
  };

  const handleAnswer = (answerIndex: number, option: string) => {
    setSelectedAnswer(answerIndex);
    const correct = option === question.answer;
    setShowResult(true);
    if(correct) {
        toast.success("Correct!");
        onAnswered();
    }
    else toast.error("Incorrect.");
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <WindIcon className="w-6 h-6 text-sky-500" />
            </div>
            <div>
                <h3 className="font-heading text-3xl tracking-wider text-card-foreground">{question.title}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Respiratory Physiology</p>
            </div>
        </div>
        
        <div className="relative bg-gradient-to-b from-sky-950 to-slate-900 rounded-xl p-4 min-h-[300px] overflow-hidden shadow-inner border border-slate-800">
            {/* Background Particles (Air) */}
            {isAnimating && phase === 'inhale' && Array.from({length: 20}).map((_, i) => (
                <div key={i} className="absolute bg-white rounded-full opacity-20 w-1 h-1 animate-ping" style={{top: '10%', left: `${Math.random()*100}%`, animationDuration: `${Math.random() + 0.5}s`}} />
            ))}

            <svg viewBox="0 0 400 350" className="w-full h-auto z-10 relative">
              {/* Trachea */}
              <path d="M200 10 L200 60" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M200 10 L200 60" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
              
              {/* Bronchi */}
              <path d="M200 60 Q160 80 130 120" stroke="#94a3b8" strokeWidth="10" fill="none" />
              <path d="M200 60 Q240 80 270 120" stroke="#94a3b8" strokeWidth="10" fill="none" />
              
              {/* Lungs */}
              <ellipse cx="110" cy="200" rx={phase === 'inhale' && isAnimating ? 75 : 65} ry={phase === 'inhale' && isAnimating ? 110 : 95} fill="#be123c" fillOpacity="0.8" stroke="#881337" strokeWidth="2" className="transition-all duration-1000 ease-in-out" />
              <ellipse cx="290" cy="200" rx={phase === 'inhale' && isAnimating ? 75 : 65} ry={phase === 'inhale' && isAnimating ? 110 : 95} fill="#be123c" fillOpacity="0.8" stroke="#881337" strokeWidth="2" className="transition-all duration-1000 ease-in-out" />
              
              {/* Alveoli Clusters */}
              <g transform="translate(70, 220)">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle key={`l-${i}`} cx={15 + (i % 3) * 20} cy={10 + Math.floor(i / 3) * 20} r={phase === 'inhale' && isAnimating ? 10 : 7} fill="#f43f5e" stroke="#9f1239" strokeWidth="1" className="transition-all duration-500" />
                ))}
              </g>
              <g transform="translate(250, 220)">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle key={`r-${i}`} cx={15 + (i % 3) * 20} cy={10 + Math.floor(i / 3) * 20} r={phase === 'inhale' && isAnimating ? 10 : 7} fill="#f43f5e" stroke="#9f1239" strokeWidth="1" className="transition-all duration-500" />
                ))}
              </g>
              
              {/* Diaphragm */}
              <path d="M 50 320 Q 200 250 350 320" fill="none" stroke="#d97706" strokeWidth="8" className="transition-all duration-1000 ease-in-out" style={{ transform: phase === 'inhale' && isAnimating ? 'translateY(20px)' : 'translateY(0)' }} />

              <text x="200" y="340" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
                {phase === 'inhale' ? 'INHALING (Diaphragm Contracts)' : 'EXHALING (Diaphragm Relaxes)'}
              </text>
            </svg>
            
            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-lg p-3 space-y-2 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-sky-400">O₂ Saturation</span>
                <span className="text-sm font-mono text-white">{bloodO2}%</span>
              </div>
              <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 transition-all duration-300" style={{width: `${bloodO2}%`}}></div>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-xs font-bold text-amber-400">CO₂ Level</span>
                <span className="text-sm font-mono text-white">{bloodCO2}</span>
              </div>
               <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-300" style={{width: `${(bloodCO2/60)*100}%`}}></div>
              </div>
            </div>
        </div>
          
        <button 
            onClick={handleBreathCycle} 
            disabled={isAnimating}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <WindIcon className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
            {isAnimating ? `${phase === 'inhale' ? 'Taking a breath...' : 'Releasing...'}` : 'Breathe'}
        </button>

        <div className="mt-4">
            <p className="text-lg font-medium mb-4">{question.question}</p>
            <div className="grid gap-3">
              {question.options?.map((option, index) => {
                const isCorrect = option === question.answer;
                const isSelected = index === selectedAnswer;
                
                return (
                <button
                  key={index}
                  className={`w-full justify-start text-left p-4 rounded-xl border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : isSelected
                        ? "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        : "bg-card border-border opacity-50"
                      : "bg-card border-border hover:border-sky-400 hover:bg-muted"
                  }`}
                  onClick={() => !showResult && handleAnswer(index, option)}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{option}</span>
                    {showResult && isCorrect && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                    {showResult && isSelected && !isCorrect && <XCircleIcon className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              )})}
            </div>
            
            {showResult && (
              <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">Explanation: </span>
                  {question.explanation}
                </p>
              </div>
            )}
        </div>
    </div>
  );
}

export const DiffusionVisual = () => (
    <div className="p-4 bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-100 dark:border-sky-900">
        <h4 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest text-center mb-4">Gas Gradient</h4>
        <div className="flex justify-center items-center gap-6">
            <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold">ALVEOLI</div>
                <div className="text-xl">O₂</div>
                <div className="text-[8px] text-sky-500">HI PRESS</div>
            </div>
            <div className="text-xl animate-pulse">→</div>
            <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold">BLOOD</div>
                <div className="text-xl opacity-40">O₂</div>
                <div className="text-[8px] text-red-500">LO PRESS</div>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Gases naturally move from high to low pressure areas.</p>
    </div>
);

export const PressureVisual = () => (
    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
        <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center mb-4">Boyle\'s Law</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-12 bg-white/10 border-2 border-amber-500 rounded flex items-center justify-center relative">
                <div className="absolute top-0 w-full h-2 bg-amber-600"></div>
                <div className="text-[8px]">⬇ VOL</div>
                <div className="absolute bottom-1 font-bold text-xs">⬆ PRESS</div>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Shrinking the space forces the pressure up.</p>
    </div>
);

export const RespiratorySystem: React.FC<RespiratorySystemProps> = ({ onComplete, step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  if (!currentExercise) return null;

  const theoryVisual = 
      currentExercise.title.toLowerCase().includes('diffusion') ? <DiffusionVisual /> :
      currentExercise.title.toLowerCase().includes('boyle') ? <PressureVisual /> : null;

  const ExerciseContent = <RespiratorySystemUI question={currentExercise} onAnswered={() => {}} />;

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
