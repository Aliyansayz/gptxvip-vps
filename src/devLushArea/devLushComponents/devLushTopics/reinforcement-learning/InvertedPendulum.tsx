import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, XCircle, Bot, Flag, Bomb } from 'lucide-react';

interface ExerciseProps {
  exercises: Exercise[];
  step: number;
  onComplete: () => void;
}

export const InvertedPendulum: React.FC<ExerciseProps> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];
    const [simState, setSimState] = useState({ angle: 0.1, angularVelocity: 0, cartX: 150, cartV: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string|null>(null);
    const [feedback, setFeedback] = useState<{correct: boolean, text: string}|null>(null);

    const animFrame = useRef<number | null>(null);

    useEffect(() => {
        const simulate = () => {
            if (!isRunning) return;
            setSimState(s => {
                const g = 9.8;
                const poleLength = 50;

                // Simple PD controller to simulate the agent's policy
                const force = -150 * s.angle - 50 * s.angularVelocity;
                
                const angularAccel = (g * Math.sin(s.angle) - force * Math.cos(s.angle)) / poleLength;
                const newAngularVel = s.angularVelocity + angularAccel * 0.016;
                const newAngle = s.angle + newAngularVel * 0.016;
                
                let newCartV = s.cartV + force * 0.01;
                let newCartX = s.cartX + newCartV * 0.16;

                // Keep cart on screen
                if (newCartX < 50 || newCartX > 250) {
                   newCartV = -newCartV * 0.5; // Dampen velocity on hitting "walls"
                   newCartX = Math.max(50, Math.min(250, newCartX));
                }

                if (Math.abs(newAngle) > Math.PI / 2) {
                    toast.error("Pendulum fell!");
                    setIsRunning(false);
                }

                return { angle: newAngle, angularVelocity: newAngularVel, cartX: newCartX, cartV: newCartV };
            });

            animFrame.current = requestAnimationFrame(simulate);
        };
        if (isRunning) {
           animFrame.current = requestAnimationFrame(simulate);
        } else {
            if (animFrame.current) cancelAnimationFrame(animFrame.current);
        }
        return () => { if(animFrame.current) cancelAnimationFrame(animFrame.current) };
    }, [isRunning]);

    const resetSim = () => {
        setSimState({ angle: (Math.random() - 0.5) * 0.4, angularVelocity: 0, cartX: 150, cartV: 0 });
        setIsRunning(true);
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
                 <svg viewBox="0 0 300 150" className="w-full h-full">
                    <line x1="0" y1="100" x2="300" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
                    <g transform={`translate(${simState.cartX}, 100)`}>
                        <rect x="-20" y="-10" width="40" height="10" rx="2" className="fill-muted-foreground"/>
                        <g transform={`rotate(${-simState.angle * 180 / Math.PI})`}>
                            <line x1="0" y1="0" x2="0" y2="-50" stroke="hsl(var(--primary))" strokeWidth="4"/>
                            <circle cx="0" cy="-50" r="8" className="fill-primary"/>
                        </g>
                    </g>
                 </svg>
            </div>

            <div className="p-4 bg-muted rounded-lg text-center">
                <button onClick={resetSim} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    {isRunning ? 'Running...' : 'Start Simulation'}
                </button>
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
