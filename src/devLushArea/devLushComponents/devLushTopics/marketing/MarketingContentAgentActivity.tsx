import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, MessageSquareText, Sparkles } from 'lucide-react';

export const MarketingContentAgentActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Personalized Content Agent lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Personalized Content Agent'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore hyper-personalized marketing copy generation.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <MessageSquareText className="w-6 h-6 text-emerald-500" />
                    <span className="ml-3">Concept Overview</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        This agent generates highly personalized marketing content (emails, SMS, ad copy) tailored to individual users or specific micro-segments, leveraging context and past interactions.
                    </p>
                    <div className="bg-emerald-500/5 p-4 border border-emerald-500/20 rounded-lg">
                        <h3 className="font-semibold text-emerald-600 mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2" /> How it works</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground text-sm">
                            <li><strong>Step 1:</strong> Retrieves user profile, past purchases, and current intent from the database.</li>
                            <li><strong>Step 2:</strong> Crafts a customized prompt combining brand guidelines and user context.</li>
                            <li><strong>Step 3:</strong> Uses an LLM to generate personalized copy tailored to the user's tone preference.</li>
                            <li><strong>Step 4:</strong> Dispatches the generated content via the appropriate marketing channel.</li>
                        </ul>
                    </div>

                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto mt-4">
                        <pre><code><span className="text-[#8b949e]"># Example: Generating personalized copy</span>
                            def generate_personalized_email(user_profile, product_recommendation):
                            prompt = f<span className="text-[#a5d6ff]">"Write a friendly email to {"{user_profile.name}"} recommending {"{product_recommendation.name}"}. Focus on their interest in {"{user_profile.main_interest}"}."</span>

                            email_copy = llm.generate(prompt, temperature=<span className="text-[#79c0ff]">0.7</span>)
                            email_service.send(user_profile.email, email_copy)</code></pre>
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

export default MarketingContentAgentActivity;
