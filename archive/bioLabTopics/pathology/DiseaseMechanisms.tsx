
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

const DiseaseMechanismsUI: React.FC<{ exercise: Exercise & { items?: string[] }; onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
  const [shuffledItems, setShuffledItems] = useState(() => exercise.items ? [...exercise.items].sort(() => Math.random() - 0.5) : []);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData("text/plain", item);
  };

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
    setIsCorrect(correct);
    setShowResult(true);
    onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Sequence Correct!' : 'Incorrect Sequence');
  };

  const handleSelectAnswer = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === exercise.answer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
  };
  
  const resetDragDrop = () => {
    setShuffledItems(exercise.items ? [...exercise.items].sort(() => Math.random() - 0.5) : []);
    setOrderedItems([]);
    setShowResult(false);
    setIsCorrect(false);
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-heading text-3xl tracking-wide text-center mb-4">{exercise.title}</h3>
      <p className="text-muted-foreground text-center">{exercise.prompt}</p>

      {exercise.type === 'drag-and-drop-sequence' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-center text-sm text-muted-foreground">Available Steps</h4>
              <div className="p-2 min-h-[200px] bg-muted/30 rounded-lg space-y-2">
                {shuffledItems.map(item => (
                  <div key={item} draggable onDragStart={(e) => handleDragStart(e, item)}
                       className="p-3 bg-card border rounded-md cursor-grab active:cursor-grabbing">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-center text-sm text-muted-foreground">Pathogenesis Sequence</h4>
              <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                   className="p-2 min-h-[200px] bg-muted/30 rounded-lg space-y-2 border-2 border-dashed">
                {orderedItems.map((item, index) => (
                  <div key={item} className="p-3 bg-card border rounded-md flex items-center gap-2">
                    <span className="font-bold text-primary">{index + 1}.</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDragDrop} className="w-full p-2 border rounded-md hover:bg-secondary">Reset</button>
            <button onClick={checkSequence} disabled={showResult || orderedItems.length !== (exercise.items?.length || 0)} 
                    className="w-full p-2 bg-gradient-bio-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50">
              Check Sequence
            </button>
          </div>
        </>
      )}

      {exercise.type === 'select' && (
        <div className="mt-6">
          <p className="font-semibold text-lg mb-4">{exercise.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exercise.options?.map(option => (
              <button key={option} onClick={() => handleSelectAnswer(option)} disabled={showResult}
                className={`py-4 text-center justify-start p-4 rounded-lg border transition-all ${selectedAnswer === option ? (isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground') : 'bg-card hover:bg-muted'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-medium">{isCorrect ? 'Correct!' : 'Not quite'}</p>
          <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
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
                    <BookOpenText className="w-5 h-5 text-purple-500" />
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
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-3 h-3 text-blue-500" /> Application
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

export const DiseaseMechanisms: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];
  
  if (!currentExercise) return null;

  const ExerciseContent = (
      <DiseaseMechanismsUI exercise={currentExercise} onAnswered={() => {}} />
  );

  return (
    <>
        {infoVisible && infoPlacement === 'side' ? (
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">{ExerciseContent}</div>
                <aside className="lg:col-span-1 sticky top-24 h-fit">
                    <TheoryPane exercise={currentExercise} />
                </aside>
            </div>
        ) : (
            <div className="space-y-6">
                {ExerciseContent}
                {infoVisible && infoPlacement === 'bottom' && <TheoryPane exercise={currentExercise} />}
            </div>
        )}
    </>
  );
};
