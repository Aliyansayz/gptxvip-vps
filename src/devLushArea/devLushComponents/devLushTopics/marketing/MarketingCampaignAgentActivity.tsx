import React from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, TrendingUp, Target, BarChart } from 'lucide-react';

export const MarketingCampaignAgentActivity: React.FC<{ 
  exercises: Exercise[]; 
  step: number;
  onComplete: () => void; 
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Marketing Campaign Agent lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Campaign Optimization Agent'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore how to build an agent that manages marketing spend and creatives.'}</p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <TrendingUp className="w-6 h-6 text-fuchsia-500"/>
                    <span className="ml-3">Concept Overview</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        This marketing agent automates the A/B testing of ad creatives. It dynamically monitors engagement metrics (like Click-Through Rate) and automatically reallocates budget to the highest-performing variations.
                    </p>
                    <div className="bg-fuchsia-500/5 p-4 border border-fuchsia-500/20 rounded-lg">
                        <h3 className="font-semibold text-fuchsia-600 mb-2 flex items-center"><Target className="w-4 h-4 mr-2"/> How it works</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground text-sm">
                            <li><strong>Step 1:</strong> Deploys multiple variations of an ad across channels.</li>
                            <li><strong>Step 2:</strong> Monitors real-time analytics and engagement data via APIs.</li>
                            <li><strong>Step 3:</strong> Applies statistical models to determine the winning creative.</li>
                            <li><strong>Step 4:</strong> Autonomously shifts advertising spend to maximize ROI.</li>
                        </ul>
                    </div>
                    
                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto mt-4">
<pre><code><span className="text-[#8b949e]"># Example: Allocating budget based on performance</span>
def optimize_campaigns(campaigns):
    winning_campaign = max(campaigns, key=lambda c: c.ctr)
    
    <span className="text-[#8b949e]"># Reallocate 80% of total budget to the winner</span>
    api.update_budget(winning_campaign.id, total_budget * <span className="text-[#79c0ff]">0.8</span>)
    <span className="text-[#d2a8ff]">print</span>(f<span className="text-[#a5d6ff]">"Shifted budget to: {"{winning_campaign.name}"}"</span>)</code></pre>
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

export default MarketingCampaignAgentActivity;
