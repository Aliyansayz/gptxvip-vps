import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, Activity } from 'lucide-react';

export const AgentWorkingStateActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Working State lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || '2. The Working State'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore the AI\'s working memory.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">InContext Memory</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Functioning as the AI's "working memory," this is bounded by the context window limit (e.g., 128k or 1M tokens).
                    </p>
                    <div className="bg-indigo-500/5 p-4 border border-indigo-500/20 rounded-lg">
                        <h3 className="font-semibold text-indigo-600 mb-2">Key Characteristics</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground">
                            <li>Holds the immediate prompt and current conversation history.</li>
                            <li>Maintains any transient scratchpad reasoning required for the immediate task.</li>
                            <li>Once the session ends or the context clears, this memory is wiped.</li>
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

export default AgentWorkingStateActivity;
