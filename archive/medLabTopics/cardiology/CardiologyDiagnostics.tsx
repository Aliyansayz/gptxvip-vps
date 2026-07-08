import React, { useState, useEffect } from 'react';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { UserIcon, Activity, FileText, ClipboardList, Stethoscope, Thermometer, CheckCircle2, XCircle } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';

interface ChapterProps {
    labData: LabData;
    onComplete: () => void;
    onBack: () => void;
    step: number;
    setStep: (updater: number | ((s: number) => number)) => void;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

interface PatientCase extends Exercise {
    patient: {
        age: number;
        gender: string;
        history: string;
        complaint: string;
    };
    vitals: {
        bp: string;
        hr: number;
        rr: number;
        temp: number;
        o2: string;
    };
    tests: {
        name: string;
        result: string;
        flag?: 'normal' | 'abnormal' | 'critical';
    }[];
}

import { CardiologyAnalogyVisual } from './CardiologyVisuals';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

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
                    <BookOpenText className="w-5 h-5 text-cyan-500" />
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
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-4 h-4 text-yellow-500" />
                                    Real Life Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <CardiologyAnalogyVisual title={title} analogy={analogy} />
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-emerald-500" />
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

export const CardiologyDiagnostics: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'vitals' | 'labs'>('history');

    const currentExercise = exercises[step] as PatientCase;

    // Reset state when step changes
    React.useEffect(() => {
        setSelectedAnswer(null);
        setIsCorrect(false);
        setShowResult(false);
        setActiveTab('history');
    }, [step]);

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
        if (correct) toast.success("Correct Diagnosis!");
        else toast.error("Incorrect Diagnosis");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-heading text-3xl tracking-wider text-card-foreground">Electronic Health Record</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Confidential Patient Data</p>
                </div>
            </div>

            {/* Patient Chart UI */}
            <div className="border rounded-xl overflow-hidden bg-background shadow-inner">
                {/* Chart Header */}
                <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Patient #{(step + 1001).toString()}</p>
                            <p className="text-xs text-muted-foreground">{currentExercise.patient.age}yo {currentExercise.patient.gender}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded uppercase">
                            {currentExercise.difficulty || 'Urgent'}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-muted/50">
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-background border-t-2 border-t-cyan-500 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <FileText className="w-4 h-4" /> History
                    </button>
                    <button 
                        onClick={() => setActiveTab('vitals')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'vitals' ? 'bg-background border-t-2 border-t-cyan-500 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <Activity className="w-4 h-4" /> Vitals
                    </button>
                    <button 
                        onClick={() => setActiveTab('labs')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'labs' ? 'bg-background border-t-2 border-t-cyan-500 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <Stethoscope className="w-4 h-4" /> Tests
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 min-h-[200px]">
                    {activeTab === 'history' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <h4 className="text-sm font-bold text-muted-foreground uppercase mb-1">Chief Complaint</h4>
                                <p className="text-lg font-medium text-foreground">"{currentExercise.patient.complaint}"</p>
                            </div>
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase mb-1">History of Present Illness (HPI) & PMH</h4>
                                <p className="text-sm text-foreground leading-relaxed">{currentExercise.patient.history}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vitals' && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Blood Pressure</p>
                                <p className="text-2xl font-mono font-bold text-foreground">{currentExercise.vitals.bp} <span className="text-xs font-sans font-normal text-muted-foreground">mmHg</span></p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Heart Rate</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-mono font-bold text-foreground">{currentExercise.vitals.hr} <span className="text-xs font-sans font-normal text-muted-foreground">bpm</span></p>
                                    {currentExercise.vitals.hr > 100 && <Activity className="w-4 h-4 text-red-500 animate-pulse" />}
                                </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Resp. Rate</p>
                                <p className="text-2xl font-mono font-bold text-foreground">{currentExercise.vitals.rr} <span className="text-xs font-sans font-normal text-muted-foreground">/min</span></p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-bold uppercase">O2 Saturation</p>
                                <p className="text-2xl font-mono font-bold text-foreground">{currentExercise.vitals.o2}</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border col-span-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-bold uppercase">Temperature</p>
                                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-2xl font-mono font-bold text-foreground">{currentExercise.vitals.temp}°C</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'labs' && (
                        <div className="space-y-2 animate-fade-in">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">Test</th>
                                        <th className="px-3 py-2 text-right font-medium">Result</th>
                                        <th className="px-3 py-2 text-center font-medium">Flag</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {currentExercise.tests.map((test, idx) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-3 font-medium">{test.name}</td>
                                            <td className="px-3 py-3 text-right font-mono">{test.result}</td>
                                            <td className="px-3 py-3 text-center">
                                                {test.flag === 'critical' && <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" title="Critical" />}
                                                {test.flag === 'abnormal' && <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" title="Abnormal" />}
                                                {test.flag === 'normal' && <span className="inline-block w-2 h-2 rounded-full bg-green-500/50" title="Normal" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
                <p className="font-semibold text-lg mb-4">{currentExercise.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentExercise.options?.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSelectAnswer(option)}
                            disabled={showResult}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                selectedAnswer === option
                                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-md'
                                    : 'bg-card hover:bg-muted hover:border-cyan-500/50'
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
                        className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        Confirm Diagnosis
                    </button>
                )}
            </div>

            {showResult && (
                <div className={`p-4 rounded-xl border flex items-start gap-4 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Correct Diagnosis!' : 'Incorrect'}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{currentExercise.explanation}</p>
                        
                        {isCorrect && step === exercises.length - 1 && (
                             <button 
                                onClick={onComplete}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                Complete Module
                            </button>
                        )}
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
