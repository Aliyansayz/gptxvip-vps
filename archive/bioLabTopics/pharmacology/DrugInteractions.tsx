
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { Pill, Stethoscope } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
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

export const SynergyVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Synergistic Effect</h4>
        <div className="flex justify-center items-end gap-2 h-24">
            <div className="flex flex-col items-center">
                <div className="w-8 h-12 bg-blue-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-[8px] mt-1">Drug A</span>
            </div>
            <div className="text-xl text-muted-foreground mb-4">+</div>
            <div className="flex flex-col items-center">
                <div className="w-8 h-12 bg-green-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-[8px] mt-1">Drug B</span>
            </div>
            <div className="text-xl text-muted-foreground mb-4">=</div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-24 bg-purple-500 rounded-t-lg flex items-center justify-center text-white text-lg font-bold animate-pulse">3!</div>
                <span className="text-[8px] mt-1 font-bold text-purple-600">Greater Effect</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            Sometimes 1 + 1 is greater than 2. The drugs work together to boost each other.
        </p>
    </div>
);

export const AntagonismVisual = () => (
    <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-xl border border-gray-100 dark:border-gray-900">
        <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center mb-4">Antagonistic Effect</h4>
        <div className="flex justify-center items-end gap-2 h-24">
            <div className="flex flex-col items-center">
                <div className="w-8 h-12 bg-blue-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-[8px] mt-1">Drug A</span>
            </div>
            <div className="text-xl text-muted-foreground mb-4">+</div>
            <div className="flex flex-col items-center">
                <div className="w-8 h-12 bg-red-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-[8px] mt-1">Drug B</span>
            </div>
            <div className="text-xl text-muted-foreground mb-4">=</div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-6 bg-gray-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">0.5</div>
                <span className="text-[8px] mt-1 font-bold text-gray-600">Reduced Effect</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            One drug cancels out or blocks the other. 1 + 1 is less than 2.
        </p>
    </div>
);

// --- Main Component ---

const EffectBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col items-center w-24">
        <div className="w-full h-48 bg-muted/50 rounded-t-lg flex items-end relative overflow-hidden border-b border-x border-border">
            {/* Grid lines */}
            <div className="absolute inset-0 w-full h-full" style={{backgroundImage: 'linear-gradient(to bottom, transparent 19px, rgba(0,0,0,0.05) 20px)', backgroundSize: '100% 20px'}}></div>
            <div className={`w-full rounded-t-lg ${color} transition-all duration-500 ease-out`} style={{ height: `${value}%` }} />
        </div>
        <div className="text-center mt-3">
            <p className="text-sm font-bold">{label}</p>
            <p className="text-xs text-muted-foreground font-mono">{value}% Effect</p>
        </div>
    </div>
);

const DrugInteractionsUI: React.FC<{ exercise: Exercise; onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
  const [effectA, setEffectA] = useState(0);
  const [effectB, setEffectB] = useState(0);
  const [combinedEffect, setCombinedEffect] = useState(0);
  const [interactionType, setInteractionType] = useState<'none' | 'synergy' | 'antagonism' | 'additive'>('none');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const administerA = () => { setEffectA(40); setInteractionType('none'); setCombinedEffect(0); setEffectB(0); }
  const administerB = () => { setEffectB(30); setInteractionType('none'); setCombinedEffect(0); setEffectA(0); }
  const combineSynergy = () => { setEffectA(40); setEffectB(30); setCombinedEffect(90); setInteractionType('synergy'); }
  const combineAntagonism = () => { setEffectA(40); setEffectB(30); setCombinedEffect(20); setInteractionType('antagonism'); }
  const combineAdditive = () => { setEffectA(40); setEffectB(30); setCombinedEffect(70); setInteractionType('additive'); }
  
  const handleSelectAnswer = (option: string) => {
    if (showResult) return;
    const correct = option === exercise.answer;
    setSelectedAnswer(option); setIsCorrect(correct); setShowResult(true); onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
  };

  const getInteractionText = () => {
      switch(interactionType) {
          case 'synergy': return 'Synergistic Effect (1+1 > 2): Combined effect is GREATER than sum of parts.';
          case 'antagonism': return 'Antagonistic Effect (1+1 < 2): Combined effect is LESS than sum of parts.';
          case 'additive': return 'Additive Effect (1+1 = 2): Combined effect EQUALS sum of parts.';
          default: return 'Select an action to administer drugs.';
      }
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-heading text-3xl tracking-wider text-center mb-4">{exercise.title}</h3>
      <p className="text-muted-foreground text-center">{exercise.prompt}</p>

      {exercise.type === 'interactive-visual' && (
        <>
            <div className="flex justify-center items-end gap-2 md:gap-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border">
                <EffectBar label="Drug A" value={effectA} color="bg-blue-500" />
                <div className="text-3xl font-light pb-12 text-muted-foreground">+</div>
                <EffectBar label="Drug B" value={effectB} color="bg-green-500" />
                <div className="text-3xl font-light pb-12 text-muted-foreground">=</div>
                <EffectBar label="Result" value={combinedEffect} color={interactionType === 'synergy' ? 'bg-purple-600' : interactionType === 'antagonism' ? 'bg-gray-400' : 'bg-purple-400'} />
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg text-center">
                 <p className="text-sm font-semibold">{getInteractionText()}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button onClick={administerA} className="p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2 transition-colors"><Pill className="w-4 h-4 text-blue-500"/> Drug A</button>
                <button onClick={administerB} className="p-3 border rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center gap-2 transition-colors"><Pill className="w-4 h-4 text-green-500"/> Drug B</button>
                <button onClick={combineSynergy} className="p-3 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium">Combine (Synergy)</button>
                <button onClick={combineAntagonism} className="p-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">Combine (Antagonism)</button>
                <button onClick={combineAdditive} className="p-3 border rounded-lg hover:bg-secondary transition-colors font-medium">Combine (Additive)</button>
            </div>
            
            <div className="mt-6">
              <p className="font-semibold mb-3">{exercise.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {exercise.options?.map(option => (
                  <button key={option} onClick={() => handleSelectAnswer(option)} disabled={showResult} className={`py-4 px-4 text-left border rounded-xl transition-all ${selectedAnswer === option ? (isCorrect ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300') : 'bg-card hover:border-blue-400'}`}>{option}</button>
                ))}
              </div>
            </div>
        </>
      )}

      {showResult && (
        <div className={`mt-4 p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Not quite'}</p>
          <p className="text-sm opacity-90">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};

export const DrugInteractions: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  
  if (!currentExercise) return null;

  const ExerciseContent = <DrugInteractionsUI exercise={currentExercise} onAnswered={() => {}} />;

  const theoryVisual = (() => {
      const t = currentExercise.title.toLowerCase();
      if (t.includes('synergy') || t.includes('synergistic')) return <SynergyVisual />;
      if (t.includes('antagonism') || t.includes('antagonistic')) return <AntagonismVisual />;
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
