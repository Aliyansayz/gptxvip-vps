import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircleIcon, Zap, Atom, Clock, Lightbulb, LayoutGrid, RectangleHorizontal, ChevronLeft, ChevronRight, BatteryCharging, FlaskConical, Plane, Sun, Thermometer } from 'lucide-react';

export const AnimationSlide1 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .atom-mp-ai1 { animation: organize-mp-ai1 6s ease-in-out infinite; }
            @keyframes organize-mp-ai1 {
                0%, 20% { opacity: 0; transform: translate(var(--randX), var(--randY)); }
                60%, 100% { opacity: 1; transform: translate(0, 0); }
            }
        `}</style>
        <g transform="translate(50 50)">
            {/* Final Grid */}
            <path d="M -20 -20 L 20 -20 L 20 20 L -20 20 Z" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
             <path d="M -10 -30 L 30 -30 L 30 10 L -10 10 Z" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
             <line x1="20" y1="-20" x2="30" y2="-30" stroke="hsl(var(--border))" strokeWidth="0.5"/>
             <line x1="20" y1="20" x2="30" y2="10" stroke="hsl(var(--border))" strokeWidth="0.5"/>
             <line x1="-20" y1="20" x2="-10" y2="10" stroke="hsl(var(--border))" strokeWidth="0.5"/>
        
            {/* Atoms */}
            <g>
                {[
                    { x: -20, y: -20 }, { x: 20, y: -20 }, { x: 20, y: 20 }, { x: -20, y: 20 },
                    { x: -10, y: -30 }, { x: 30, y: -30 }, { x: 30, y: 10 }, { x: -10, y: 10 }
                ].map((pos, i) => (
                    <circle 
                        key={i} 
                        cx={pos.x} 
                        cy={pos.y} 
                        r="3" 
                        fill="hsl(var(--primary))" 
                        className="atom-mp-ai1"
                        style={{'--randX': `${(Math.random()-0.5)*80}px`, '--randY': `${(Math.random()-0.5)*80}px`, animationDelay: `${i*0.1}s`} as React.CSSProperties}
                    />
                ))}
            </g>
        </g>
    </svg>
);

export const AnimationSlide2 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .label-mp-ai2 { animation: appear-mp-ai2 4s ease-in-out infinite; opacity: 0; }
            @keyframes appear-mp-ai2 {
                0%, 20% { opacity: 0; transform: scale(0.8); }
                40%, 80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.8); }
            }
        `}</style>
        <g transform="translate(50 50) scale(0.8)">
            <path d="M -25 -25 L 25 -25 L 25 25 L -25 25 Z" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
             <path d="M -15 -35 L 35 -35 L 35 15 L -15 15 Z" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
             <line x1="25" y1="-25" x2="35" y2="-35" stroke="hsl(var(--border))" strokeWidth="0.5"/>
             <line x1="25" y1="25" x2="35" y2="15" stroke="hsl(var(--border))" strokeWidth="0.5"/>
             <line x1="-25" y1="25" x2="-15" y2="15" stroke="hsl(var(--border))" strokeWidth="0.5"/>
             <circle cx="-25" cy="-25" r="3" fill="hsl(var(--primary))" />
             <circle cx="25" cy="-25" r="3" fill="hsl(var(--primary))"/>
             <circle cx="25" cy="25" r="3" fill="hsl(var(--primary))"/>
             <circle cx="-25" cy="25" r="3" fill="hsl(var(--primary))"/>
             <circle cx="-15" cy="-35" r="3" fill="hsl(var(--destructive))"/>
             <circle cx="35" cy="-35" r="3" fill="hsl(var(--destructive))"/>
             <circle cx="35" cy="15" r="3" fill="hsl(var(--destructive))"/>
             <circle cx="-15" cy="15" r="3" fill="hsl(var(--destructive))"/>
        </g>
        <text x="50" y="20" textAnchor="middle" fontSize="6" className="fill-green-500 label-mp-ai2">Stability: 98%</text>
        <text x="50" y="85" textAnchor="middle" fontSize="6" className="fill-blue-500 label-mp-ai2" style={{animationDelay: '1s'}}>Band Gap: 1.2eV</text>
    </svg>
);

