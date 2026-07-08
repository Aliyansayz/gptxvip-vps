
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BrainCircuit, Stethoscope } from 'lucide-react';
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

export const FirstPassVisual = () => (
    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">First-Pass Effect</h4>
        <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center text-[8px]">Mouth</div>
                <div className="text-orange-400">↓</div>
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-[8px]">Gut</div>
            </div>
            <div className="text-orange-400 text-xl">→</div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white text-[8px]">Liver</div>
                <span className="text-[8px] text-red-600 font-bold mt-1">Metabolism</span>
            </div>
            <div className="text-orange-400 text-xl">→</div>
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px]">Blood</div>
                <span className="text-[8px] text-muted-foreground mt-1">Less Drug!</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            Oral drugs pass through the liver before reaching the rest of the body, often reducing their concentration.
        </p>
    </div>
);

export const EnzymeInductionVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Enzyme Induction</h4>
        <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-1">
                <div className="text-[8px] font-bold">Normal</div>
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">⚙️</div>
                <div className="text-[8px] text-muted-foreground">1x Metabolism</div>
            </div>
            <div className="text-purple-400">vs</div>
            <div className="flex flex-col items-center gap-1">
                <div className="text-[8px] font-bold">Inducer Added</div>
                <div className="flex gap-1">
                    <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-spin" style={{animationDuration: '3s'}}>⚙️</div>
                    <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-spin" style={{animationDuration: '3s'}}>⚙️</div>
                </div>
                <div className="text-[8px] text-muted-foreground">2x Metabolism!</div>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            Some drugs make the liver work "overtime", breaking down other drugs too quickly.
        </p>
    </div>
);

// --- Main Component ---

const LiverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.29 10.29C22.12 12.12 22.3 15.08 20.88 17.22C19.46 19.36 16.63 20 14.5 20H6C3.79 20 2 18.21 2 16V14.5C2 12.02 3.53 9.93 5.86 9.14"/>
        <path d="M12 9.14C12.38 7.39 13.14 6 15.5 6C18.5 6 20 8 20 9.14"/>
    </svg>
);
const KidneyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 10c-2.5 2.5-2.5 7.5 0 10s7.5 2.5 10 0c.9-2.2-.4-5.4-3-6-1.7-.4-2-2-5-2-1.7 0-1.7 1.2-2.2 2.8"/>
        <path d="M14.5 10c2.5-2.5 2.5-7.5 0-10s-7.5-2.5-10 0c-.9 2.2.4 5.4 3 6c1.7.4 2 2 5 2c1.7 0 1.7-1.2 2.2-2.8"/>
    </svg>
);

const AdmeVisual: React.FC = () => (
    <div className="h-64 bg-background rounded-lg border p-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/20 dark:bg-blue-900/10" />
        <svg viewBox="0 0 300 100" className="w-full h-full relative z-10">
            <path d="M30 40 Q 50 20 80 40 T 130 40" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="3 3" />
            <path d="M130 40 C 140 80, 180 80, 190 40" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="3 3" />
            <path d="M190 40 L 220 40" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="3 3" />
            
            {/* Icons */}
            <circle cx="20" cy="40" r="10" fill="#bfdbfe" />
            <text x="20" y="44" fontSize="8" fill="#1e40af" textAnchor="middle" fontWeight="bold">A</text>
            <text x="20" y="60" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">Gut</text>
            
            <BrainCircuit className="w-6 h-6 absolute top-[30px] left-[135px] text-purple-500" />
            <text x="145" y="70" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">Tissues (D)</text>
            
            <LiverIcon className="w-8 h-8 absolute top-[25px] left-[195px] text-orange-500" />
            <text x="205" y="70" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">Liver (M)</text>
            
            <KidneyIcon className="w-8 h-8 absolute top-[45px] left-[255px] text-yellow-500" />
            <text x="260" y="85" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">Kidney (E)</text>
        </svg>
    </div>
);

