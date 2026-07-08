
import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, Droplet } from 'lucide-react';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;

    const { title, content, analogy } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-red-500" />
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
                        <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-red-500" /> Analogy
                            </h4>
                            <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    );
};

const BloodTypeVisual = ({ type }: { type: 'A+' | 'O-' | 'B+' | 'AB-' }) => {
    const agglutinateA = type.includes('A');
    const agglutinateB = type.includes('B');
    const agglutinateD = type.includes('+');

    const [dropped, setDropped] = useState({ A: false, B: false, D: false });

    const handleDrop = (well: 'A' | 'B' | 'D') => {
        setDropped(prev => ({ ...prev, [well]: true }));
    };

    const Well = ({ label, clump, isDropped, onDrop }: { label: string, clump: boolean, isDropped: boolean, onDrop: () => void }) => (
        <div className="flex flex-col items-center gap-3">
            <button 
                onClick={onDrop}
                disabled={isDropped}
                className={`p-2 text-xs font-bold rounded-lg border-2 transition-all flex items-center gap-1 ${isDropped ? 'bg-muted text-muted-foreground border-muted cursor-not-allowed' : 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 shadow-sm'}`}
            >
                <Droplet className="w-3 h-3" />
                Add {label}
            </button>
            <div className={`w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden flex items-center justify-center shadow-inner transition-colors ${isDropped ? 'bg-red-50 dark:bg-red-950/20 shadow-md' : ''}`}>
                {/* Initial Blood Sample (always present) */}
                <div className="w-12 h-12 bg-red-500/80 rounded-full blur-md opacity-60 absolute transition-transform"></div>
                
                {isDropped && clump ? (
                    // Agglutination (Clumping)
                    <div className="w-full h-full p-2 grid grid-cols-3 gap-1 animate-fade-in z-10 relative">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-red-700 rounded-full w-3 h-3 opacity-90 shadow-sm transform rotate-45"></div>
                        ))}
                    </div>
                ) : null}
                
                {/* Liquid Base Overlay when dropped */}
                {isDropped && !clump && (
                    <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 mix-blend-multiply animate-fade-in"></div>
                )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
    );

    return (
        <div className="my-4 p-6 bg-card rounded-xl border shadow-sm flex flex-col items-center">
            <h5 className="text-sm font-bold text-foreground uppercase mb-4 tracking-wider">Perform Forward Typing</h5>
            <div className="flex gap-6 flex-wrap justify-center">
                <Well label="Anti-A" clump={agglutinateA} isDropped={dropped.A} onDrop={() => handleDrop('A')} />
                <Well label="Anti-B" clump={agglutinateB} isDropped={dropped.B} onDrop={() => handleDrop('B')} />
                <Well label="Anti-D (Rh)" clump={agglutinateD} isDropped={dropped.D} onDrop={() => handleDrop('D')} />
            </div>
            <div className="mt-6 text-xs text-muted-foreground italic text-center">
                *Click buttons to add antisera. Clumping indicates the presence of the antigen on Patient RBCs.
            </div>
        </div>
    );
};

