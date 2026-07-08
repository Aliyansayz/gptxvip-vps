import React, { useState } from 'react';
import { toast } from 'sonner';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { ChapterProps, TheoryPane } from './POCTShared';
import { CameraAnalogy } from './POCTVisuals';

export const POCTIntro: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step];
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSelect = (option: string) => {
        if(showResult) return;
        const correct = option === exercise.answer;
        setSelectedAnswer(option);
        setIsCorrect(correct);
        setShowResult(true);
        toast[correct ? 'success' : 'error'](correct ? 'Correct Classification!' : 'Incorrect.');
    };

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)} disabled={showResult} className={`p-4 border rounded-lg text-left transition-all ${selectedAnswer === opt ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700') : 'hover:bg-muted'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            
            {showResult && <div className={`p-4 rounded border ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{exercise.explanation}</div>}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={null}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} visual={<CameraAnalogy />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
