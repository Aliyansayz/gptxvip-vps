import React, { useState, useEffect } from 'react';
import { BabyIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon } from '../../icons';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';
import CleavageSimulatorActivity from './CleavageSimulatorActivity';
import { TheoryVisual } from '../../TheoryVisual';
import { LightbulbIcon } from '../../icons';

interface EmbryoDevelopmentProps {
  onComplete: () => void;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const STAGES = [
  { name: 'Zygote', day: 0, cells: 1, description: 'Single fertilized cell' },
  { name: '2-Cell', day: 1, cells: 2, description: 'First cleavage division' },
  { name: '4-Cell', day: 2, cells: 4, description: 'Second cleavage' },
  { name: '8-Cell', day: 2.5, cells: 8, description: 'Third cleavage' },
  { name: 'Morula', day: 3, cells: 16, description: 'Solid ball of cells' },
  { name: 'Blastocyst', day: 5, cells: 100, description: 'Hollow ball with inner cell mass' },
  { name: 'Gastrula', day: 14, cells: 1000, description: 'Three germ layers form' },
];

const EmbryoVisual: React.FC<{ currentStage: typeof STAGES[0] }> = ({ currentStage }) => {
    // Generate cells for visualization
    const generateCells = () => {
        const cellCount = Math.min(currentStage.cells, 16); // Cap visual cells
        const cells = [];
        
        if (currentStage.name === 'Blastocyst') {
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 35;
            cells.push({
              x: 50 + Math.cos(angle) * radius,
              y: 50 + Math.sin(angle) * radius,
              size: 8,
              isICM: i >= 9 && i <= 11
            });
          }
        } else if (currentStage.name === 'Gastrula') {
          const layers = ['#ef4444', '#22c55e', '#3b82f6'];
          for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2 + layer * 0.3;
              const radius = 20 + layer * 12;
              cells.push({
                x: 50 + Math.cos(angle) * radius,
                y: 50 + Math.sin(angle) * radius,
                size: 7,
                color: layers[layer]
              });
            }
          }
        } else {
          const gridSize = Math.ceil(Math.sqrt(cellCount));
          const cellSize = Math.max(8, 30 / gridSize);
          const spacing = 70 / gridSize;
          for (let i = 0; i < cellCount; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const offsetX = (100 - (gridSize * spacing)) / 2 + spacing/2;
            const offsetY = (100 - (gridSize * spacing)) / 2 + spacing/2;
            cells.push({ x: offsetX + col * spacing, y: offsetY + row * spacing, size: cellSize });
          }
        }
        return cells;
    };

    return (
        <div className="flex justify-center w-full">
            <div className="relative w-48 h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30 rounded-full border-4 border-pink-200 dark:border-pink-800 shadow-inner flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                {generateCells().map((cell, i) => (
                    <circle
                    key={i}
                    cx={cell.x}
                    cy={cell.y}
                    r={cell.size}
                    className={`transition-all duration-500 ${
                        (cell as any).isICM 
                        ? 'fill-yellow-400 stroke-yellow-600' 
                        : (cell as any).color 
                            ? '' 
                            : 'fill-purple-300 stroke-purple-500'
                    }`}
                    style={(cell as any).color ? { fill: (cell as any).color, stroke: (cell as any).color } : {}}
                    strokeWidth="1"
                    />
                ))}
                </svg>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-64">
                <div className="font-bold text-lg text-primary">{currentStage.name}</div>
                <div className="text-xs text-muted-foreground">Day {currentStage.day} • ~{currentStage.cells} cells</div>
                </div>
            </div>
        </div>
    );
};

