import React from 'react';
import { Exercise, LabData } from '../../../types';
import { toast } from 'sonner';
import { BeakerIcon, CheckCircleIcon } from '../../icons';
import { Skull, BookOpen, ShieldAlert, Activity, Leaf, Zap } from 'lucide-react';
import { ToxicologyAnalogyVisual } from './ToxicologyVisuals';

interface ChapterProps {
    labData: LabData;
    step: number;
    exercises: Exercise[];
    onComplete: () => void;
    infoVisible?: boolean;
    infoPlacement?: 'side' | 'bottom';
}

const SectionCard = ({ title, icon, children, id }: { title: string, icon: React.ReactNode, children?: React.ReactNode, id: string }) => (
    <div id={id} className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h2>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">{children}</div>
    </div>
);

const ExampleCard = ({ title, icon, children, visual }: { title: string, icon: React.ReactNode, children?: React.ReactNode, visual: React.ReactNode, key?: any }) => (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
        <h3 className="font-bold text-card-foreground flex items-center mb-2">{icon}<span className="ml-2">{title}</span></h3>
        <div className="h-40 bg-muted/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-border/50 relative">
            {visual}
        </div>
        <div className="text-xs text-muted-foreground flex-grow leading-relaxed">{children}</div>
    </div>
);

export const Toxicology: React.FC<ChapterProps> = ({ labData, exercises, step, onComplete }) => {
    const exercise = exercises[step];
    
    const handleStart = () => {
        toast.success(`Starting ${labData.chapter_title} Simulation...`);
        onComplete();
    };

    if (!exercise) return null;

    // Helper to pick an icon based on concept
    const getConceptIcon = (conceptName: string) => {
        const lower = conceptName.toLowerCase();
        if (lower.includes('metabolism') || lower.includes('liver')) return <Activity className="w-5 h-5 text-orange-500"/>;
        if (lower.includes('antidote') || lower.includes('treatment')) return <BeakerIcon className="w-5 h-5 text-green-500"/>;
        if (lower.includes('environment') || lower.includes('bioaccumulation')) return <Leaf className="w-5 h-5 text-emerald-500"/>;
        return <ShieldAlert className="w-5 h-5 text-red-500"/>;
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="text-center space-y-6 py-8">
                <div className="inline-flex p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 mb-2 shadow-sm">
                    <Skull className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading tracking-wide text-foreground">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                        {labData.chapter_title}
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {labData.theory_content?.title || "Toxicology Module"}
                </p>
            </div>

            <SectionCard id="theory" title="Theory & Overview" icon={<BeakerIcon className="w-6 h-6 text-cyan-500"/>}>
                <p>{labData.theory_content?.content}</p>
            </SectionCard>

            {labData.critical_concepts && labData.critical_concepts.length > 0 && (
                <SectionCard id="concepts" title="Critical Concepts" icon={<Zap className="w-6 h-6 text-yellow-500"/>}>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {labData.critical_concepts.map((concept, idx) => (
                            <ExampleCard 
                                key={idx} 
                                title={concept.concept} 
                                icon={getConceptIcon(concept.concept)} 
                                visual={<ToxicologyAnalogyVisual title={concept.concept} analogy={concept.definition} />}
                            >
                                {concept.definition}
                            </ExampleCard>
                         ))}
                     </div>
                </SectionCard>
            )}

            <div className="bg-slate-50 dark:bg-blue-950 text-slate-900 dark:text-slate-100 rounded-2xl p-8 relative overflow-hidden border border-slate-200 dark:border-blue-900">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                            <BookOpen className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                            Interactive Simulation
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Ready to test your knowledge? Start the interactive simulation to apply these concepts.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleStart}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Start Module
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
