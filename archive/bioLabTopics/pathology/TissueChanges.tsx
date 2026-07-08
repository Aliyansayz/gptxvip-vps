
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  labData: any;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

type Adaptation = 'normal' | 'hypertrophy' | 'atrophy' | 'metaplasia';

const Cell: React.FC<{ adaptation: Adaptation; index: number }> = ({ adaptation, index }) => {
  const commonProps = {
    stroke: 'hsl(var(--border))',
    strokeWidth: 0.5,
    fill: 'hsl(var(--primary))',
    opacity: 0.7,
    transition: 'all 0.5s ease-in-out',
  };

  const x = (index % 5) * 20 + 10;
  const y = Math.floor(index / 5) * 20 + 10;

  switch (adaptation) {
    case 'hypertrophy':
      return <rect x={x - 2} y={y - 4} width={14} height={28} rx={4} {...commonProps} />;
    case 'atrophy':
      return <rect x={x + 2} y={y + 3} width={6} height={14} rx={2} {...commonProps} />;
    case 'metaplasia':
      return <ellipse cx={x + 5} cy={y + 10} rx={8} ry={4} {...commonProps} fill="hsl(var(--destructive))" />;
    case 'normal':
    default:
      return <rect x={x} y={y} width={10} height={20} rx={3} {...commonProps} />;
  }
};

const TissueChangesUI: React.FC<{ exercise: Exercise; onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
  const [adaptation, setAdaptation] = useState<Adaptation>('normal');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectAnswer = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === exercise.answer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswered(correct);
    toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
  };

  const getAdaptationDescription = (adapt: Adaptation) => {
    switch(adapt) {
        case 'hypertrophy': return 'Cells increase in size due to increased workload.';
        case 'atrophy': return 'Cells shrink due to disuse or lack of stimulation.';
        case 'metaplasia': return 'Cells change from one type to another due to chronic irritation.';
        default: return 'Normal, healthy columnar epithelial cells.';
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-heading text-2xl tracking-wide text-center mb-4">{exercise.title}</h3>
      <p className="text-muted-foreground text-center">{exercise.prompt}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-muted/30 p-4 rounded-lg">
        <div className="md:col-span-1 space-y-3">
          <button onClick={() => setAdaptation('hypertrophy')} className="w-full p-2 border rounded-md hover:bg-secondary">Apply: Increased Workload</button>
          <button onClick={() => setAdaptation('atrophy')} className="w-full p-2 border rounded-md hover:bg-secondary">Apply: Disuse</button>
          <button onClick={() => setAdaptation('metaplasia')} className="w-full p-2 border rounded-md hover:bg-secondary">Apply: Chronic Irritation</button>
          <button onClick={() => setAdaptation('normal')} className="w-full p-2 border rounded-md hover:bg-secondary">Remove Stress</button>
        </div>
        <div className="md:col-span-2 relative h-64 bg-background rounded-xl p-4 border-2 border-purple-200">
           <svg viewBox="0 0 110 90" className="w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <Cell key={i} adaptation={adaptation} index={i} />
            ))}
          </svg>
          <p className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded-md">{getAdaptationDescription(adaptation)}</p>
        </div>
      </div>

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
        {showResult && (
          <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className="font-medium">{isCorrect ? 'Correct!' : 'Not quite'}</p>
            <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
          </div>
        )}
      </div>
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

export const TissueChanges: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
  const currentExercise = exercises[step];

  if (!currentExercise) return null;

  const ExerciseContent = (
      <TissueChangesUI exercise={currentExercise} onAnswered={() => {}} />
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