export const AnimationSlide3 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <style>{`
            .loop-text-mp-ai3 { animation: fade-loop-mp-ai3 6s linear infinite; opacity: 0; }
            @keyframes fade-loop-mp-ai3 {
                0%, 100% { opacity: 0; }
                10%, 25% { opacity: 1; }
                33% { opacity: 0; }
            }
        `}</style>
        <circle cx="50" cy="50" r="30" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" fill="none">
             <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite" />
        </circle>
        
        <text x="50" y="15" textAnchor="middle" fontSize="10" className="loop-text-mp-ai3">🧬</text>
        <text x="85" y="55" textAnchor="middle" fontSize="10" className="loop-text-mp-ai3" style={{animationDelay: '2s'}}>⚙️</text>
        <text x="15" y="55" textAnchor="middle" fontSize="10" className="loop-text-mp-ai3" style={{animationDelay: '4s'}}>✔️</text>
        
        <text x="50" y="8" textAnchor="middle" fontSize="6" className="loop-text-mp-ai3">Generate</text>
        <text x="85" y="65" textAnchor="middle" fontSize="6" className="loop-text-mp-ai3" style={{animationDelay: '2s'}}>Simulate</text>
        <text x="15" y="65" textAnchor="middle" fontSize="6" className="loop-text-mp-ai3" style={{animationDelay: '4s'}}>Evaluate</text>
    </svg>
);

export const AnimationSlide4 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .rotate-group-mp-ai4 { animation: rotate-mp-ai4 5s linear infinite; transform-origin: 50px 50px; }
            @keyframes rotate-mp-ai4 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <g className="rotate-group-mp-ai4">
            <rect x="35" y="35" width="30" height="30" rx="2" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" strokeWidth="1" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="hsl(var(--destructive))" strokeWidth="1.5" markerEnd="url(#arrow-vec-mp-ai4)" />
            <text x="75" y="28" fontSize="6" className="fill-destructive">P</text>
        </g>
        <defs>
            <marker id="arrow-vec-mp-ai4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--destructive))" /></marker>
        </defs>
    </svg>
);

