import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, Network } from 'lucide-react';

export const SemanticMemoryActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Semantic Memory lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Semantic Memory'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Details knowledge graphs and vector database interactions.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <Network className="w-6 h-6 text-blue-500" />
                    <span className="ml-3">What is Semantic Memory?</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Semantic memory acts as an agent's long-term factual knowledge base. It stores concepts, definitions, facts, and relationships that the agent can retrieve when needed, bypassing the limitations of the short-term context window.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">Vector Databases & Knowledge Graphs</h3>
                        <p>
                            Semantic memory is typically implemented using vector databases (for similarity search over unstructured text) or knowledge graphs (for structured, relational data). When an agent faces a query, it searches this memory to find the most relevant facts before generating a response.
                        </p>
                    </div>
                    <div className="bg-blue-500/5 p-4 border border-blue-500/20 rounded-lg">
                        <h3 className="font-semibold text-blue-600 mb-2">Primary Use-Cases</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Retrieving company policies, documentation, or specialized domain knowledge.</li>
                            <li>Providing grounding for Retrieval-Augmented Generation (RAG).</li>
                            <li>Storing massive amounts of reference material that cannot fit in the prompt.</li>
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

export default SemanticMemoryActivity;
