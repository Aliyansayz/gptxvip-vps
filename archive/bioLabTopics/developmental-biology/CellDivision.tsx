
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { PlayIcon, ResetIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const CleavageVisual: React.FC<{
    cycle: number;
    mode: 'standard' | 'cleavage';
    setCycle: React.Dispatch<React.SetStateAction<number>>;
    setMode: React.Dispatch<React.SetStateAction<'standard' | 'cleavage'>>;
    maxCycles: number;
}> = ({ cycle, mode, setCycle, setMode, maxCycles }) => {
    
    const advanceCycle = () => {
        if (cycle < maxCycles) {
            setCycle(c => c + 1);
        }
    };

    const reset = () => {
        setCycle(0);
    };

    // Helper to generate cell positions based on cycle
    const getCells = () => {
        const cells = [];
        const count = Math.pow(2, cycle);
        
        // Base size for the "container" or initial cell
        const baseSize = 80; 
        
        if (mode === 'standard') {
            // In standard mode, cells grow back to roughly original size then split
            // We'll arrange them in a grid
            const cols = Math.ceil(Math.sqrt(count));
            const spacing = 100;
            
            for(let i=0; i<count; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                // Center the group
                const offsetX = (cols * spacing) / 2 - spacing/2; 
                const offsetY = (Math.ceil(count/cols) * spacing) / 2 - spacing/2;
                
                cells.push({
                    x: 150 + (col * spacing) - offsetX,
                    y: 100 + (row * spacing) - offsetY,
                    r: 30
                });
            }
        } else {
            // In cleavage mode, total volume is constant. Cells get smaller.
            // We pack them into the original circle area.
            // Simplified packing logic for visual demonstration
            const totalArea = Math.PI * 80 * 80;
            const individualArea = totalArea / count;
            const radius = Math.sqrt(individualArea / Math.PI) * 0.9; // 0.9 for spacing
            
            // Simple positioning logic for 1, 2, 4, 8
            // Just use random packing within circle for > 4 if static positions get complex
            if (count <= 4) {
                // Use explicit positions adjusted for the large container
                if (count === 1) cells.push({x: 150, y: 100, r: 80});
                else if (count === 2) {
                    cells.push({x: 110, y: 100, r: 40}, {x: 190, y: 100, r: 40});
                } else if (count === 4) {
                    cells.push({x: 110, y: 60, r: 40}, {x: 190, y: 60, r: 40}, {x: 110, y: 140, r: 40}, {x: 190, y: 140, r: 40});
                } 
            } else {
                 for(let i=0; i<count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        // Spiral or circle
                        cells.push({
                            x: 150 + Math.cos(angle) * 45,
                            y: 100 + Math.sin(angle) * 45,
                            r: 20
                        });
                     }
            }
        }
        return cells;
    };

    const cells = getCells();

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex bg-muted rounded-lg p-1">
                <button 
                    onClick={() => { setMode('cleavage'); setCycle(0); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'cleavage' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Embryonic Cleavage
                </button>
                <button 
                    onClick={() => { setMode('standard'); setCycle(0); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'standard' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Standard Cell Division
                </button>
            </div>

            <div className="relative w-full h-[250px] bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                    {/* Container Outline for Cleavage Context */}
                    {mode === 'cleavage' && (
                        <circle cx="150" cy="100" r="85" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
                    )}
                    
                    {cells.map((cell, i) => (
                        <g key={i} className="transition-all duration-500 ease-in-out">
                            <circle 
                                cx={cell.x} 
                                cy={cell.y} 
                                r={cell.r} 
                                className={`${mode === 'cleavage' ? 'fill-orange-400' : 'fill-blue-400'} stroke-white`} 
                                strokeWidth="2"
                            />
                            <circle cx={cell.x} cy={cell.y} r={cell.r * 0.3} fill="rgba(255,255,255,0.4)" />
                        </g>
                    ))}
                </svg>
                <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs font-mono border">
                    Cells: {Math.pow(2, cycle)}
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={reset}
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    title="Reset"
                >
                    <ResetIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={advanceCycle}
                    disabled={cycle >= maxCycles}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <PlayIcon className="w-4 h-4" />
                    Next Cycle
                </button>
            </div>
        </div>
    );
};

const CleavageInteraction: React.FC<{
    exercise: Exercise;
    selectedAnswer: string | null;
    showResult: boolean;
    isCorrect: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, selectedAnswer, showResult, isCorrect, handleSelectAnswer }) => {
    return (
        <div className="space-y-4">
            <p className="font-semibold text-lg mb-4">{exercise.question}</p>
            <div className="space-y-2">
                {exercise.options?.map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleSelectAnswer(opt)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === opt ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600') : 'bg-card hover:bg-muted'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {showResult && (
                <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircleIcon className="w-5 h-5 text-red-500" />}
                        <span className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                </div>
            )}
        </div>
    );
};

const TheoryPane: React.FC<{ exercise: Exercise & { theory?: { title: string; content: string; analogy?: string; application?: string } } ; visual?: React.ReactNode }> = ({ exercise, visual }) => {
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
                    <BookOpenText className="w-5 h-5 text-orange-500" />
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

export const CellDivision: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
  const currentExercise = exercises[step];
  const [cycle, setCycle] = useState(0);
  const [mode, setMode] = useState<'standard' | 'cleavage'>('cleavage');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!currentExercise) return null;

  const handleSelectAnswer = (option: string) => {
      if (showResult) return;
      setSelectedAnswer(option);
      const correct = option === currentExercise.answer;
      setIsCorrect(correct);
      setShowResult(true);
      if (correct) toast.success("Correct!");
      else toast.error("Not quite right");
  };

  const VisualContent = (
      <CleavageVisual 
          cycle={cycle} 
          mode={mode} 
          setCycle={setCycle} 
          setMode={setMode} 
          maxCycles={3} 
      />
  );

  const InteractionContent = (
      <CleavageInteraction 
          exercise={currentExercise} 
          selectedAnswer={selectedAnswer} 
          showResult={showResult} 
          isCorrect={isCorrect} 
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
