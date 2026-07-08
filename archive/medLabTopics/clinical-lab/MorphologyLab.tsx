import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, FlaskConical, Play, RotateCcw, Info, Settings, Compass, Sparkles, Filter, ShieldCheck, Microscope, Layers } from 'lucide-react';
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

// --- Theory & Analogy Panel ---
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
                    <BookOpenText className="w-5 h-5 text-indigo-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4 font-sans">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    
                        {visual && (
                            <div className="my-4">
                                {visual}
                            </div>
                        )}

                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/40 mt-3">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                                    <LightbulbIcon className="w-4 h-4" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800/40 mt-3">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                    <ShieldCheck className="w-4 h-4" /> Clinical Case Target
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

// --- Interactive Urine Crystal Visual ---
const CrystalSimulator: React.FC<{ activeId: string }> = ({ activeId }) => {
  const [phSlider, setPhSlider] = useState<number>(6.0); // urine pH standard

  // Auto-set optimal pH for training
  useEffect(() => {
    if (activeId === 'morph_case_1') {
      // Prompt user to slide or check pH
    }
  }, [activeId]);

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-slate-900/40 dark:to-purple-950/20 rounded-xl border border-border shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
          <Microscope className="w-4 h-4" /> Crytallography Lens
        </h4>
        <div className="text-xs font-mono font-bold bg-background/80 px-2 py-0.5 rounded border">
          pH Matrix: <span className={phSlider > 7 ? 'text-green-500' : 'text-blue-500'}>{phSlider.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Aperture View */}
        <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-full border-4 border-slate-600 overflow-hidden bg-slate-950 flex items-center justify-center">
          <div className="absolute inset-x-0 inset-y-0 bg-sky-200/5"></div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            {/* Grid Coordinates */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" />
            
            {phSlider <= 6.5 ? (
              // Acidic Crystals: Calcium Oxalate Envelopes
              <g stroke="#38bdf8" strokeWidth="1" fill="#38bdf8" fillOpacity="0.1" className="animate-fade-in">
                {/* Main envelope */}
                <rect x="35" y="35" width="30" height="30" rx="0.5" />
                <line x1="35" y1="35" x2="65" y2="65" />
                <line x1="65" y1="35" x2="35" y2="65" />
                
                {/* Secondary smaller envelopes */}
                <g transform="translate(-15, -10) scale(0.6)">
                  <rect x="35" y="35" width="30" height="30" rx="0.5" />
                  <line x1="35" y1="35" x2="65" y2="65" />
                  <line x1="65" y1="35" x2="35" y2="65" />
                </g>
                <g transform="translate(35, 30) scale(0.5) rotate(45 50 50)">
                  <rect x="35" y="35" width="30" height="30" />
                  <line x1="35" y1="35" x2="65" y2="65" />
                  <line x1="65" y1="35" x2="35" y2="65" />
                </g>
              </g>
            ) : (
              // Alkaline Crystals: Triple Phosphate Coffin Lids
              <g stroke="#10b981" strokeWidth="1.2" fill="#10b981" fillOpacity="0.1" className="animate-fade-in">
                {/* Classical coffin lids prisms */}
                <polygon points="25,40 75,40 85,48 15,48" />
                <polygon points="25,40 75,40 70,34 30,34" />
                <line x1="25" y1="40" x2="15" y2="48" />
                <line x1="75" y1="40" x2="85" y2="48" />
                <line x1="30" y1="34" x2="25" y2="40" />
                <line x1="70" y1="34" x2="75" y2="40" />

                <g transform="translate(15, -15) scale(0.55)">
                  <polygon points="25,40 75,40 85,48 15,48" />
                  <polygon points="25,40 75,40 70,34 30,34" />
                  <line x1="25" y1="40" x2="15" y2="48" />
                  <line x1="75" y1="40" x2="85" y2="48" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Adjuster Slider pane */}
        <div className="space-y-4">
          <div className="bg-background/80 p-3 rounded-lg border text-xs leading-relaxed space-y-2">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              pH Slider Calibration
            </span>
            <p className="text-muted-foreground text-[11px]">
              Drag the slide to adjust specimen acidity. Watch crystals transition between acidic structures (envelopes) and alkaline formations (coffin-prism lids).
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-blue-500 font-bold">Acidic Range (5.0)</span>
              <span className="text-green-500 font-bold">Alkaline Range (8.5)</span>
            </div>
            <input 
              type="range" 
              min="5.0" 
              max="8.5" 
              step="0.1" 
              value={phSlider} 
              onChange={(e) => setPhSlider(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="p-2.5 bg-card rounded border text-[11.5px] font-mono flex items-center justify-between">
            <span className="font-semibold text-foreground">Dominant Structure:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-xs ${phSlider <= 6.5 ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {phSlider <= 6.5 ? 'Calcium Oxalate (Envelopes)' : 'Triple Phosphate (Coffin-Lids)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Centrifugated Hematocrit Cylinder Simulation ---
const CentrifugeSimulator: React.FC = () => {
  const [rpm, setRpm] = useState<number>(0);
  const [spinProgress, setSpinProgress] = useState<number>(0); // 0 to 100
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSpinning && spinProgress < 100) {
      timer = setTimeout(() => {
        setSpinProgress(prev => Math.min(prev + 4, 100));
      }, 80);
    } else if (spinProgress === 100) {
      setIsSpinning(false);
      toast.success("Specimen separation complete!");
    }
    return () => clearTimeout(timer);
  }, [isSpinning, spinProgress]);

  const handleStartSpin = () => {
    if (rpm < 3000) {
      toast.error("Standard blood separation requires at least 3000 RPM!");
      return;
    }
    setSpinProgress(0);
    setIsSpinning(true);
  };

  const handleReset = () => {
    setRpm(0);
    setSpinProgress(0);
    setIsSpinning(false);
  };

  // Dynamic values interpolated by spin progress (simulating 29% hematocrit anemia case)
  const plasmaY = 15 + (70 * (spinProgress / 100)); // plasma fluid height expands
  const buffyY = plasmaY + (1.2 * (spinProgress / 100)); // white buffy coat layers
  const redY = 120 - (29 * (spinProgress / 100)); // packed erythrocyte bottom base

  return (
    <div className="p-4 bg-gradient-to-br from-red-50/10 to-amber-50/10 dark:from-slate-900/30 dark:to-red-950/10 rounded-xl border border-border shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 animate-bounce" /> Packed Vol. Centrifugation
        </h4>
        <div className="text-xs font-mono bg-background/80 px-2 py-0.5 rounded border">
          RPM Speed: <span className="font-bold text-rose-500">{rpm}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left pane: Centrifuge glass tube view */}
        <div className="flex justify-center gap-8 items-center py-2 bg-background/50 rounded-lg border">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Hematocrit Tube</span>
            
            <div className="relative w-12 h-36 bg-slate-200/20 border-2 border-slate-600 rounded-b-xl relative overflow-hidden shadow-inner">
              {spinProgress < 20 ? (
                // Initial Whole Blood state
                <div className="absolute inset-0 bg-red-700 opacity-90 transition-all duration-300"></div>
              ) : (
                // Density Split Specimen
                <div className="h-full w-full relative">
                  {/* Plasma Layer (Top) */}
                  <div 
                    className="absolute top-0 w-full bg-yellow-400/70 transition-all duration-500" 
                    style={{ height: `${(plasmaY / 120) * 100}%` }}
                    title="Plasma: Liquid minerals & proteins (~70% in anemia)"
                  ></div>
                  
                  {/* Buffy Coat Layer (Middle) */}
                  <div 
                    className="absolute w-full bg-slate-100/90 border-y border-slate-300 transition-all duration-500" 
                    style={{ 
                      top: `${(plasmaY / 120) * 100}%`, 
                      height: '2px' 
                    }}
                    title="Buffy Coat: Leukocytes & Platelets (~1%)"
                  ></div>

                  {/* Red Packed Sediment (Bottom) */}
                  <div 
                    className="absolute bottom-0 w-full bg-red-700 font-mono transition-all duration-500"
                    style={{ height: `${((120 - redY) / 120) * 100}%` }}
                    title="Packed Red Blood Cells (29% Anemia Level)"
                  ></div>
                </div>
              )}
            </div>
            
            <span className="text-[9px] mt-2 font-mono text-muted-foreground">
              {spinProgress >= 100 ? 'Hct: 29% (Depleted)' : 'Whole Blood'}
            </span>
          </div>

          {/* Separation readout details */}
          <div className="flex flex-col gap-2 font-mono text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <span>Plasma: {spinProgress >= 100 ? '70% (High)' : 'Unseparated'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              <span>WBC Coat: {spinProgress >= 100 ? '1%' : 'Unseparated'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
              <span>RBC (Hct): {spinProgress >= 100 ? '29% (Severe Anemia)' : 'Unseparated'}</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded mt-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300" 
                style={{ width: `${spinProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right pane: Controls */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Calibration Selector:</span>
              <span className="font-bold text-rose-500">{rpm} RPM</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="4500" 
              step="500" 
              value={rpm} 
              disabled={isSpinning}
              onChange={(e) => setRpm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-40"
            />
          </div>

          <div className="space-y-2">
            <button 
              onClick={handleStartSpin} 
              disabled={isSpinning || rpm === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-lg shadow disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{isSpinning ? `Spinning (${spinProgress}%)` : 'Start Centrifuge'}</span>
            </button>
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs rounded-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tube</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Gram-Stain Bacterial Microscopic Aperture Simulation ---
const GramStainSimulator: React.FC = () => {
  const [useHighPower, setUseHighPower] = useState<boolean>(true);

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50/10 to-indigo-50/10 dark:from-slate-900/30 dark:to-purple-950/10 rounded-xl border border-border shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
          <Layers className="w-4 h-4" /> Peptidoglycan Gram Microscope
        </h4>
        <div className="text-xs font-mono bg-background/80 px-2 py-0.5 rounded border flex items-center gap-1.5">
          Lens Mode: <span className="font-bold text-purple-500">1000x Oil</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Aperture Circle Lens */}
        <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-full border-4 border-slate-600 overflow-hidden bg-slate-950 flex items-center justify-center">
          <div className="absolute inset-x-0 inset-y-0 bg-purple-500/5 animate-pulse"></div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            {/* Grid coordinates */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 3" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 3" />

            {/* Micrococci grape clusters */}
            <g fill="#7c3aed" stroke="#6d28d9" strokeWidth="0.5" fillOpacity="0.85" className="animate-fade-in shadow">
              {/* Primary central cluster */}
              <circle cx="50" cy="50" r="2.8" />
              <circle cx="55" cy="51" r="2.8" />
              <circle cx="46" cy="48" r="2.8" />
              <circle cx="52" cy="45" r="2.8" />
              <circle cx="48" cy="54" r="2.8" />
              <circle cx="53" cy="56" r="2.8" />
              <circle cx="43" cy="52" r="2.8" />
              <circle cx="58" cy="47" r="2.8" />
              <circle cx="47" cy="43" r="2.8" />
              
              {/* Sub clusters around field */}
              <circle cx="28" cy="35" r="2.8" />
              <circle cx="32" cy="37" r="2.8" />
              <circle cx="29" cy="41" r="2.8" />

              <circle cx="72" cy="65" r="2.8" />
              <circle cx="76" cy="62" r="2.8" />
              <circle cx="69" cy="60" r="2.8" />
              <circle cx="73" cy="57" r="2.8" />
            </g>

            {/* Intrinsic epithelial background line */}
            <path d="M 20 20 Q 50 60 80 80" stroke="#334155" strokeWidth="0.8" fill="none" strokeDasharray="5 5" />
          </svg>
        </div>

        {/* Text descriptions and analytical keys */}
        <div className="space-y-3.5">
          <div className="bg-background/80 p-3 rounded border text-xs leading-relaxed space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-purple-400">
              <Settings className="w-3.5 h-3.5 text-purple-500" />
              Stain Properties
            </span>
            <p className="text-muted-foreground text-[11px]">
              Microscope set to <strong>oil immersion 1000x</strong> to trace cellular groupings. Staphylococcus aureus clusters appear as distinct deep purple spheres.
            </p>
          </div>

          <div className="p-3 bg-secondary/40 rounded border space-y-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-card-foreground">Diagnostic Indicator Keys:</h5>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                <span>Purple = Gram (+)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                <span>Pink = Gram (-)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">⚪</span>
                <span>Shape: Cocci</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">▰</span>
                <span>Shape: Bacilli</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Lab Component Router ---
export const MorphologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
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
    if (correct) {
      toast.success("Excellent Morphology Spotting!");
    } else {
      toast.error("Morphological mismatch. Read the theory.");
    }
  };

  const exerciseData = question as any;

  // Render the appropriate simulation based on componentId
  const getSimVisual = () => {
    switch (question.componentId) {
      case 'morph_case_1':
        return <CrystalSimulator activeId={question.componentId} />;
      case 'morph_case_2':
        return <CentrifugeSimulator />;
      case 'morph_case_3':
        return <GramStainSimulator />;
      default:
        return null;
    }
  };

  const VisualContent = (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="bg-gradient-to-br from-indigo-950/20 to-card rounded-xl p-5 border border-border shadow-md">
        <div className="text-xs font-bold mb-3 text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-indigo-500" /> Clinical Laboratory Active Simulation Stage
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-sans">
          Use the interactive features below to examine specimen morphology, simulate processes, and isolate core diagnostic structures.
        </p>

        {getSimVisual()}
      </div>
    </div>
  );

  const InteractionContent = (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm leading-relaxed">{question.question}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
        {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectAnswer(option)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAnswer === option
                      ? (showResult 
                          ? (isCorrect ? 'bg-green-600 text-white border-green-700' : 'bg-rose-600 text-white border-rose-700')
                          : 'bg-indigo-600 text-white border-indigo-700 shadow-md transform scale-[1.01]')
                      : 'bg-card hover:bg-muted text-card-foreground border-border'
              } ${showResult ? 'opacity-95 cursor-not-allowed' : ''}`}
            >
              <span className="font-semibold text-xs uppercase tracking-wide opacity-75 mr-2 font-mono">
                {selectedAnswer === option ? '✓' : '•'}
              </span>
              <span className="font-medium text-sm">{option}</span>
            </button>
        ))}
        </div>

        {!showResult && (
            <button 
                onClick={handleCheck} 
                disabled={!selectedAnswer} 
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
                Verify Diagnostic Discovery
            </button>
        )}

        {showResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
            {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                  {isCorrect ? 'Exquisite Classification!' : 'Morphological Discrepancy detected'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{question.explanation}</p>
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
            />
        }
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
        settings={settings}
    />
  );
};
