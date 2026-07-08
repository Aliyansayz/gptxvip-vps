
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Pill, Activity, TrendingUp, Stethoscope } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

interface DoseResponseExercise extends Exercise {
    minTherapeutic: number;
    maxTherapeutic: number;
    toxicThreshold: number;
}

import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

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
                    <BookOpenText className="w-5 h-5 text-blue-500" />
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

// --- Theory Visuals ---

export const ReceptorBindingVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Lock & Key Mechanism</h4>
        <div className="flex justify-center items-center gap-4 h-24">
            {/* Receptor (Lock) */}
            <div className="relative w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center border-4 border-slate-400">
                <div className="absolute top-0 w-8 h-8 bg-white rounded-b-full"></div>
                <span className="mt-8 text-[8px] font-bold text-slate-600">Receptor</span>
            </div>
            
            <div className="text-blue-400">←</div>

            {/* Drug (Key) */}
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-b-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-blue-600 mt-1">Drug</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            Just like a key fits a specific lock, a drug molecule must have the right shape to bind to its receptor.
        </p>
    </div>
);

export const AgonistAntagonistVisual = () => (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Agonist vs. Antagonist</h4>
        <div className="flex justify-around">
            {/* Agonist */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-12 h-12 bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full animate-ping opacity-20 absolute"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="text-center">
                    <span className="text-[10px] font-bold text-green-700 block">Agonist</span>
                    <span className="text-[8px] text-muted-foreground">Activates</span>
                </div>
            </div>

            <div className="w-px h-16 bg-indigo-200"></div>

            {/* Antagonist */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-12 h-12 bg-red-100 border-2 border-red-400 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-600 rounded-sm transform rotate-45"></div>
                </div>
                <div className="text-center">
                    <span className="text-[10px] font-bold text-red-700 block">Antagonist</span>
                    <span className="text-[8px] text-muted-foreground">Blocks</span>
                </div>
            </div>
        </div>
    </div>
);

export const TherapeuticIndexVisual = () => (
    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900">
        <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest text-center mb-4">Safety Margin</h4>
        <div className="relative h-24 w-full flex items-end justify-center gap-1">
            {/* Sub-therapeutic */}
            <div className="w-1/4 h-8 bg-yellow-200 rounded-t flex items-center justify-center text-[8px] text-yellow-800 font-bold">Too Low</div>
            {/* Therapeutic */}
            <div className="w-1/3 h-16 bg-emerald-400 rounded-t flex items-center justify-center text-[8px] text-white font-bold shadow-lg z-10">
                Therapeutic Window
                <br/>(Safe & Effective)
            </div>
            {/* Toxic */}
            <div className="w-1/4 h-24 bg-red-400 rounded-t flex items-center justify-center text-[8px] text-white font-bold">Toxic</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            The goal is to stay in the green zone: enough to work, but not enough to harm.
        </p>
    </div>
);

export const ADMEVisual = () => (
    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">ADME Pathway</h4>
        <div className="flex justify-between items-center text-[8px] font-bold text-orange-800">
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">A</div>
                <span>Absorption</span>
            </div>
            <div>→</div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center">D</div>
                <span>Distribution</span>
            </div>
            <div>→</div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white">M</div>
                <span>Metabolism</span>
            </div>
            <div>→</div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">E</div>
                <span>Excretion</span>
            </div>
        </div>
    </div>
);

// --- Main Component ---

const PharmacologyExerciseUI: React.FC<{ exercise: Exercise; onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [dosage, setDosage] = useState(50);
  const [drugEffect, setDrugEffect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (exercise.type === 'dose-response') {
      const effect = 100 / (1 + Math.exp(-0.1 * (dosage - 50)));
      setDrugEffect(Math.min(effect, 95));
    }
  }, [dosage, exercise.type]);

  useEffect(() => {
      setShowResult(false);
      setIsCorrect(false);
      setDosage(50);
      setSelectedAnswer(null);
  }, [exercise]);

  const checkDoseResponse = () => {
    const ex = exercise as DoseResponseExercise;
    const inTherapeuticWindow = drugEffect >= ex.minTherapeutic && drugEffect <= ex.maxTherapeutic;
    const notToxic = drugEffect < ex.toxicThreshold;
    const correct = inTherapeuticWindow && notToxic;

    setIsCorrect(correct);
    setShowResult(true);
    onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Dosage Confirmed!' : 'Dosage is outside the therapeutic range.');
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    const correct = answer === exercise.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
  };

  const getEffectColor = () => {
    if (drugEffect >= 90) return 'text-red-500'; // Toxic
    if (drugEffect >= 50 && drugEffect <= 80) return 'text-green-500'; // Therapeutic
    return 'text-yellow-500'; // Subtherapeutic
  };

  const getEffectStatus = () => {
    if (drugEffect >= 90) return 'TOXIC RANGE';
    if (drugEffect >= 50 && drugEffect <= 80) return 'THERAPEUTIC';
    if (drugEffect < 50) return 'SUBTHERAPEUTIC';
    return 'ABOVE THERAPEUTIC';
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-heading text-3xl tracking-wider text-center mb-4">{exercise.title}</h3>
      <p className="text-muted-foreground text-center">{exercise.prompt}</p>

      {exercise.type === 'dose-response' && (
        <div className="space-y-6">
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <svg viewBox="0 0 400 200" className="w-full h-48">
              <defs><pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/></pattern></defs>
              <rect width="400" height="200" fill="url(#grid)" />
              {/* Zones */}
              <rect x="50" y="40" width="300" height="60" fill="hsl(var(--success))" fillOpacity="0.1" />
              <text x="360" y="75" fontSize="10" fill="hsl(var(--success))" fontWeight="bold" textAnchor="end">Therapeutic Window</text>
              <rect x="50" y="10" width="300" height="30" fill="hsl(var(--destructive))" fillOpacity="0.1" />
              <text x="360" y="28" fontSize="10" fill="hsl(var(--destructive))" fontWeight="bold" textAnchor="end">Toxic Zone</text>
              
              {/* Curve */}
              <path
                d={`M 50,180 ${Array.from({ length: 101 }, (_, i) => `L ${50 + (i / 100) * 300},${180 - (Math.min(100 / (1 + Math.exp(-0.1 * (i - 50))), 95) / 100) * 170}`).join(' ')}`}
                fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
              
              {/* Active Point */}
              <circle cx={50 + (dosage / 100) * 300} cy={180 - (drugEffect / 100) * 170} r="8"
                className={`${drugEffect >= 90 ? 'fill-red-500' : drugEffect >= 50 && drugEffect <= 80 ? 'fill-green-500' : 'fill-yellow-500'} stroke-white`} strokeWidth="2" />
              
              {/* Labels */}
              <text x="200" y="195" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">Dosage (mg) →</text>
              <text x="15" y="100" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))" transform="rotate(-90, 15, 100)">Response (%)</text>
            </svg>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
              <div className="flex items-center gap-2"><Pill className="w-5 h-5 text-blue-500" /><span className="font-medium">Dosage: {dosage} mg</span></div>
              <div className="flex items-center gap-2"><Activity className="w-5 h-5" /><span className={`font-bold ${getEffectColor()}`}>Response: {drugEffect.toFixed(1)}%</span></div>
            </div>
            
            <div className="px-2">
                <input type="range" min="0" max="100" step="1" value={dosage} onChange={(e) => setDosage(Number(e.target.value))} disabled={showResult} className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${drugEffect >= 90 ? 'bg-red-100 text-red-700' : drugEffect >= 50 && drugEffect <= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} flex items-center gap-1 shadow-sm`}>
                <TrendingUp className="w-3 h-3" /> {getEffectStatus()}
              </span>
              {!showResult && <button onClick={checkDoseResponse} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md transition-all">Confirm Dosage</button>}
            </div>
          </div>
        </div>
      )}

      {exercise.type === 'select' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exercise.options?.map((option) => (
            <button key={option} onClick={() => handleSelectAnswer(option)} disabled={showResult}
              className={`h-auto py-4 text-left justify-start p-4 rounded-lg border transition-all ${selectedAnswer === option ? (isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground') : 'bg-card hover:bg-muted'}`}>
              {option}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
            <div>
              <p className="font-bold">{isCorrect ? 'Correct!' : 'Not quite right'}</p>
              <p className="text-sm mt-1 opacity-90">{exercise.explanation}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export const Pharmacology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  
  if (!currentExercise) return null;

  const ExerciseContent = <PharmacologyExerciseUI exercise={currentExercise} onAnswered={() => {}} />;

  const theoryVisual = (() => {
      const t = currentExercise.title.toLowerCase();
      if (t.includes('receptor') || t.includes('binding')) return <ReceptorBindingVisual />;
      if (t.includes('agonist') || t.includes('antagonist')) return <AgonistAntagonistVisual />;
      if (t.includes('therapeutic') || t.includes('dose') || t.includes('window')) return <TherapeuticIndexVisual />;
      if (t.includes('metabolism') || t.includes('adme') || t.includes('kinetics')) return <ADMEVisual />;
      return null;
  })();

  return (
    <BioLabLayout
        exerciseContent={ExerciseContent}
        theoryContent={<TheoryPane exercise={currentExercise} visual={theoryVisual} />}
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
    />
  );
};