export const AnimationSlide5 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .data-point-mp-ai5 { animation: feed-in-mp-ai5 5s linear infinite; }
            @keyframes feed-in-mp-ai5 {
                0% { transform: scale(1); opacity: 1; }
                80% { transform: scale(0.1); opacity: 0.5; }
                100% { transform: scale(0.1); opacity: 0; }
            }
        `}</style>
        <text x="50" y="55" fontSize="24" textAnchor="middle">🧠</text>
        <g transform="translate(15, 15)" className="data-point-mp-ai5">
            <rect x="0" y="0" width="10" height="10" stroke="hsl(var(--primary))" fill="none" strokeWidth="0.5"/>
        </g>
        <g transform="translate(75, 15)" className="data-point-mp-ai5" style={{animationDelay: '1s'}}>
             <path d="M 0 5 L 5 0 L 10 5 L 5 10 Z" stroke="hsl(var(--destructive))" fill="none" strokeWidth="0.5"/>
        </g>
         <g transform="translate(15, 75)" className="data-point-mp-ai5" style={{animationDelay: '2s'}}>
            <path d="M 0 0 L 10 10 M 0 10 L 10 0" stroke="hsl(var(--accent-foreground))" fill="none" strokeWidth="0.5"/>
        </g>
         <g transform="translate(75, 75)" className="data-point-mp-ai5" style={{animationDelay: '3s'}}>
             <circle cx="5" cy="5" r="4" stroke="hsl(var(--green-500))" fill="none" strokeWidth="0.5"/>
        </g>
    </svg>
);

// --- Reusable Components ---

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    id: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, id }) => (
    <div id={id} className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h2>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">{children}</div>
    </div>
);

interface ApplicationCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ title, icon, children }) => (
    <div className="bg-background border border-border rounded-xl p-4 flex flex-col h-full">
        <h3 className="font-bold text-foreground flex items-center mb-2">{icon}<span className="ml-2">{title}</span></h3>
        <div className="text-xs text-muted-foreground flex-grow">{children}</div>
    </div>
);

interface TimelineItemProps {
    year: string;
    person: string;
    discovery: string;
    isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, person, discovery, isLast }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-background z-10"></div>
            {!isLast && <div className="w-0.5 flex-grow bg-border"></div>}
        </div>
        <div>
            <p className="font-bold text-primary">{year}: <span className="text-foreground">{person}</span></p>
            <p className="text-sm text-muted-foreground -mt-1">{discovery}</p>
        </div>
    </div>
);

const iconMap: { [key: string]: { icon: React.ComponentType<{ className?: string }>; color: string } } = {
    BatteryCharging: { icon: BatteryCharging, color: 'text-green-500' },
    FlaskConical: { icon: FlaskConical, color: 'text-cyan-500' },
    Zap: { icon: Zap, color: 'text-yellow-500' },
    Plane: { icon: Plane, color: 'text-blue-500' },
    Thermometer: { icon: Thermometer, color: 'text-orange-500' },
    Sun: { icon: Sun, color: 'text-amber-500' }
};

const animations = [
    AnimationSlide1, AnimationSlide2, AnimationSlide3,
    AnimationSlide4, AnimationSlide5
];

export const GenerativeAIDiscoveryOverview: React.FC<{ exercise: any; onComplete: () => void; }> = ({ exercise, onComplete }) => {
    const { why_it_matters, key_concepts, timeline, applications } = exercise;
    const [keyConceptsView, setKeyConceptsView] = useState<'slide' | 'grid'>('slide');
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % key_concepts.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + key_concepts.length) % key_concepts.length);

    const CurrentAnimation = animations[currentSlide] || (() => null);

    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold  ">{exercise.title}</h2>
                <p className="text-muted-foreground mt-2">{exercise.prompt}</p>
            </div>

            <SectionCard id="why-it-matters" title={why_it_matters.title} icon={<Lightbulb className="w-6 h-6 text-primary" />}>
                <p>{why_it_matters.intro}</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4 not-prose">
                    {why_it_matters.points.map((point: any, index: number) => (
                        <div key={index} className="bg-background p-4 rounded-lg border">
                            <h4 className="font-semibold text-foreground">{point.title}</h4>
                            <p className="text-xs">{point.text}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <div id="key-concepts" className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-card-foreground flex items-center">
                        <Zap className="w-6 h-6 text-primary" /><span className="ml-3">Key Concepts</span>
                    </h2>
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
                        <button onClick={() => setKeyConceptsView('slide')} className={`p-2 rounded-full ${keyConceptsView === 'slide' ? 'bg-background shadow' : 'text-muted-foreground'}`} aria-label="Slide View">
                            <RectangleHorizontal className="w-5 h-5" />
                        </button>
                        <button onClick={() => setKeyConceptsView('grid')} className={`p-2 rounded-full ${keyConceptsView === 'grid' ? 'bg-background shadow' : 'text-muted-foreground'}`} aria-label="Grid View">
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">
                    {keyConceptsView === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose animate-fade-in">
                            {key_concepts.map((concept: any, index: number) => {
                                const AnimationComponent = animations[index];
                                return (
                                    <div key={index} className="bg-background p-4 rounded-lg border h-full flex flex-col">
                                        <div className="h-32 bg-slate-900 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                                            {AnimationComponent ? <AnimationComponent /> : <p className="text-xs">Animation missing</p>}
                                        </div>
                                        <h4 className="font-semibold text-foreground text-sm">{concept.q}</h4>
                                        <p className="text-xs flex-grow mt-1">{concept.a}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="not-prose animate-fade-in">
                            <div className="bg-background p-4 rounded-lg border">
                                <div className="h-40 bg-slate-900 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                                    <CurrentAnimation />
                                </div>
                                <div className="text-center h-24">
                                    <h4 className="font-semibold text-foreground">{key_concepts[currentSlide].q}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{key_concepts[currentSlide].a}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button onClick={prevSlide} className="p-3 bg-card rounded-full shadow border hover:bg-muted"><ChevronLeft className="w-6 h-6" /></button>
                                <span className="font-semibold text-muted-foreground">{currentSlide + 1} / {key_concepts.length}</span>
                                <button onClick={nextSlide} className="p-3 bg-card rounded-full shadow border hover:bg-muted"><ChevronRight className="w-6 h-6" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SectionCard id="timeline" title="The AI-Powered Discovery Workflow" icon={<Clock className="w-6 h-6 text-primary" />}>
                <div className="space-y-4">
                    {timeline.map((item: any, index: number) => (
                        <TimelineItem key={index} year={item.year} person={item.person} discovery={item.discovery} isLast={index === timeline.length - 1} />
                    ))}
                </div>
            </SectionCard>

            <SectionCard id="applications" title="Potential Applications" icon={<Atom className="w-6 h-6 text-primary" />}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
                    {applications.map((app: any) => {
                        const appIconData = iconMap[app.icon as keyof typeof iconMap];
                        if (!appIconData) return null;
                        const IconComponent = appIconData.icon;
                        return (
                            <ApplicationCard key={app.title} title={app.title} icon={<IconComponent className={`w-5 h-5 ${appIconData.color}`} />}>
                                <p>{app.description}</p>
                            </ApplicationCard>
                        )
                    })}
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
