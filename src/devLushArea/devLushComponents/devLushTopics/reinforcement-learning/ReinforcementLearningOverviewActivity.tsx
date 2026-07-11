import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import katex from 'katex';
import { CheckCircleIcon, BrainCircuit, Bot, Target, Rocket } from 'lucide-react';
import 'katex/dist/katex.min.css';

// --- Reusable Components ---

const Formula = ({ tex, inline = false }: { tex: string, inline?: boolean }) => {
    const html = katex.renderToString(tex, { throwOnError: false, displayMode: !inline });
    const className = inline
        ? 'bg-muted px-1.5 py-0.5 rounded-md text-sm mx-1'
        : 'block my-3 text-center p-3 bg-background rounded-lg border';
    return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

const SectionCard = ({ title, icon, children, id }: { title: string, icon: React.ReactNode, children: React.ReactNode, id: string }) => (
    <div id={id} className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h2>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">{children}</div>
    </div>
);

const ExampleCard = ({ title, icon, children, visual }: { title: string, icon: React.ReactNode, children: React.ReactNode, visual: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
        <h3 className="font-bold text-card-foreground flex items-center mb-2">{icon}<span className="ml-2">{title}</span></h3>
        <div className="h-40 bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {visual}
        </div>
        <div className="text-xs text-muted-foreground flex-grow">{children}</div>
    </div>
);

export const ReinforcementLearningOverviewActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise.title}</h2>
                <p className="text-muted-foreground mt-2">{exercise.prompt}</p>
            </div>

            <SectionCard id="definition" title="What is Reinforcement Learning?" icon={<BrainCircuit className="w-6 h-6 text-primary" />}>
                <p>Reinforcement Learning (RL) is a field of artificial intelligence where a software 'agent' learns to make optimal decisions by interacting with a 'environment'. Unlike other types of machine learning, the agent isn't given a set of correct answers. Instead, it learns through trial and error, guided by a system of rewards and penalties.</p>
                <p>The goal is simple: <strong>maximize the total cumulative reward over time.</strong></p>
            </SectionCard>

            <SectionCard id="loop" title="The Agent-Environment Loop" icon={<Bot className="w-6 h-6 text-primary" />}>
                <div className="w-full h-48 bg-background rounded-lg p-4 flex items-center justify-center">
                    <svg viewBox="0 0 300 100" className="w-full h-full">
                        <defs>
                            <marker id="arrow-rl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker>
                        </defs>
                        <rect x="50" y="30" width="80" height="40" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
                        <text x="90" y="55" textAnchor="middle" fontSize="10" fill="#60a5fa" fontWeight="bold">AGENT</text>

                        <rect x="170" y="30" width="80" height="40" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                        <text x="210" y="55" textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="bold">ENVIRONMENT</text>

                        {/* Action Path */}
                        <path id="action-path" d="M 130 40 q 20 -20 40 0" stroke="#3b82f6" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-rl)" className="text-blue-500" />
                        <text x="150" y="15" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="bold">ACTION (A)</text>
                        <circle r="3" fill="#60a5fa">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M 130 40 q 20 -20 40 0" />
                        </circle>

                        {/* State/Reward Path */}
                        <path id="reward-path" d="M 170 60 q -20 20 -40 0" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-rl)" className="text-emerald-500" />
                        <text x="150" y="88" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="bold">STATE (S) + REWARD (R)</text>
                        <circle r="3" fill="#34d399">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M 170 60 q -20 20 -40 0" />
                        </circle>
                    </svg>
                </div>
                <p>The process is a continuous loop:</p>
                <ol>
                    <li>The agent observes the current <strong>state</strong> of the environment (e.g., the angle and velocity of a pendulum).</li>
                    <li>Based on its policy (strategy), it takes an <strong>action</strong> (e.g., apply a force to the left).</li>
                    <li>The environment updates to a new state and gives the agent a <strong>reward</strong> (e.g., +1 for every moment the pendulum is upright, -100 if it falls).</li>
                    <li>The agent uses this feedback to update its policy to get better rewards in the future.</li>
                </ol>
            </SectionCard>

            <SectionCard id="applications" title="Interactive Examples in Physics" icon={<Rocket className="w-6 h-6 text-primary" />}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ExampleCard title="Inverted Pendulum" icon={<Bot className="w-5 h-5 text-green-500" />} visual={
                        <svg viewBox="-50 -50 100 100" className="w-full h-full"><rect x="-40" y="10" width="80" height="10" fill="hsl(var(--muted-foreground))" /><rect x="-5" y="-40" width="10" height="50" fill="hsl(var(--primary))" style={{ transformOrigin: '0 10px' }}><animateTransform attributeName="transform" type="rotate" values="0; 5; -5; 0" dur="3s" repeatCount="indefinite" /></rect></svg>}>
                        A classic control theory problem. The agent must learn to apply forces to a cart to keep a pendulum balanced upright. The reward is given for every second it stays balanced.
                    </ExampleCard>
                    <ExampleCard title="Projectile Learner" icon={<Target className="w-5 h-5 text-red-500" />} visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full"><path d="M 10 50 C 30 10, 60 10, 80 50" strokeDasharray="2,2" stroke="hsl(var(--muted-foreground))" /><path d="M 10 50 C 35 15, 65 15, 90 40" stroke="hsl(var(--primary))" fill="none" strokeWidth="1.5" /><circle cx="90" cy="40" r="5" fill="hsl(var(--destructive))" /></svg>}>
                        An agent must learn the optimal launch angle and speed to hit a target. It receives rewards based on its proximity to the target, learning the principles of projectile motion through experimentation.
                    </ExampleCard>
                    <ExampleCard title="Rocket Lander" icon={<Rocket className="w-5 h-5 text-blue-500" />} visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full"><rect x="40" y="50" width="20" height="5" fill="hsl(var(--success-DEFAULT))" /><path d="M 50 10 L 45 20 L 55 20 Z M 48 20 L 48 30 L 52 30 L 52 20" fill="hsl(var(--primary))" /><path d="M 50 30 L 48 40 L 52 40 Z" fill="hsl(var(--destructive))" opacity="0.8"><animate attributeName="opacity" values="0.8; 0.2; 0.8" dur="1s" repeatCount="indefinite" /></path></svg>}>
                        The agent controls a rocket's thrusters to land softly. The reward function balances fuel efficiency with landing safety, forcing the agent to discover optimal control strategies like a "suicide burn".
                    </ExampleCard>
                </div>
            </SectionCard>

            <div className="p-4 bg-accent rounded-lg text-center">
                <button onClick={handleComplete} className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto">
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

