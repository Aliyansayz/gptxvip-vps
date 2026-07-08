import React, { useState } from 'react';
import { toast } from 'sonner';
import { Activity } from 'lucide-react';
import { Exercise } from '../../../types';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { ChapterProps, TheoryPane } from './POCTShared';

export const GlucoseLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step] as Exercise & { value: number, unit: string, clinicalContext: string };
    const [isTesting, setIsTesting] = useState(false);
    const [resultVisible, setResultVisible] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const runTest = () => {
        setIsTesting(true);
        setTimeout(() => { setIsTesting(false); setResultVisible(true); }, 2000);
    };

    const handleAnswer = (opt: string) => {
        if(showResult) return;
        const correct = opt === exercise.answer;
        setSelectedAnswer(opt);
        setIsCorrect(correct);
        setShowResult(true);
        toast[correct ? 'success' : 'error'](correct ? 'Correct Action' : 'Incorrect Action');
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 text-sm flex gap-3">
                <Activity className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div><span className="font-bold block mb-1">Clinical Context:</span>{exercise.clinicalContext}</div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800">
                <div className="relative w-48 h-80 bg-slate-800 rounded-3xl shadow-xl p-4 flex flex-col items-center border-4 border-slate-700">
                    {/* Screen */}
                    <div className="w-full h-32 bg-[#9ea792] shadow-inner rounded mb-6 flex items-center justify-center font-mono text-4xl text-black relative">
                        {isTesting ? <span className="animate-pulse">...</span> : resultVisible ? (
                            <div className="text-center">
                                <span className="text-5xl font-bold">{exercise.value}</span>
                                <span className="text-xs block mt-1">{exercise.unit}</span>
                            </div>
                        ) : <span className="text-sm opacity-50">INSERT STRIP</span>}
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                    </div>
                    {/* Strip Slot */}
                    <div className="w-16 h-2 bg-black rounded-full mt-auto mb-2"></div>
                    
                    {/* Strip Animation */}
                    {!resultVisible && !isTesting && (
                        <div className="absolute -bottom-10 animate-bounce cursor-pointer" onClick={runTest}>
                            <div className="w-8 h-24 bg-white border border-gray-300 rounded-t-md flex flex-col items-center justify-start pt-2 shadow-lg">
                                <div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
                                <span className="text-[10px] mt-1 text-gray-500">BLOOD</span>
                            </div>
                        </div>
                    )}
                </div>
                <p className="mt-8 text-sm text-muted-foreground font-medium">{!resultVisible ? "Click the strip to insert" : "Reading Complete"}</p>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            {resultVisible && (
                <div className="space-y-3 animate-fade-in">
                    <p className="font-semibold">{exercise.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exercise.options?.map(opt => (
                            <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} className={`p-4 border rounded-lg text-left transition-all ${selectedAnswer === opt ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'hover:bg-muted'}`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {showResult && <div className={`p-4 rounded border ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>{exercise.explanation}</div>}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
