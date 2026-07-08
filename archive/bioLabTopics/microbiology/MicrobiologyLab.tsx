
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { FlaskConical, Droplets, Bug, CheckCircle, XCircle } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
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

// --- Theory Pane ---
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
                    <BookOpenText className="w-5 h-5 text-green-600" />
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
                                    <LightbulbIcon className="w-3 h-3 text-blue-500" /> Application
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

// --- Gram Stain Exercise ---
interface Bacterium {
  id: string;
  x: number;
  y: number;
  type: 'coccus' | 'bacillus' | 'spirillum';
  gramPositive: boolean;
  dividing: boolean;
}

const GramStainVisual: React.FC<{
    bacteria: Bacterium[];
    stainApplied: 'none' | 'gram';
    applyGramStain: () => void;
}> = ({ bacteria, stainApplied, applyGramStain }) => {
    const getBacteriaColor = (b: Bacterium) => {
        if (stainApplied === 'none') return 'fill-gray-300 stroke-gray-500';
        return b.gramPositive 
          ? 'fill-purple-600 stroke-purple-800' 
          : 'fill-pink-400 stroke-pink-600';
    };

    const renderBacterium = (b: Bacterium) => {
        const color = getBacteriaColor(b);
        switch (b.type) {
          case 'coccus':
            return (
              <g key={b.id}>
                <circle cx={b.x} cy={b.y} r="6" className={color} strokeWidth="1" />
                {b.dividing && <circle cx={b.x + 8} cy={b.y} r="5" className={color} strokeWidth="1" />}
              </g>
            );
          case 'bacillus':
            return (
              <g key={b.id}>
                <rect x={b.x - 10} y={b.y - 4} width="20" height="8" rx="4" className={color} strokeWidth="1" transform={`rotate(${Math.random() * 360}, ${b.x}, ${b.y})`} />
              </g>
            );
          case 'spirillum':
            return (
              <g key={b.id}>
                <path d={`M ${b.x - 12} ${b.y} Q ${b.x - 6} ${b.y - 6} ${b.x} ${b.y} Q ${b.x + 6} ${b.y + 6} ${b.x + 12} ${b.y}`} className={color} fill="none" strokeWidth="3" strokeLinecap="round" />
              </g>
            );
        }
    };

    return (
        <div className="space-y-6 w-full max-w-lg mx-auto">
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <FlaskConical className="w-3 h-3" />
                    <span>Petri Dish - {stainApplied === 'gram' ? 'Gram Stained' : 'Unstained'}</span>
                </div>
                <svg viewBox="0 0 300 300" className="w-full h-64 mx-auto">
                    <circle cx="150" cy="150" r="140" fill="#fef3c7" stroke="#d97706" strokeWidth="3" className="dark:fill-amber-950 dark:stroke-amber-800" />
                    <circle cx="150" cy="150" r="130" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/50 dark:stroke-amber-700" />
                    <circle cx="150" cy="150" r="120" fill={stainApplied === 'gram' ? '#fef9c3' : '#fefce8'} className="dark:fill-amber-900/30" />
                    {bacteria.map(renderBacterium)}
                </svg>
            </div>

            <button 
                onClick={applyGramStain} 
                disabled={stainApplied === 'gram'}
                className="flex items-center justify-center gap-2 w-full py-3 bg-card border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors font-medium"
            >
                <Droplets className="w-4 h-4 text-purple-500" /> Apply Gram Stain
            </button>
        </div>
    );
};

