
import React from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { ActivityIcon, HeartIcon, BeakerIcon } from '../../icons';
import { Stethoscope, ClipboardList, BookOpen } from 'lucide-react';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    onComplete: () => void;
    // Optional props passed by runner
    infoVisible?: boolean;
    infoPlacement?: 'side' | 'bottom';
}

const FeatureCard = ({ title, icon, description, visual }: { title: React.ReactNode, icon: React.ReactNode, description: string, visual: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-card-foreground">{title}</h3>
        </div>
        <div className="h-32 bg-muted/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-border/50 relative">
            {visual}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export const MedOverview: React.FC<ChapterProps> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step];
    
    const handleStart = () => {
        toast.success("Welcome to MedLabs! Select a specialty to begin.");
        onComplete();
    };

    if (!exercise) return null;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-8">
                <div className="inline-flex p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 mb-2 shadow-sm">
                    <Stethoscope className="w-10 h-10" />
                </div>
                <h1 className="text-5xl md:text-6xl font-heading tracking-wide text-foreground">
                    Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">Simulations</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Bridge the gap between theory and practice. MedLabs offers interactive clinical scenarios designed to test your diagnostic reasoning and procedural knowledge in a risk-free environment.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard 
                    title={
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                            Cardiology
                        </span>
                    }
                    icon={<HeartIcon className="w-5 h-5"/>}
                    description="Master the electrical and mechanical functions of the heart. Interpret dynamic ECG rhythms and understand the cardiac cycle."
                    visual={
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                            <path d="M 0 25 L 10 25 L 15 10 L 20 40 L 25 25 L 35 25 L 40 20 L 45 25 L 100 25" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" style={{animationDuration: '2s'}}/>
                            <rect x="0" y="0" width="100" height="50" fill="url(#grid)" />
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
                                </pattern>
                            </defs>
                        </svg>
                    }
                />
                
                <FeatureCard 
                    title={
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                            Clinical Chemistry
                        </span>
                    }
                    icon={<BeakerIcon className="w-5 h-5"/>}
                    description="Analyze complex metabolic panels. Diagnose acid-base disturbances, electrolyte imbalances, and organ function based on lab data."
                    visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="20" y="20" width="15" height="30" rx="2" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" />
                            <rect x="45" y="10" width="15" height="40" rx="2" fill="hsl(var(--destructive)/0.2)" stroke="hsl(var(--destructive))" />
                            <rect x="70" y="30" width="15" height="20" rx="2" fill="hsl(var(--success)/0.2)" stroke="hsl(var(--success))" />
                            <line x1="10" y1="50" x2="90" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                        </svg>
                    }
                />

                <FeatureCard 
                    title={
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                            Diagnostics
                        </span>
                    }
                    icon={<ClipboardList className="w-5 h-5"/>}
                    description="Apply critical thinking to patient case studies. Synthesize symptoms, history, and test results to formulate accurate diagnoses."
                    visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="25" y="10" width="50" height="40" rx="2" fill="white" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                            <line x1="35" y1="20" x2="65" y2="20" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" />
                            <line x1="35" y1="30" x2="55" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="60" cy="35" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                            <line x1="68" y1="43" x2="75" y2="50" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />
            </div>

            {/* Philosophy Section */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <ActivityIcon className="w-6 h-6 text-cyan-400" />
                            Simulation-Based Learning
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            MedLabs is built on the principle that active application of knowledge leads to deeper retention. 
                            Instead of passive reading, you will interact with live physiological models, interpret raw data, and make clinical decisions.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleStart}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            Explore Specialties
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
