
import React from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, HeartIcon, ActivityIcon, DropletsIcon, ZapIcon } from '../../icons';
import { Microscope, Stethoscope, Scale } from 'lucide-react';

// --- Reusable Components ---

const SectionCard = ({ title, icon, children, id }: { title: string, icon: React.ReactNode, children?: React.ReactNode, id: string }) => (
    <div id={id} className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h2>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">{children}</div>
    </div>
);

const ExampleCard = ({ title, icon, children, visual }: { title: string, icon: React.ReactNode, children?: React.ReactNode, visual: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
        <h3 className="font-bold text-card-foreground flex items-center mb-2">{icon}<span className="ml-2">{title}</span></h3>
        <div className="h-40 bg-muted/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-border/50 relative">
            {visual}
        </div>
        <div className="text-xs text-muted-foreground flex-grow leading-relaxed">{children}</div>
    </div>
);

export const CardiologyOverview: React.FC<{ exercise: Exercise; onComplete: () => void; }> = ({ exercise, onComplete }) => {
    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex p-3 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 mb-2">
                    <HeartIcon className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-heading tracking-wide">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                        {exercise.title}
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground">{exercise.prompt}</p>
            </div>
            
            <SectionCard id="definition" title="What is Cardiology?" icon={<Stethoscope className="w-6 h-6 text-red-500"/>}>
                <p><strong>Cardiology</strong> is the branch of medicine dealing with disorders of the heart and the cardiovascular system. It encompasses the diagnosis and treatment of congenital heart defects, coronary artery disease, heart failure, valvular heart disease, and electrophysiology.</p>
                <p>At its core, the heart is a <strong>mechanical pump</strong> driven by an <strong>electrical system</strong> to sustain life by circulating blood.</p>
            </SectionCard>

            <SectionCard id="cycle" title="The Cardiac Cycle" icon={<ActivityIcon className="w-6 h-6 text-blue-500"/>}>
                <div className="w-full h-48 bg-background rounded-lg p-4 flex items-center justify-center border border-border/50">
                     <svg viewBox="0 0 400 120" className="w-full h-full">
                        {/* Diastole */}
                        <g transform="translate(50, 60)">
                            <circle cx="0" cy="0" r="30" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="4 2" />
                            <circle cx="0" cy="0" r="25" fill="hsl(var(--primary)/0.2)" />
                            <text x="0" y="5" textAnchor="middle" fontSize="8" fontWeight="bold">Diastole</text>
                            <text x="0" y="15" textAnchor="middle" fontSize="6">(Relaxation/Filling)</text>
                        </g>
                        
                        {/* Arrow 1 */}
                        <path d="M 90 60 L 130 60" stroke="hsl(var(--foreground))" strokeWidth="1.5" markerEnd="url(#arrow-cardio)" />

                        {/* Systole */}
                        <g transform="translate(170, 60)">
                            <circle cx="0" cy="0" r="20" fill="hsl(var(--destructive)/0.2)" stroke="hsl(var(--destructive))" strokeWidth="2" />
                            <text x="0" y="4" textAnchor="middle" fontSize="8" fontWeight="bold">Systole</text>
                            <text x="0" y="14" textAnchor="middle" fontSize="6">(Contraction/Pumping)</text>
                            {/* Force arrows */}
                            <path d="M -25 0 L -22 0" markerEnd="url(#arrow-force)" stroke="hsl(var(--destructive))" />
                            <path d="M 25 0 L 22 0" markerEnd="url(#arrow-force)" stroke="hsl(var(--destructive))" />
                            <path d="M 0 -25 L 0 -22" markerEnd="url(#arrow-force)" stroke="hsl(var(--destructive))" />
                            <path d="M 0 25 L 0 22" markerEnd="url(#arrow-force)" stroke="hsl(var(--destructive))" />
                        </g>

                        {/* Arrow 2 */}
                        <path d="M 210 60 L 250 60" stroke="hsl(var(--foreground))" strokeWidth="1.5" markerEnd="url(#arrow-cardio)" />

                        {/* Blood Flow */}
                        <g transform="translate(310, 60)">
                            <rect x="-40" y="-10" width="80" height="20" rx="10" fill="none" stroke="hsl(var(--foreground))" />
                            <circle cx="-30" cy="0" r="6" fill="#ef4444" className="animate-ping" style={{animationDuration: '1.5s'}} />
                            <circle cx="0" cy="0" r="6" fill="#ef4444" className="animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.2s'}} />
                            <circle cx="30" cy="0" r="6" fill="#ef4444" className="animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.4s'}} />
                            <text x="0" y="25" textAnchor="middle" fontSize="8">Systemic Circulation</text>
                        </g>

                        <defs>
                            <marker id="arrow-cardio" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--foreground))" /></marker>
                            <marker id="arrow-force" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--destructive))" /></marker>
                        </defs>
                    </svg>
                </div>
                <p>The heart operates in a rhythmic cycle:</p>
                <ul className="list-disc pl-5">
                    <li><strong>Diastole:</strong> The heart muscle relaxes and the chambers fill with blood.</li>
                    <li><strong>Systole:</strong> The heart muscle contracts and pumps blood out of the chambers into the arteries.</li>
                </ul>
            </SectionCard>

            <SectionCard id="areas" title="Key Areas of Study" icon={<Microscope className="w-6 h-6 text-green-500"/>}>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <ExampleCard title="Electrophysiology" icon={<ZapIcon className="w-5 h-5 text-yellow-500"/>} visual={
                         <svg viewBox="0 0 200 100" className="w-full h-full">
                             <polyline points="0,50 40,50 50,20 60,80 70,50 100,50 120,30 140,50 200,50" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                             <circle cx="120" cy="30" r="3" fill="#22c55e" className="animate-ping" />
                         </svg>}>
                        The study of the electrical activity of the heart. The ECG (Electrocardiogram) traces the depolarization waves (P, QRS, T) that trigger muscle contraction.
                    </ExampleCard>
                     <ExampleCard title="Hemodynamics" icon={<DropletsIcon className="w-5 h-5 text-red-500"/>} visual={
                         <svg viewBox="0 0 100 60" className="w-full h-full">
                             <rect x="10" y="20" width="80" height="20" rx="10" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                             <circle cx="20" cy="30" r="4" fill="#ef4444"><animate attributeName="cx" values="20;80" dur="2s" repeatCount="indefinite" /></circle>
                             <circle cx="35" cy="30" r="4" fill="#ef4444"><animate attributeName="cx" values="20;80" dur="2s" begin="0.3s" repeatCount="indefinite" /></circle>
                             <circle cx="50" cy="30" r="4" fill="#ef4444"><animate attributeName="cx" values="20;80" dur="2s" begin="0.6s" repeatCount="indefinite" /></circle>
                         </svg>}>
                        The dynamics of blood flow. It involves understanding pressure, flow, and resistance (e.g., blood pressure, cardiac output) within the vascular system.
                    </ExampleCard>
                    <ExampleCard title="Pathology" icon={<Scale className="w-5 h-5 text-orange-500"/>} visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full">
                            <path d="M 10 30 Q 30 10 50 30 T 90 30" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                            <path d="M 40 25 L 60 35 M 40 35 L 60 25" stroke="hsl(var(--destructive))" strokeWidth="4" />
                            <circle cx="50" cy="30" r="15" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="3 2" className="animate-spin-slow" />
                        </svg>}>
                        The study of heart diseases. Examples include atherosclerosis (plaque buildup), arrhythmias (irregular beats), and myocardial infarction (heart attack).
                    </ExampleCard>
                 </div>
            </SectionCard>
            
            <div className="p-4 bg-muted/30 border border-border rounded-lg text-center">
                 <button onClick={handleComplete} className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
                    <CheckCircleIcon className="w-5 h-5"/>
                    Start MedLabs Course
                </button>
            </div>
        </div>
    );
};