const DrugMetabolismUI: React.FC<{ exercise: Exercise & { items?: string[] }; onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
  const [shuffledItems, setShuffledItems] = useState(() => exercise.items ? [...exercise.items].sort(() => Math.random() - 0.5) : []);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => e.dataTransfer.setData("text/plain", item);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (item && !orderedItems.includes(item)) {
      setOrderedItems(prev => [...prev, item]);
      setShuffledItems(prev => prev.filter(i => i !== item));
    }
  };

  const checkSequence = () => {
    const correct = orderedItems.join(',') === exercise.answer;
    setIsCorrect(correct); setShowResult(true); onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Sequence Correct!' : 'Incorrect Sequence');
  };

  const handleSelectAnswer = (option: string) => {
    if (showResult) return;
    const correct = option === exercise.answer;
    setSelectedAnswer(option); setIsCorrect(correct); setShowResult(true); onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
  };
  
  const resetDragDrop = () => {
    setShuffledItems(exercise.items ? [...exercise.items].sort(() => Math.random() - 0.5) : []);
    setOrderedItems([]); setShowResult(false); setIsCorrect(false);
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-heading text-3xl tracking-wider text-center mb-4">{exercise.title}</h3>
      <p className="text-muted-foreground text-center">{exercise.prompt}</p>

      {exercise.type === 'drag-and-drop-sequence' && (
        <>
          <AdmeVisual />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-xl space-y-3 flex flex-col items-center border">
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Draggable Steps</h4>
              {shuffledItems.map(item => (
                <div key={item} draggable onDragStart={(e) => handleDragStart(e, item)} className="p-3 w-full text-center bg-white dark:bg-card border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors">{item}</div>
              ))}
            </div>
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="p-4 bg-muted/30 rounded-xl space-y-3 border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[200px]">
              <h4 className="font-bold text-center text-sm text-muted-foreground uppercase tracking-wide">Timeline</h4>
              {orderedItems.map((item, index) => (
                <div key={item} className="p-3 bg-white dark:bg-card border rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
                    <span className="font-medium">{item}</span>
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">{index + 1}</span>
                </div>
              ))}
              {orderedItems.length === 0 && <p className="text-center text-sm text-muted-foreground italic mt-8">Drag items here...</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDragDrop} className="w-full p-3 border rounded-xl hover:bg-secondary font-medium transition-colors">Reset</button>
            <button onClick={checkSequence} disabled={showResult || orderedItems.length !== (exercise.items?.length || 0)} className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 transition-colors shadow-md">Check Sequence</button>
          </div>
        </>
      )}

      {exercise.type === 'select' && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
          <p className="font-semibold">{exercise.question}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exercise.options?.map(option => (
              <button key={option} onClick={() => handleSelectAnswer(option)} disabled={showResult} className={`py-4 text-center justify-start p-4 rounded-lg border transition-all ${selectedAnswer === option ? (isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground') : 'bg-card hover:bg-muted'}`}>{option}</button>
            ))}
          </div>
        </div>
      )}

      {showResult && (
        <div className={`mt-4 p-4 rounded-lg border flex gap-3 ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="font-bold">{isCorrect ? 'Correct!' : 'Not quite'}</div>
          <p className="text-sm opacity-90">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};

export const DrugMetabolism: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  if (!currentExercise) return null;

  const ExerciseContent = <DrugMetabolismUI exercise={currentExercise} onAnswered={() => {}} />;

  const theoryVisual = (() => {
      const t = currentExercise.title.toLowerCase();
      if (t.includes('first-pass') || t.includes('bioavailability')) return <FirstPassVisual />;
      if (t.includes('induction') || t.includes('inhibition') || t.includes('enzyme')) return <EnzymeInductionVisual />;
      if (t.includes('adme') || t.includes('pathway')) return <AdmeVisual />; // Reusing the existing AdmeVisual
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
