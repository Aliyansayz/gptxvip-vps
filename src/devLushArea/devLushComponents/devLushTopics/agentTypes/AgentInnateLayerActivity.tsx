import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, BrainCircuit } from 'lucide-react';

export const AgentInnateLayerActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Innate Layer lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || '1. The Innate Layer'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore the bedrock of an AI agent.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <BrainCircuit className="w-6 h-6 text-pink-500" />
                    <span className="ml-3">Parametric Memory</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        This is the bedrock. It represents the "instincts" and baseline knowledge baked directly into the neural network's weights during pre-training.
                    </p>
                    <div className="bg-pink-500/5 p-4 border border-pink-500/20 rounded-lg">
                        <h3 className="font-semibold text-pink-600 mb-2">Key Characteristics</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground">
                            <li>It doesn't update during runtime.</li>
                            <li>Dictates the model's fundamental reasoning capabilities.</li>
                            <li>Governs linguistic understanding and inherent world knowledge.</li>
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

export default AgentInnateLayerActivity;
