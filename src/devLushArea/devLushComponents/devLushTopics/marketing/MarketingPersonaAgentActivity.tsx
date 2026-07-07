import React from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, Users, UserPlus } from 'lucide-react';

export const MarketingPersonaAgentActivity: React.FC<{ 
  exercises: Exercise[]; 
  step: number;
  onComplete: () => void; 
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Persona Generation Agent lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Persona Generation Agent'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore dynamic customer persona modeling.'}</p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <Users className="w-6 h-6 text-indigo-500"/>
                    <span className="ml-3">Concept Overview</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        This agent continuously analyzes customer behavioral data, purchase history, and feedback to dynamically generate and update user personas.
                    </p>
                    <div className="bg-indigo-500/5 p-4 border border-indigo-500/20 rounded-lg">
                        <h3 className="font-semibold text-indigo-600 mb-2 flex items-center"><UserPlus className="w-4 h-4 mr-2"/> How it works</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground text-sm">
                            <li><strong>Step 1:</strong> Ingests raw data from CRM, analytics tools, and social media.</li>
                            <li><strong>Step 2:</strong> Uses LLMs to identify emerging trends and common user characteristics.</li>
                            <li><strong>Step 3:</strong> Synthesizes data into structured, human-readable persona profiles.</li>
                            <li><strong>Step 4:</strong> Updates these personas continuously as new data arrives.</li>
                        </ul>
                    </div>
                    
                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto mt-4">
<pre><code><span className="text-[#8b949e]"># Example: Generating a persona from aggregated data</span>
def generate_persona(user_cluster_data):
    prompt = f<span className="text-[#a5d6ff]">"Analyze this cluster data and create a marketing persona: {"{user_cluster_data}"}"</span>
    
    persona = llm.generate(prompt)
    db.save_persona(persona)
    <span className="text-[#d2a8ff]">return</span> persona</code></pre>
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

export default MarketingPersonaAgentActivity;
