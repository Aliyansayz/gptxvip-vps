import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, BrainCircuit } from 'lucide-react';

export const InContextMemoryActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("In-Context Memory lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'In-Context Memory'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explains the LLM context window limits and use-cases.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                    <span className="ml-3">What is In-Context Memory?</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        In-context memory, also known as short-term memory, refers to the information the LLM can hold within its current context window. It consists of the conversation history, system prompts, and any documents provided in the immediate prompt.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">Context Window Limits</h3>
                        <p>
                            LLMs have a strict limit on how many tokens (words or sub-words) they can process at once. If the conversation exceeds this limit, older messages are "forgotten" or must be summarized, otherwise the model will return an error or truncate the input.
                        </p>
                    </div>
                    <div className="bg-primary/5 p-4 border border-primary/20 rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Primary Use-Cases</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Maintaining state during a single, ongoing conversation session.</li>
                            <li>Holding explicit, short-term instructions or system guidelines.</li>
                            <li>Providing immediate document context for question-answering tasks.</li>
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

export default InContextMemoryActivity;
