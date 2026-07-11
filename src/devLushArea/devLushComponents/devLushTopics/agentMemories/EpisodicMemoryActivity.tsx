import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, History } from 'lucide-react';

export const EpisodicMemoryActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Episodic Memory lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Episodic Memory'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Illustrates personalized, long-term interaction history.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <History className="w-6 h-6 text-emerald-500" />
                    <span className="ml-3">What is Episodic Memory?</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Episodic memory refers to the agent's ability to recall past events, specific interactions, and chronological experiences with a user or environment. It gives the agent a sense of "history" and continuity across multiple sessions.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">Personalization and Context</h3>
                        <p>
                            Unlike semantic memory (which stores general facts), episodic memory stores sequential logs of what happened, when it happened, and the specific actions taken. This is crucial for building personalized experiences where the AI remembers previous conversations.
                        </p>
                    </div>
                    <div className="bg-emerald-500/5 p-4 border border-emerald-500/20 rounded-lg">
                        <h3 className="font-semibold text-emerald-600 mb-2">Primary Use-Cases</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Recalling user preferences learned from past sessions (e.g., "You mentioned last week that...").</li>
                            <li>Reflecting on previous mistakes or successful workflows to adapt future behavior.</li>
                            <li>Maintaining long-term narrative continuity in virtual companions or tutors.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-4 text-center">
                <button onClick={handleComplete} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 inline-flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

export default EpisodicMemoryActivity;
