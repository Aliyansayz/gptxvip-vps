import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, Network, History } from 'lucide-react';

export const AgentArchivalStorageActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Archival Storage lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || '3. The Archival Storage (Long-Term)'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore long-term semantic and episodic memories.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                        <Network className="w-6 h-6 text-blue-500" />
                        <span className="ml-3">Semantic Memory</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            The system's objective worldview.
                        </p>
                        <div className="bg-blue-500/5 p-4 border border-blue-500/20 rounded-lg">
                            <h3 className="font-semibold text-blue-600 mb-2">Key Characteristics</h3>
                            <ul className="list-disc list-inside space-y-1 text-card-foreground">
                                <li>Backed by knowledge graphs and vector databases.</li>
                                <li>Stores facts, concepts, and relationships.</li>
                                <li>Independent of personal experience (e.g., "Paris is the capital of France").</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                        <History className="w-6 h-6 text-emerald-500" />
                        <span className="ml-3">Episodic Memory</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            The system's personalized history.
                        </p>
                        <div className="bg-emerald-500/5 p-4 border border-emerald-500/20 rounded-lg">
                            <h3 className="font-semibold text-emerald-600 mb-2">Key Characteristics</h3>
                            <ul className="list-disc list-inside space-y-1 text-card-foreground">
                                <li>Records chronological "episodes" of user interactions.</li>
                                <li>Enables the AI to recall past conversations and preferences.</li>
                                <li>Remembers specific events (e.g., "Last week, the user asked me to write a script").</li>
                            </ul>
                        </div>
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

export default AgentArchivalStorageActivity;