const EmbryoInteraction: React.FC<{
    exercise: Exercise;
    timeSlider: number;
    setTimeSlider: (val: number) => void;
    currentStage: typeof STAGES[0];
    showResult: boolean;
    isCorrect: boolean;
    selectedAnswer: string | null;
    handleSliderCheck: () => void;
    handleSelectAnswer: (answer: string) => void;
}> = ({ exercise, timeSlider, setTimeSlider, currentStage, showResult, isCorrect, selectedAnswer, handleSliderCheck, handleSelectAnswer }) => {
    return (
        <div className="space-y-6 w-full">
            {exercise.type === 'slider' && (
                <div className="space-y-6">
                    <div className="space-y-2 bg-card/50 p-4 rounded-lg border">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Time Progression</span>
                            <span>Day {currentStage.day}</span>
                        </div>
                        <input
                            type="range"
                            value={timeSlider}
                            onChange={(e) => setTimeSlider(Number(e.target.value))}
                            min="0"
                            max="100"
                            step="1"
                            disabled={showResult}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Fertilization</span>
                            <span>2 Weeks</span>
                        </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg text-center border">
                        <p className="text-sm italic">{currentStage.description}</p>
                    </div>

                    {!showResult && (
                        <button 
                            onClick={handleSliderCheck}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                        >
                            Check Stage
                        </button>
                    )}
                </div>
            )}

            {exercise.type === 'select' && (
                <div className="grid gap-3">
                    <p className="font-semibold mb-2">{exercise.question}</p>
                    {exercise.options?.map((option) => (
                        <button
                            key={option}
                            className={`w-full justify-start text-left h-auto py-4 px-4 border rounded-lg transition-all ${
                                selectedAnswer === option 
                                    ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                                    : 'hover:bg-muted bg-card'
                            }`}
                            onClick={() => handleSelectAnswer(option)}
                            disabled={showResult}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircleIcon className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium">{isCorrect ? 'Excellent!' : 'Not quite right'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                </div>
            )}
        </div>
    );
};

const TheoryPane: React.FC<{ exercise: Exercise & { theory?: { title: string; content: string; analogy?: string } } ; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-orange-500" />
                    {exercise.theory.title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: exercise.theory.content }} />
                    
                    {exercise.theory.analogy && (
                        <TheoryVisual 
                            analogyName={exercise.theory.analogy} 
                            keywords={[exercise.theory.title, exercise.theory.content]} 
                        />
                    )}

                    {exercise.theory.analogy && (
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                            <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-orange-500" /> Analogy
                            </h4>
                            <p className="text-xs italic leading-relaxed text-muted-foreground">"{exercise.theory.analogy}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const EmbryoDevelopment: React.FC<EmbryoDevelopmentProps> = ({ onComplete, step, exercises, infoVisible, infoPlacement, settings }) => {
  const currentExercise = exercises[step];
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSlider, setTimeSlider] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Reset state on exercise change
  useEffect(() => {
    setShowResult(false);
    setIsCorrect(false);
    setTimeSlider(0);
    setSelectedAnswer(null);
  }, [currentExercise]);

  if (!currentExercise) return null;

  const currentStageIndex = Math.min(Math.floor(timeSlider / (100 / (STAGES.length - 1))), STAGES.length - 1);
  const currentStage = STAGES[currentStageIndex];

  const handleSliderCheck = () => {
    const correct = currentStage.name === (currentExercise as any).targetStage;
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) toast.success("Stage identified!");
    else toast.error("Incorrect stage.");
  };

  const handleSelectAnswer = (answer: string) => {
    if(showResult) return;
    const correct = answer === currentExercise.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) toast.success("Correct!");
    else toast.error("Incorrect.");
  };

  if (currentExercise.componentId === 'cleavage_sim_activity') {
      return <CleavageSimulatorActivity labData={{} as any} exercises={[currentExercise]} onComplete={onComplete} />;
  }

  const VisualContent = <EmbryoVisual currentStage={currentStage} />;
  
  const InteractionContent = (
      <EmbryoInteraction 
          exercise={currentExercise}
          timeSlider={timeSlider}
          setTimeSlider={setTimeSlider}
          currentStage={currentStage}
          showResult={showResult}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          handleSliderCheck={handleSliderCheck}
          handleSelectAnswer={handleSelectAnswer}
      />
  );

  return (
      <BioLabLayout
          title={currentExercise.title}
          prompt={currentExercise.prompt}
          visualContent={VisualContent}
          interactionContent={InteractionContent}
          theoryContent={<TheoryPane exercise={currentExercise} />}
          infoVisible={infoVisible}
          infoPlacement={infoPlacement}
          settings={settings}
      />
  );
};