const GramStainInteraction: React.FC<{
    stainApplied: 'none' | 'gram';
    selectedBacteriaType: string | null;
    setSelectedBacteriaType: (type: string) => void;
    checkGramStain: () => void;
    showResult: boolean;
    isCorrect: boolean;
    exercise: Exercise;
}> = ({ stainApplied, selectedBacteriaType, setSelectedBacteriaType, checkGramStain, showResult, isCorrect, exercise }) => {
    if (stainApplied !== 'gram') return <p className="text-muted-foreground text-center italic">Apply Gram Stain to proceed.</p>;

    return (
        <div className="space-y-4 animate-fade-in">
            <p className="font-semibold text-lg">{exercise.question}</p>
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm font-medium text-center">Select the Gram-positive bacteria type:</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedBacteriaType('gram-positive')}
                        disabled={showResult}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${selectedBacteriaType === 'gram-positive' ? 'bg-purple-100 border-purple-500 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-card hover:bg-muted'}`}
                    >
                        <div className="w-4 h-4 rounded-full bg-purple-600" /> Purple (Gram+)
                    </button>
                    <button
                        onClick={() => setSelectedBacteriaType('gram-negative')}
                        disabled={showResult}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${selectedBacteriaType === 'gram-negative' ? 'bg-pink-100 border-pink-500 text-pink-900 dark:bg-pink-900/30 dark:text-pink-300' : 'bg-card hover:bg-muted'}`}
                    >
                        <div className="w-4 h-4 rounded-full bg-pink-400" /> Pink (Gram-)
                    </button>
                </div>
                {!showResult && selectedBacteriaType && (
                    <button onClick={checkGramStain} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors">
                        Confirm Identification
                    </button>
                )}
            </div>

            {showResult && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                    <p className="text-sm">{exercise.explanation}</p>
                </div>
            )}
        </div>
    );
};

// --- Select Exercise ---
const MicroscopeVisual = () => (
    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border-2 border-slate-300 dark:border-slate-700 w-full max-w-lg mx-auto flex items-center justify-center h-64">
        <div className="text-center space-y-2">
            <Bug className="w-16 h-16 text-slate-400 mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground font-mono">Microscope View Ready</p>
        </div>
    </div>
);

const SelectInteraction: React.FC<{
    exercise: Exercise;
    selectedAnswer: string | null;
    handleSelect: (option: string) => void;
    showResult: boolean;
    isCorrect: boolean;
}> = ({ exercise, selectedAnswer, handleSelect, showResult, isCorrect }) => (
    <div className="space-y-4">
        <p className="font-semibold text-lg">{exercise.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exercise.options?.map((option) => (
                <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedAnswer === option 
                            ? (isCorrect ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800')
                            : 'bg-card hover:bg-muted'
                    } ${showResult ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {option}
                </button>
            ))}
        </div>
        {showResult && (
            <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {isCorrect ? <CheckCircle className="w-5 h-5 flex-shrink-0"/> : <XCircle className="w-5 h-5 flex-shrink-0"/>}
                <p className="text-sm leading-relaxed">{exercise.explanation}</p>
            </div>
        )}
    </div>
);

export const GramWallVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">The Bacteria Wall</h4>
        <div className="flex justify-center items-center gap-6">
            <div className="flex flex-col items-center">
                <div className="w-12 h-6 border-4 border-purple-600 bg-purple-400 rounded-sm"></div>
                <div className="text-[8px] mt-1 font-bold">THICK (Gram+)</div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-2 border-2 border-pink-500 bg-pink-300 rounded-sm"></div>
                <div className="text-[8px] mt-1 font-bold">THIN (Gram-)</div>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Gram staining exploits differences in the protective wall thickness.</p>
    </div>
);

export const ShapeVisual = () => (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-900">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center mb-4">Bacterial Shapes</h4>
        <div className="flex justify-center items-center gap-6">
            <div className="flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                <div className="text-[8px]">COCCUS</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-3 rounded-full bg-slate-400"></div>
                <div className="text-[8px]">BACILLUS</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 border-2 border-slate-400 rounded-full border-t-transparent animate-spin"></div>
                <div className="text-[8px]">SPIRILLUM</div>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Microbiology often begins with identifying these basic geometric forms.</p>
    </div>
);

