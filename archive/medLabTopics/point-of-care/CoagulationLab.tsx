import React, { useState } from 'react';
import { Gauge } from 'lucide-react';
import { Exercise } from '../../../types';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { ChapterProps, TheoryPane } from './POCTShared';
import { RoadAnalogy } from './POCTVisuals';

export const CoagulationLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step] as Exercise & { value: number, unit: string, clinicalContext: string };
    const [resultVisible, setResultVisible] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswer = (opt: string) => {
        if(showResult) return;
        const correct = opt === exercise.answer;
        setSelectedAnswer(opt);
        setIsCorrect(correct);
        setShowResult(true);
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 text-sm">
                <span className="font-bold block mb-1">Patient Context:</span>{exercise.clinicalContext}
            </div>

            <div className="flex justify-center p-6 bg-muted/20 rounded-xl border">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border p-6 w-full max-w-sm text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">CoaguChek Result</div>
                    <div className={`text-6xl font-mono font-bold mb-2 ${resultVisible ? 'text-foreground' : 'text-transparent bg-muted rounded animate-pulse'}`}>
                        {resultVisible ? exercise.value : "8.8"}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground">{exercise.unit}</div>
                    {!resultVisible && <button onClick={() => setResultVisible(true)} className="mt-6 w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Run Test</button>}
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            {resultVisible && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-sm">
                        <Gauge className="w-4 h-4 text-blue-500" />
                        <span>Target Range: <strong>2.0 - 3.0</strong></span>
                    </div>
                    <p className="font-semibold">{exercise.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                        {exercise.options?.map(opt => (
                            <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} className={`p-3 border rounded text-left transition-colors ${selectedAnswer === opt ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'hover:bg-muted'}`}>
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
            theoryContent={<TheoryPane exercise={exercise} visual={resultVisible ? <RoadAnalogy value={exercise.value} /> : null} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
