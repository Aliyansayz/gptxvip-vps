import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, XCircle, Target } from 'lucide-react';

interface Attempt {
    angle: number;
    range: number;
    reward: number;
}

interface ExerciseProps {
  exercises: Exercise[];
  step: number;
  onComplete: () => void;
}

export const ProjectileLearner: React.FC<ExerciseProps> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [bestAngle, setBestAngle] = useState(90);
    const [maxReward, setMaxReward] = useState(-Infinity);
    const [isRunning, setIsRunning] = useState(false);
    
    const [selectedOption, setSelectedOption] = useState<string|null>(null);
    const [feedback, setFeedback] = useState<{correct: boolean, text: string}|null>(null);

    const intervalRef = useRef<number|null>(null);
    
    const startTraining = () => {
        setIsRunning(true);
        setAttempts([]);
        setBestAngle(90);
        setMaxReward(-Infinity);

        intervalRef.current = window.setInterval(() => {
            setAttempts(prev => {
                if (prev.length >= 50) {
                    setIsRunning(false);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    toast.success("Training complete!");
                    return prev;
                }

                // Simple exploration strategy: explore around the best-known angle
                const explorationNoise = 20 * (1 - prev.length / 50); // Noise decreases over time
                const newAngle = bestAngle + (Math.random() - 0.5) * explorationNoise;
                const clampedAngle = Math.max(1, Math.min(90, newAngle));
                
                const g = 9.8;
                const v0 = 50;
                const targetRange = 250;
                const range = (v0 * v0 * Math.sin(2 * clampedAngle * Math.PI / 180)) / g;
                
                // Reward is higher the closer to the target
                const reward = -Math.abs(range - targetRange);

                if (reward > maxReward) {
                    setMaxReward(reward);
                    setBestAngle(clampedAngle);
                }

                return [...prev, { angle: clampedAngle, range, reward }];
            });
        }, 100);
    };
    
     const checkAnswer = () => {
        if (!selectedOption) return;
        const isCorrect = selectedOption === exercise.answer;
        if (isCorrect) {
            toast.success("Correct!");
            setFeedback({correct: true, text: exercise.explanation});
            onComplete();
        } else {
            const feedbackObj = exercise.wrong_answer_feedback?.find(f => f.option === selectedOption);
            setFeedback({correct: false, text: feedbackObj?.feedback || 'Incorrect. Please try again.'});
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-center">{exercise.title}</h3>
            <p className="text-muted-foreground text-center">{exercise.prompt}</p>
            
            <div className="w-full h-80 bg-background rounded-lg p-4 border relative">
                 <svg viewBox="0 0 400 200" className="w-full h-full">
                    <line x1="0" y1="180" x2="400" y2="180" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
                    <Target x="240" y="160" className="w-10 h-10 text-destructive"/>
                    
                    {attempts.map((att, i) => (
                         <path key={i} d={`M 20 180 C ${20 + att.range/2} ${180 - att.range/2}, ${20 + att.range/2} ${180 - att.range/2}, ${20+att.range} 180`} stroke="hsl(var(--primary))" fill="none" strokeWidth="1" opacity={0.1 + (i/attempts.length)*0.9} />
                    ))}
                 </svg>
            </div>

            <div className="p-4 bg-muted rounded-lg text-center">
                <button onClick={startTraining} disabled={isRunning} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
                    {isRunning ? `Training... (${attempts.length}/50)` : 'Start Training'}
                </button>
                <p className="text-sm mt-2">Best Angle Found: <span className="font-bold">{bestAngle.toFixed(1)}°</span></p>
            </div>
            
            <div className={`p-4 rounded-lg bg-accent`}>
                <label className="font-semibold text-accent-foreground">{exercise.question}</label>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    {exercise.options?.map((option: string) => (
                        <button key={option} onClick={() => setSelectedOption(option)} className={`px-4 py-2 border rounded-lg ${selectedOption === option ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                            {option}
                        </button>
                    ))}
                </div>
                <button onClick={checkAnswer} disabled={!selectedOption} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Check Answer</button>
                {feedback && (
                     <div className={`mt-4 p-4 border-l-4 ${feedback.correct ? 'border-success-DEFAULT bg-success/10' : 'border-destructive bg-destructive/10'}`}>
                        <h5 className="font-bold flex items-center gap-2">{feedback.correct ? <CheckCircleIcon className="text-success-DEFAULT"/> : <XCircle className="text-destructive"/>} {feedback.correct ? "Correct!" : "Not Quite"}</h5>
                        <p className="text-sm mt-1">{feedback.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
