import React from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, Database, Cog, Clock } from 'lucide-react';

export const AgentExecutionLayerActivity: React.FC<{ 
  exercises: Exercise[]; 
  step: number;
  onComplete: () => void; 
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Execution & Action Layer lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || '4. The Execution & Action Layer'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore external, procedural, and prospective memories.'}</p>
            </div>
            
            <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                        <Database className="w-6 h-6 text-purple-500"/>
                        <span className="ml-3">External Memory</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            The AI's physical filing cabinet.
                        </p>
                        <div className="bg-purple-500/5 p-4 border border-purple-500/20 rounded-lg">
                            <ul className="list-disc list-inside space-y-1 text-card-foreground">
                                <li>Involves structured integrations with external databases (SQL, NoSQL), APIs, or local file systems.</li>
                                <li>Allows the AI to explicitly read and write structured data.</li>
                                <li>Bypasses the fuzziness of vector embeddings.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                        <Cog className="w-6 h-6 text-orange-500"/>
                        <span className="ml-3">Procedural Memory</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            The "muscle memory" of the AI.
                        </p>
                        <div className="bg-orange-500/5 p-4 border border-orange-500/20 rounded-lg">
                            <ul className="list-disc list-inside space-y-1 text-card-foreground">
                                <li>Contains internalized instruction patterns and system prompts.</li>
                                <li>Encompasses execution workflows like ReAct or Chain-of-Thought.</li>
                                <li>Teaches the agent how to use tools, route tasks, or format outputs.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                        <Clock className="w-6 h-6 text-amber-500"/>
                        <span className="ml-3">Prospective Memory</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            The "future" memory.
                        </p>
                        <div className="bg-amber-500/5 p-4 border border-amber-500/20 rounded-lg">
                            <ul className="list-disc list-inside space-y-1 text-card-foreground">
                                <li>Manages scheduled actions, event listeners, and timers.</li>
                                <li>Allows an agent to remember to execute a specific task at a later time.</li>
                                <li>Checks conditions at predefined points in time.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 text-center">
                 <button onClick={handleComplete} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 inline-flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5"/>
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

export default AgentExecutionLayerActivity;