// --- Visual Analogy ---
export const AntigenVisual = () => (
    <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Antigens = "Name Tags"</h4>
        <div className="flex justify-around items-center h-28">
            {/* Type A */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 relative flex items-center justify-center shadow-lg border-2 border-red-400">
                    {/* A Flags (Triangles) */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                         <path d="M 50 -10 L 60 5 L 40 5 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" />
                         <path d="M 95 30 L 105 45 L 85 45 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" transform="rotate(45 95 30)" />
                         <path d="M 5 30 L 15 45 L -5 45 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" transform="rotate(-45 5 30)" />
                    </svg>
                    <span className="text-white font-bold text-lg drop-shadow-md">A</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Type A</span>
            </div>

            {/* Type B */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 relative flex items-center justify-center shadow-lg border-2 border-red-400">
                    {/* B Flags (Circles) */}
                     <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                         <circle cx="50" cy="-5" r="8" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                         <circle cx="95" cy="40" r="8" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                         <circle cx="5" cy="40" r="8" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                    </svg>
                    <span className="text-white font-bold text-lg drop-shadow-md">B</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Type B</span>
            </div>
            
             {/* Type O */}
             <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 relative flex items-center justify-center shadow-lg border-2 border-red-400">
                    {/* No Flags */}
                    <span className="text-white font-bold text-lg drop-shadow-md">O</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Type O (None)</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-4 text-muted-foreground italic leading-tight max-w-xs mx-auto">
            Your immune system reads these "flags". If it sees a flag it doesn't know (e.g., Type A blood in a Type B person), it attacks!
        </p>
    </div>
);

export const UniversalDonorVisual = () => (
    <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Analogy: Stealth Vehicles</h4>
        <div className="flex justify-center items-center gap-6 h-28">
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
                    {/* Stealth O- Cell */}
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-400 dark:border-slate-500 opacity-80 flex items-center justify-center">
                        <span className="text-xl opacity-50">🥷</span>
                    </div>
                </div>
                <span className="text-[10px] mt-2 font-bold text-slate-600 dark:text-slate-400 text-center">O- (Universal)</span>
                <span className="text-[8px] text-muted-foreground">"Stealth - No Flags"</span>
            </div>
            
            <div className="text-xl text-muted-foreground font-bold opacity-50">VS</div>
            
            <div className="flex flex-col items-center w-24">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
                    {/* Marked A+ Cell */}
                    <div className="w-12 h-12 rounded-full bg-red-500 relative flex items-center justify-center shadow-lg border-2 border-red-400">
                        {/* A Flags and Rh flags */}
                         <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                             <path d="M 50 -10 L 60 5 L 40 5 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" />
                             <circle cx="5" cy="20" r="5" fill="#22c55e" stroke="#166534" />
                        </svg>
                        <span className="text-white font-bold drop-shadow-md">A+</span>
                    </div>
                </div>
                <span className="text-[10px] mt-2 font-bold text-red-600 dark:text-red-400 text-center">A+ Cell</span>
                <span className="text-[8px] text-muted-foreground">"Marked - Has Flags"</span>
            </div>
        </div>
    </div>
);

// Removed duplicate import


// ... (imports and TheoryPane remain same)

export const ElisaVisual = ({ isPositive }: { isPositive: boolean }) => {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const isWashed = step >= 2;
    const hasSubstrate = step >= 3;

    const WellRenderer = ({ type, colorClass }: { type: 'pos' | 'neg' | 'patient', colorClass: string }) => {
        let content = null;
        if (step === 1) content = <div className="absolute inset-0 bg-blue-100/40 mix-blend-multiply"></div>; // Adding Sample
        if (step === 2) content = <div className="absolute inset-0 bg-transparent"></div>; // Wash - looks empty
        if (hasSubstrate) {
            // Enzyme reaction
            if (type === 'pos' || (type === 'patient' && isPositive)) {
                content = <div className={`w-full h-full ${colorClass} opacity-80 animate-fade-in shadow-inner`}></div>;
            } else {
                content = <div className="absolute inset-0 bg-blue-50/20"></div>; // Clear
            }
        }

        return (
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden flex items-center justify-center shadow-inner transition-colors duration-500">
                {content}
            </div>
        );
    };

    return (
        <div className="my-4 p-6 bg-card rounded-xl border shadow-sm flex flex-col items-center">
            <h5 className="text-sm font-bold text-foreground uppercase mb-4 tracking-wider">ELISA Microtiter Plate - Interactive Protocol</h5>
            
            <div className="flex gap-2 mb-6">
                 <button onClick={() => setStep(1)} disabled={step >= 1} className={`px-3 py-1.5 text-xs font-bold rounded-md ${step >= 1 ? 'bg-muted text-muted-foreground' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'}`}>1. Add Sample/Conjugate</button>
                 <button onClick={() => setStep(2)} disabled={step < 1 || step >= 2} className={`px-3 py-1.5 text-xs font-bold rounded-md ${step >= 2 ? 'bg-muted text-muted-foreground' : step < 1 ? 'bg-secondary text-secondary-foreground opacity-50' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>2. Wash Plate</button>
                 <button onClick={() => setStep(3)} disabled={step < 2 || step >= 3} className={`px-3 py-1.5 text-xs font-bold rounded-md ${step >= 3 ? 'bg-muted text-muted-foreground' : step < 2 ? 'bg-secondary text-secondary-foreground opacity-50' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>3. Add Substrate (Read)</button>
            </div>

            <div className="flex gap-6 flex-wrap justify-center">
                <div className="flex flex-col items-center gap-2">
                    <WellRenderer type="pos" colorClass="bg-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Positive Control</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <WellRenderer type="neg" colorClass="bg-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Negative Control</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <WellRenderer type="patient" colorClass="bg-yellow-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${hasSubstrate && isPositive ? 'text-amber-500' : 'text-blue-500'}`}>Patient Well</span>
                </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground italic text-center">
                 {step === 0 && "Start the ELISA test protocol."}
                 {step === 1 && "Samples and enzyme-linked antibodies added. They bind if target is present."}
                 {step === 2 && "Washed! Unbound antibodies are removed. Only bound targets remain."}
                 {step === 3 && "*Color change indicates presence of target antibody/antigen."}
            </div>
        </div>
    );
};

export const ImmunologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  if (!question) return null;

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) toast.success("Correct Answer!"); else toast.error("Incorrect Answer!");
  };

  const isElisa = question.title.includes('Screening') || question.title.includes('Serology');
  
  let visualType: 'A+' | 'O-' | 'B+' | 'AB-' = 'A+';
  let isElisaPositive = false;

  if (!isElisa) {
      if (question.title.includes('Case 2')) visualType = 'O-';
  } else {
      if (question.title.includes('Case 3')) isElisaPositive = true;
  }

  const VisualContent = (
      <div className="flex justify-center w-full">
           {isElisa ? <ElisaVisual isPositive={isElisaPositive} /> : <BloodTypeVisual type={visualType} />}
      </div>
  );

  const InteractionContent = (
      <div className="space-y-4">
        <p className="font-semibold">{question.question}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {question.options?.map((option) => (
            <button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={showResult}
            className={`w-full text-center p-4 rounded-lg border transition-all flex flex-col items-center justify-center min-h-[5rem] ${
                selectedAnswer === option
                    ? (showResult 
                        ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                        : 'bg-red-500 text-white border-red-600 shadow-md')
                    : 'bg-card hover:bg-muted'
            } ${showResult ? 'opacity-90 cursor-not-allowed' : ''}`}
            >
            <span className="font-bold text-sm sm:text-base leading-tight break-words px-2">{option}</span>
            </button>
        ))}
        </div>

        {!showResult && (
            <button 
                onClick={handleCheck} 
                disabled={!selectedAnswer} 
                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Confirm Interpretation
            </button>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
            {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div>
              <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
  );

  return (
    <MedLabLayout
        title={question.title}
        prompt={question.prompt}
        visualContent={VisualContent}
        interactionContent={InteractionContent}
        theoryContent={
            <TheoryPane 
                exercise={question} 
                visual={isElisa ? null : question.title.includes('Case 2') ? <UniversalDonorVisual /> : <AntigenVisual />} 
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
}