export const MicrobiologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
    const theoryVisual = 
        currentExercise.type === 'gram-stain' ? <GramWallVisual /> :
        currentExercise.title.toLowerCase().includes('shape') || currentExercise.title.toLowerCase().includes('morphology') ? <ShapeVisual /> : null;
  // State for Gram Stain
  const [bacteria, setBacteria] = useState<Bacterium[]>([]);
  const [stainApplied, setStainApplied] = useState<'none' | 'gram'>('none');
  const [selectedBacteriaType, setSelectedBacteriaType] = useState<string | null>(null);
  const [gramShowResult, setGramShowResult] = useState(false);
  const [gramIsCorrect, setGramIsCorrect] = useState(false);

  // State for Select Exercise
  const [selectSelectedAnswer, setSelectSelectedAnswer] = useState<string | null>(null);
  const [selectShowResult, setSelectShowResult] = useState(false);
  const [selectIsCorrect, setSelectIsCorrect] = useState(false);

  useEffect(() => {
    // Reset Gram Stain State
    const newBacteria: Bacterium[] = [];
    const types: Array<'coccus' | 'bacillus' | 'spirillum'> = ['coccus', 'bacillus', 'spirillum'];
    
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100;
      newBacteria.push({
        id: `b-${i}`,
        x: 150 + Math.cos(angle) * radius,
        y: 150 + Math.sin(angle) * radius,
        type: types[Math.floor(Math.random() * types.length)],
        gramPositive: Math.random() > 0.5,
        dividing: Math.random() > 0.7
      });
    }
    setBacteria(newBacteria);
    setStainApplied('none');
    setSelectedBacteriaType(null);
    setGramShowResult(false);
    setGramIsCorrect(false);

    // Reset Select Exercise State
    setSelectSelectedAnswer(null);
    setSelectShowResult(false);
    setSelectIsCorrect(false);
  }, [currentExercise]);

  if (!currentExercise) return null;

  // Logic for Gram Stain
  const applyGramStain = () => {
      setStainApplied('gram');
      toast.success("Stain applied!");
  };

  const checkGramStain = () => {
      const gramPositiveCount = bacteria.filter(b => b.gramPositive).length;
      const correct = selectedBacteriaType === 'gram-positive' && gramPositiveCount > 0;
      
      setGramIsCorrect(correct);
      setGramShowResult(true);
      if(correct) toast.success("Correct Identification!");
      else toast.error("Incorrect. Remember Gram-Positive stains purple.");
  };

  // Logic for Select Exercise
  const handleSelect = (option: string) => {
      if(selectShowResult) return;
      const correct = option === currentExercise.answer;
      setSelectSelectedAnswer(option);
      setSelectIsCorrect(correct);
      setSelectShowResult(true);
      toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Incorrect.');
  }

  let VisualContent;
  let InteractionContent;

  if (currentExercise.type === 'gram-stain') {
      VisualContent = (
          <GramStainVisual 
              bacteria={bacteria} 
              stainApplied={stainApplied} 
              applyGramStain={applyGramStain} 
          />
      );
      InteractionContent = (
          <GramStainInteraction 
              stainApplied={stainApplied} 
              selectedBacteriaType={selectedBacteriaType} 
              setSelectedBacteriaType={setSelectedBacteriaType} 
              checkGramStain={checkGramStain} 
              showResult={gramShowResult} 
              isCorrect={gramIsCorrect} 
              exercise={currentExercise} 
          />
      );
  } else {
      VisualContent = <MicroscopeVisual />;
      InteractionContent = (
          <SelectInteraction 
              exercise={currentExercise} 
              selectedAnswer={selectSelectedAnswer} 
              handleSelect={handleSelect} 
              showResult={selectShowResult} 
              isCorrect={selectIsCorrect} 
          />
      );
  }

  return (
    <BioLabLayout
        title={currentExercise.title}
        prompt={currentExercise.prompt}
        visualContent={VisualContent}
        interactionContent={InteractionContent}
        theoryContent={<TheoryPane exercise={currentExercise} visual={theoryVisual} />}
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
};
