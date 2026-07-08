
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { ShieldIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
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

// --- Matching Game Sub-Component ---

interface Antigen {
  id: string;
  x: number;
  y: number;
  shape: 'triangle' | 'square' | 'circle';
  matched: boolean;
}

interface Antibody {
  id: string;
  shape: 'triangle' | 'square' | 'circle';
}

const renderAntigenShape = (shape: string, x: number, y: number, matched: boolean) => {
    const baseClass = matched ? 'fill-green-400 stroke-green-600' : 'fill-red-400 stroke-red-600';
    
    switch (shape) {
      case 'triangle':
        return <polygon points={`${x},${y-15} ${x-13},${y+10} ${x+13},${y+10}`} className={baseClass} strokeWidth="2" />;
      case 'square':
        return <rect x={x-12} y={y-12} width="24" height="24" className={baseClass} strokeWidth="2" />;
      case 'circle':
        return <circle cx={x} cy={y} r="14" className={baseClass} strokeWidth="2" />;
      default: return null;
    }
};

const renderAntibodyShape = (shape: string, selected: boolean) => {
    const color = selected ? 'fill-blue-500 stroke-blue-700' : 'fill-blue-300 stroke-blue-500';
    return (
      <svg viewBox="0 0 60 70" className="w-16 h-20">
        <path d="M 30 70 L 30 40 L 10 20 M 30 40 L 50 20" fill="none" className={color} strokeWidth="6" strokeLinecap="round" />
        {shape === 'triangle' && (
          <>
            <polygon points="10,20 5,10 15,10" className={color} strokeWidth="2" />
            <polygon points="50,20 45,10 55,10" className={color} strokeWidth="2" />
          </>
        )}
        {shape === 'square' && (
          <>
            <rect x="2" y="8" width="16" height="16" className={color} strokeWidth="2" />
            <rect x="42" y="8" width="16" height="16" className={color} strokeWidth="2" />
          </>
        )}
        {shape === 'circle' && (
          <>
            <circle cx="10" cy="15" r="10" className={color} strokeWidth="2" />
            <circle cx="50" cy="15" r="10" className={color} strokeWidth="2" />
          </>
        )}
      </svg>
    );
};

const AntibodyMatchingVisual: React.FC<{
    antigens: Antigen[];
    matchedAntigens: string[];
    handleAntigenClick: (id: string) => void;
}> = ({ antigens, matchedAntigens, handleAntigenClick }) => (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 w-full max-w-lg mx-auto">
        <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-muted-foreground">
        <ShieldIcon className="w-3 h-3" />
        <span>Match {matchedAntigens.length}/5</span>
        </div>

        <svg viewBox="0 0 400 280" className="w-full h-56">
        <rect x="0" y="0" width="400" height="280" fill="none" rx="10" />
        {antigens.map(antigen => (
            <g 
            key={antigen.id} 
            onClick={() => handleAntigenClick(antigen.id)}
            className={matchedAntigens.includes(antigen.id) ? '' : 'cursor-pointer hover:opacity-80'}
            >
            <circle cx={antigen.x} cy={antigen.y} r="25" 
                className={matchedAntigens.includes(antigen.id) ? 'fill-green-200 stroke-green-400' : 'fill-red-200 stroke-red-400'} 
                strokeWidth="2" 
            />
            {renderAntigenShape(antigen.shape, antigen.x, antigen.y - 30, matchedAntigens.includes(antigen.id))}
            {matchedAntigens.includes(antigen.id) && (
                <text x={antigen.x} y={antigen.y + 5} textAnchor="middle" className="text-xs fill-green-700 font-bold">✓</text>
            )}
            </g>
        ))}
        </svg>
    </div>
);

const AntibodyMatchingInteraction: React.FC<{
    antibodies: Antibody[];
    selectedAntibody: string | null;
    handleAntibodySelect: (id: string) => void;
    showResult: boolean;
    exercise: Exercise;
}> = ({ antibodies, selectedAntibody, handleAntibodySelect, showResult, exercise }) => (
    <div className="space-y-6">
        <p className="font-semibold text-lg">{exercise.question}</p>
        <div className="space-y-2">
            <p className="text-sm font-medium text-center">Select an Antibody Weapon:</p>
            <div className="flex gap-4 justify-center">
            {antibodies.map(antibody => (
                <button
                key={antibody.id}
                onClick={() => handleAntibodySelect(antibody.id)}
                className={`p-2 rounded-lg border-2 transition-all ${
                    selectedAntibody === antibody.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 scale-110' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
                >
                {renderAntibodyShape(antibody.shape, selectedAntibody === antibody.id)}
                </button>
            ))}
            </div>
        </div>
        
        {showResult && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 flex items-start gap-3 animate-fade-in">
                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                    <p className="font-bold text-green-800 dark:text-green-300">Excellent!</p>
                    <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                </div>
            </div>
        )}
    </div>
);

// --- Standard Select Question ---

const ImmuneCellVisual = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 flex justify-center items-center w-full max-w-lg mx-auto">
        <svg viewBox="0 0 400 150" className="w-full h-32">
            {/* B Cell */}
            <g>
                <circle cx="70" cy="75" r="30" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
                <text x="70" y="80" textAnchor="middle" className="text-[10px] fill-white font-bold">B Cell</text>
                <path d="M 50 50 L 50 40 L 45 30 M 50 40 L 55 30" fill="none" stroke="#7c3aed" strokeWidth="2" />
            </g>
            {/* T Cell */}
            <g>
                <circle cx="170" cy="75" r="30" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
                <text x="170" y="72" textAnchor="middle" className="text-[10px] fill-white font-bold">T Cell</text>
                <text x="170" y="85" textAnchor="middle" className="text-[8px] fill-blue-100">(CD8+)</text>
            </g>
            {/* Macrophage */}
            <g>
                <circle cx="270" cy="75" r="35" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <text x="270" y="72" textAnchor="middle" className="text-[9px] fill-white font-bold">Macro-</text>
                <text x="270" y="85" textAnchor="middle" className="text-[9px] fill-white font-bold">phage</text>
                <ellipse cx="240" cy="60" rx="8" ry="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            </g>
            {/* Antibody */}
            <g>
                <path d="M 360 90 L 360 60 L 345 40 M 360 60 L 375 40" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <text x="360" y="110" textAnchor="middle" className="text-[9px] fill-gray-500">Antibody</text>
            </g>
        </svg>
    </div>
);

const AntibodyStructureVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Antibody (IgG) Anatomy</h4>
        <div className="flex justify-center items-center">
            <svg viewBox="0 0 100 120" className="w-24 h-32">
                {/* Heavy Chains */}
                <path d="M 45 110 L 45 60 L 15 20" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                <path d="M 55 110 L 55 60 L 85 20" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                {/* Light Chains */}
                <path d="M 15 20 L 5 10" fill="none" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" />
                <path d="M 85 20 L 95 10" fill="none" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" />
                {/* Variable Regions labels */}
                <circle cx="10" cy="15" r="4" fill="#60a5fa" />
                <circle cx="90" cy="15" r="4" fill="#60a5fa" />
            </svg>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Tips of the Y (Variable regions) determine specificity.</p>
    </div>
);

const MHCInteractionVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">MHC-Antigen Presentation</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="relative">
                {/* Host Cell Membrane */}
                <div className="w-20 h-4 bg-orange-400/20 rounded-full border border-orange-300"></div>
                {/* MHC Molecule */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 flex flex-col items-center">
                    <div className="w-6 h-4 bg-purple-500 rounded-t-lg"></div>
                    <div className="w-4 h-4 bg-purple-600"></div>
                    {/* Antigen Fragment */}
                    <div className="absolute -top-2 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                </div>
            </div>
            <div className="text-muted-foreground text-xs font-bold">→</div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">TCR</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">T-Cells "smell" antigens presented on MHC "platters".</p>
    </div>
);

const ImmuneCellInteraction: React.FC<{
    exercise: Exercise;
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (answer: string) => void;
}> = ({ exercise, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => (
    <div className="space-y-6">
        <p className="font-semibold text-lg">{exercise.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {exercise.options?.map((option) => (
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

        {showResult && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                <div className="mt-0.5">
                    {isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" /> : <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />}
                </div>
                <div>
                    <span className="block font-bold text-sm mb-1">{isCorrect ? 'Correct!' : 'Not quite right'}</span>
                    <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                </div>
            </div>
        )}
    </div>
);

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

export const ImmunologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
  const currentExercise = exercises[step];
  
  // State for Antibody Matching
  const [selectedAntibody, setSelectedAntibody] = useState<string | null>(null);
  const [matchedAntigens, setMatchedAntigens] = useState<string[]>([]);
  const [showAntibodyResult, setShowAntibodyResult] = useState(false);

  // State for Immune Cell Select
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCellResult, setShowCellResult] = useState(false);
  const [isCellCorrect, setIsCellCorrect] = useState(false);

  useEffect(() => {
      // Reset all states when exercise changes
      setMatchedAntigens([]);
      setSelectedAntibody(null);
      setShowAntibodyResult(false);
      setSelectedAnswer(null);
      setShowCellResult(false);
      setIsCellCorrect(false);
  }, [currentExercise]);

  if (!currentExercise) return null;

  // Logic for Antibody Matching
  const antigens: Antigen[] = [
    { id: 'a1', x: 80, y: 100, shape: 'triangle', matched: false },
    { id: 'a2', x: 200, y: 80, shape: 'square', matched: false },
    { id: 'a3', x: 320, y: 120, shape: 'circle', matched: false },
    { id: 'a4', x: 140, y: 180, shape: 'triangle', matched: false },
    { id: 'a5', x: 260, y: 200, shape: 'square', matched: false },
  ];

  const antibodies: Antibody[] = [
    { id: 'ab1', shape: 'triangle' },
    { id: 'ab2', shape: 'square' },
    { id: 'ab3', shape: 'circle' },
  ];

  const handleAntibodySelect = (antibodyId: string) => {
    if (showAntibodyResult) return;
    setSelectedAntibody(antibodyId);
  };

  const handleAntigenClick = (antigenId: string) => {
    if (showAntibodyResult || !selectedAntibody || matchedAntigens.includes(antigenId)) return;
    
    const antibody = antibodies.find(ab => ab.id === selectedAntibody);
    const antigen = antigens.find(a => a.id === antigenId);
    
    if (antibody && antigen) {
        if (antibody.shape === antigen.shape) {
            const newMatched = [...matchedAntigens, antigenId];
            setMatchedAntigens(newMatched);
            toast.success("Match found!");
            
            if (newMatched.length === 5) {
                setShowAntibodyResult(true);
                toast.success("All antigens neutralized!");
            }
        } else {
            toast.error("Shape mismatch! Specificity rule failed.");
        }
    }
  };

  // Logic for Immune Cell Select
  const handleSelectAnswer = (answer: string) => {
      if (showCellResult) return;
      const correct = answer === currentExercise.answer;
      setSelectedAnswer(answer);
      setIsCellCorrect(correct);
      setShowCellResult(true);
      if(correct) toast.success("Correct!");
      else toast.error("Incorrect.");
  };

  let VisualContent;
  let InteractionContent;

  if (currentExercise.componentId === 'antibody_matching') {
      VisualContent = (
          <div className="w-full flex justify-center">
              <AntibodyMatchingVisual 
                  antigens={antigens} 
                  matchedAntigens={matchedAntigens} 
                  handleAntigenClick={handleAntigenClick} 
              />
          </div>
      );
      InteractionContent = (
          <AntibodyMatchingInteraction 
              antibodies={antibodies} 
              selectedAntibody={selectedAntibody} 
              handleAntibodySelect={handleAntibodySelect} 
              showResult={showAntibodyResult} 
              exercise={currentExercise} 
          />
      );
  } else {
      VisualContent = (
          <div className="w-full flex justify-center">
              <ImmuneCellVisual />
          </div>
      );
      InteractionContent = (
          <ImmuneCellInteraction 
              exercise={currentExercise} 
              selectedAnswer={selectedAnswer} 
              isCorrect={isCellCorrect} 
              showResult={showCellResult} 
              handleSelectAnswer={handleSelectAnswer} 
          />
      );
  }

  const theoryVisual = currentExercise.componentId === 'antibody_matching' ? <AntibodyStructureVisual /> : <MHCInteractionVisual />;

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
