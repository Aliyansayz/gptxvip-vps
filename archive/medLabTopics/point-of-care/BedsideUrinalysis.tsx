import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { ChapterProps, TheoryPane } from './POCTShared';
import { DashboardAnalogy } from './POCTVisuals';

export const BedsideUrinalysis: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step] as Exercise & { pads: {name: string, color: string, result: string}[], clinicalContext?: string };
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

    const getColorClass = (color: string) => {
        switch(color) {
            case 'purple': return 'bg-purple-600';
            case 'pink': return 'bg-pink-400';
            case 'yellow': return 'bg-yellow-200';
            case 'teal': return 'bg-teal-300';
            default: return 'bg-gray-200';
        }
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* The Dipstick */}
                <div className="w-12 bg-white border rounded-full py-4 flex flex-col items-center gap-4 shadow-md">
                    {exercise.pads?.map((pad, i) => (
                        <div key={i} className={`w-8 h-8 rounded-sm ${getColorClass(pad.color)} shadow-inner border border-black/10`} title={pad.name}></div>
                    ))}
                </div>

                {/* Result Table */}
                <div className="flex-1 w-full bg-muted/20 rounded-xl border p-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Parameter</th>
                                <th className="text-left py-2">Result</th>
                                <th className="text-left py-2">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercise.pads?.map((pad, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="py-3 font-medium">{pad.name}</td>
                                    <td className="py-3 font-mono">{pad.result}</td>
                                    <td className="py-3 flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${getColorClass(pad.color)}`}></div>
                                        {(pad as any).abnormal ? <span className="text-red-500 font-bold text-xs">ABNORMAL</span> : <span className="text-muted-foreground text-xs">Normal</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-2 gap-3">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} className={`p-4 border rounded-lg text-left transition-all ${selectedAnswer === opt ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'hover:bg-muted'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            
            {showResult && <div className={`p-4 rounded border ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>{exercise.explanation}</div>}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} visual={<DashboardAnalogy />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
