import React, { useState, useEffect } from 'react';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BeakerIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon } from '../../icons';
import { Battery, Droplets, Flame, Gauge, Info, ChevronUp, ChevronDown } from 'lucide-react';
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

type LabValue = {
    name: string;
    value: number;
    unit: string;
    normalRange: [number, number];
    status: 'low' | 'normal' | 'high';
};

const TheoryPane: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
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
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
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

                        {(analogy || application) && <hr className="border-border opacity-50" />}

                        {analogy && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1">Real Life Analogy</h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1">Clinical Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Infographic Component for a Single System
const SystemGauge: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    status: 'low' | 'normal' | 'high'; 
    analogy: string;
    color: string;
    values: { name: string; value: number | string; unit: string }[] 
}> = ({ label, icon, status, analogy, color, values }) => {
    
    const getStatusColor = () => {
        if (status === 'low') return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        if (status === 'high') return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    };

    return (
        <div className={`p-4 rounded-xl border ${getStatusColor()} transition-all duration-300 hover:scale-[1.02] shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-background/50 ${color}`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide opacity-80">{label}</h4>
                        <span className="text-xs font-medium italic opacity-70">Analogy: {analogy}</span>
                    </div>
                </div>
                {status !== 'normal' && (
                    <span className="px-2 py-1 rounded bg-background/50 text-xs font-bold uppercase">
                        {status === 'high' ? 'High' : 'Low'}
                    </span>
                )}
            </div>
            
            <div className="space-y-2 bg-background/40 p-3 rounded-lg">
                {values.map((v, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{v.name}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold font-mono text-lg">{v.value}</span>
                            <span className="text-[10px] opacity-70">{v.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MetabolicPanel: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step] as Exercise & { values?: LabValue[], scenario?: string };
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        setShowResult(false);
        setIsCorrect(false);
        setSelectedAnswer(null);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const handleSelectAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === currentExercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        // onAnswered(correct); // Not passed in ChapterProps, handled locally or passed up if needed?
        // MedLabRunner handles onComplete, but not per-question answer tracking explicitly passed here.
        // Assuming local handling is fine for now.
        if (correct) toast.success("Correct Diagnosis!");
        else toast.error("Incorrect Diagnosis.");
    };

    // Helper to categorize values for the dashboard
    const getSystemValues = (type: 'electrolytes' | 'renal' | 'metabolic') => {
        if (!currentExercise.values) return { values: [], status: 'normal' as const };
        
        let targetNames: string[] = [];
        if (type === 'electrolytes') targetNames = ['Sodium', 'Potassium', 'Calcium'];
        if (type === 'renal') targetNames = ['BUN', 'Creatinine'];
        if (type === 'metabolic') targetNames = ['Glucose', 'Serum Osmolality', 'pH'];

        const values = currentExercise.values.filter(v => targetNames.includes(v.name));
        
        // Determine overall system status
        let status: 'low' | 'normal' | 'high' = 'normal';
        if (values.some(v => v.status === 'high')) status = 'high';
        else if (values.some(v => v.status === 'low')) status = 'low';

        return { values, status };
    };

    const electrolytes = getSystemValues('electrolytes');
    const renal = getSystemValues('renal');
    const metabolic = getSystemValues('metabolic');

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading text-3xl tracking-wider text-card-foreground flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <BeakerIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {currentExercise.title}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground border">Clinical Chemistry</span>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Patient Scenario</p>
                    <p className="text-lg font-medium">{currentExercise.scenario}</p>
                </div>
            </div>

            {/* Physiological Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SystemGauge 
                    label="Electrical System"
                    icon={<Battery className="w-5 h-5" />}
                    analogy="Battery/Circuits"
                    status={electrolytes.status}
                    color="text-yellow-600 dark:text-yellow-400"
                    values={electrolytes.values}
                />
                <SystemGauge 
                    label="Filtration System"
                    icon={<Droplets className="w-5 h-5" />}
                    analogy="Oil Filter/Waste"
                    status={renal.status}
                    color="text-blue-600 dark:text-blue-400"
                    values={renal.values}
                />
                <SystemGauge 
                    label="Fuel System"
                    icon={<Flame className="w-5 h-5" />}
                    analogy="Fuel Injection"
                    status={metabolic.status}
                    color="text-orange-600 dark:text-orange-400"
                    values={metabolic.values}
                />
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {currentExercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === option
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                                : 'bg-card hover:bg-muted hover:border-emerald-500/50'
                        } ${showResult ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <span className="font-medium">{option}</span>
                    </button>
                ))}
            </div>

            {!showResult && (
                <button 
                    onClick={handleCheckAnswer} 
                    disabled={!selectedAnswer} 
                    className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    Confirm Diagnosis
                </button>
            )}
            
            {showResult && (
                <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                    {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />}
                    <div>
                        <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Excellent clinical reasoning!' : 'Not quite.'}
                        </h4>
                        <p className="text-sm mt-1 text-muted-foreground">{currentExercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
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
