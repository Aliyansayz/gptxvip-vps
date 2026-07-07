import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { TrendingDown, TrendingUp, GitCompareArrows, Zap, CheckCircleIcon } from 'lucide-react';

// --- Reusable Components ---

const Formula = ({ tex, inline = false }: { tex: string, inline?: boolean }) => {
    const html = katex.renderToString(tex, { throwOnError: false, displayMode: !inline });
    return <span className={inline ? 'bg-muted px-1.5 py-0.5 rounded-md' : 'block my-2 text-center'} dangerouslySetInnerHTML={{ __html: html }} />;
};

const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h3>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none">{children}</div>
    </div>
);

const Table = ({ headers, rows }: { headers: string[], rows: string[][] }) => (
    <div className="overflow-x-auto bg-background rounded-lg border border-border">
        <table className="w-full text-sm text-left">
            <thead className="bg-muted/50">
                <tr>{headers.map((h, i) => <th key={i} className="p-3 font-semibold text-foreground">{h}</th>)}</tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ConvexConcaveOverview: React.FC<{ exercise: Exercise; onComplete: () => void; }> = ({ exercise, onComplete }) => {
    const comparisonTableRows = [
        ['Shape', 'U-shaped (bowl)', '∩-shaped (dome)'], ['Goal', 'Minimize', 'Maximize'], ['Local = Global?', 'Yes', 'Yes'],
        ['Stability', 'Stable minimum', 'Unstable maximum'], ['Common In', 'Mechanics, ML, circuits', 'Thermodynamics, economics'],
    ];
    const physicsTableRows = [
        ['Mechanics (Lagrangian)', 'Convex', 'Minimize action'], ['Thermodynamics (Entropy)', 'Concave', 'Maximize entropy'],
        ['Electrostatics (Potential)', 'Convex/Concave', 'Depends on stability'], ['Quantum Mechanics', 'Convex', 'Ground state energy minimization'],
        ['Control Systems', 'Convex', 'Stable design under constraints'],
    ];
    
    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">{exercise.title}</h3>
            <p className="text-muted-foreground text-center">{exercise.prompt}</p>

            <SectionCard title="What is Optimization?" icon={<Zap className="w-6 h-6 text-primary"/>}>
                <p>Optimization is the process of finding the best solution (minimum or maximum) of a function under certain conditions.</p>
            </SectionCard>
            <div className="grid md:grid-cols-2 gap-6">
                <SectionCard title="Convex Optimization" icon={<TrendingDown className="w-6 h-6 text-success-DEFAULT"/>}>
                    <p>Minimizes a U-shaped function. Any local minimum is the global minimum, making solutions stable and easy to find.</p>
                    <Formula tex="f(\lambda x_1 + (1-\lambda)x_2) \le \lambda f(x_1) + (1-\lambda)f(x_2)" />
                </SectionCard>
                <SectionCard title="Concave Optimization" icon={<TrendingUp className="w-6 h-6 text-destructive"/>}>
                    <p>Maximizes an ∩-shaped function. Any local maximum is the global maximum.</p>
                    <Formula tex="f(\lambda x_1 + (1-\lambda)x_2) \ge \lambda f(x_1) + (1-\lambda)f(x_2)" />
                </SectionCard>
            </div>
            <SectionCard title="Comparison" icon={<GitCompareArrows className="w-6 h-6 text-primary"/>}>
                <Table headers={['Feature', 'Convex', 'Concave']} rows={comparisonTableRows} />
            </SectionCard>
            <SectionCard title="In Physics" icon={<Zap className="w-6 h-6 text-primary"/>}>
                <Table headers={['Field', 'Type', 'Why']} rows={physicsTableRows} />
            </SectionCard>

            <div className="p-4 bg-accent rounded-lg text-center">
                <p className="font-semibold text-accent-foreground">You have reviewed the overview. You can find the interactive challenges for each physics application as separate activities in the sidebar.</p>
                 <button onClick={handleComplete} className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto">
                    <CheckCircleIcon className="w-5 h-5"/>
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};
