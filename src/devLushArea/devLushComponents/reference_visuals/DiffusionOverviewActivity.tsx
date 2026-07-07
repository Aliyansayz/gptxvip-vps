import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircleIcon, BrainCircuit, Atom, Clock, Lightbulb, LayoutGrid, RectangleHorizontal, ChevronLeft, ChevronRight, Image, FlaskConical, Music, Zap } from 'lucide-react';

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
    Image: { icon: Image, color: 'text-purple-500' },
    FlaskConical: { icon: FlaskConical, color: 'text-green-500' },
    Music: { icon: Music, color: 'text-blue-500' },
    Atom: { icon: Atom, color: 'text-yellow-500' }
};

export const AnimationSlide1 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .fade-noise-in { animation: fade-in-dl1 4s ease-in-out infinite; }
            @keyframes fade-in-dl1 { 
                0%, 100% { opacity: 0; }
                50% { opacity: 0.5; }
            }
        `}</style>
        <defs>
            <filter id='noise-filter-dl1'>
                <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
            </filter>
        </defs>
        <text x="50" y="60" fontSize="50" textAnchor="middle">🖼️</text>
        <rect width="100" height="100" filter='url(#noise-filter-dl1)' className="fade-noise-in"/>
    </svg>
);

export const AnimationSlide2 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .fade-noise-out { animation: fade-out-dl2 4s ease-in-out infinite; }
            @keyframes fade-out-dl2 { 
                0% { opacity: 0.5; }
                50%, 100% { opacity: 0; }
            }
        `}</style>
        <defs>
            <filter id='noise-filter-dl2'>
                <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
            </filter>
        </defs>
        <text x="50" y="60" fontSize="50" textAnchor="middle">🖼️</text>
        <rect width="100" height="100" filter='url(#noise-filter-dl2)' className="fade-noise-out"/>
    </svg>
);

export const AnimationSlide3 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <radialGradient id="peakGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="hsl(var(--primary)/0.4)" />
                <stop offset="100%" stopColor="hsl(var(--primary)/0)" />
            </radialGradient>
            <marker id="arrow-dl3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" /></marker>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#peakGrad)" />
        {Array.from({length: 8}).map((_, i) => (
            <path key={i} d="M 0 0 L 10 0" stroke="hsl(var(--primary))" strokeWidth="1" markerEnd="url(#arrow-dl3)" style={{transform: `translate(${50-25*Math.cos(i*Math.PI/4)}px, ${50-25*Math.sin(i*Math.PI/4)}px) rotate(${i*45+180}deg)`}}/>
        ))}
    </svg>
);

export const AnimationSlide4 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            .particle-dl4 { animation: move-dl4 4s ease-in-out infinite; }
            @keyframes move-dl4 {
                0% { transform: translate(20px, 80px); }
                50% { transform: translate(45px, 55px); }
                100% { transform: translate(50px, 50px); }
            }
        `}</style>
        <defs>
            <radialGradient id="peakGrad-dl4" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="hsl(var(--primary)/0.4)" />
                <stop offset="100%" stopColor="hsl(var(--primary)/0)" />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#peakGrad-dl4)" />
        <circle r="3" fill="hsl(var(--destructive))" className="particle-dl4" />
    </svg>
);

export const AnimationSlide5 = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <style>{`
            #morph-shape-dl5 { animation: morph-dl5 4s ease-in-out infinite alternate; }
            @keyframes morph-dl5 {
                from { d: path('M 50, 10 C 27.9, 10, 10, 27.9, 10, 50 C 10, 72.1, 27.9, 90, 50, 90 C 72.1, 90, 90, 72.1, 90, 50 C 90, 27.9, 72.1, 10, 50, 10 Z'); }
                to { d: path('M 20,20 L 80,20 L 80,80 L 20,80 Z'); }
            }
        `}</style>
        <path id="morph-shape-dl5" fill="hsl(var(--primary)/0.3)" stroke="hsl(var(--primary))" strokeWidth="2" />
    </svg>
);

const animations = [
    AnimationSlide1, AnimationSlide2, AnimationSlide3,
    AnimationSlide4, AnimationSlide5
];


export const OverviewActivity: React.FC<{ exercise: any; onComplete: (isCorrect: boolean) => void; }> = ({ exercise, onComplete }) => {
    const { why_it_matters, key_concepts, timeline, applications } = exercise;
    const [keyConceptsView, setKeyConceptsView] = useState<'slide' | 'grid'>('slide');
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % key_concepts.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + key_concepts.length) % key_concepts.length);

    const CurrentAnimation = animations[currentSlide] || (() => null);
    
    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete(true);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold  ">{exercise.title}</h2>
                <p className="text-muted-foreground mt-2">{exercise.prompt}</p>
            </div>
            
            <SectionCard id="why-it-matters" title={why_it_matters.title} icon={<Lightbulb className="w-6 h-6 text-primary"/>}>
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
                        <Zap className="w-6 h-6 text-primary"/><span className="ml-3">Key Concepts</span>
                    </h2>
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
                        <button onClick={() => setKeyConceptsView('slide')} className={`p-2 rounded-full ${keyConceptsView === 'slide' ? 'bg-background shadow' : 'text-muted-foreground'}`} aria-label="Slide View">
                            <RectangleHorizontal className="w-5 h-5"/>
                        </button>
                        <button onClick={() => setKeyConceptsView('grid')} className={`p-2 rounded-full ${keyConceptsView === 'grid' ? 'bg-background shadow' : 'text-muted-foreground'}`} aria-label="Grid View">
                            <LayoutGrid className="w-5 h-5"/>
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
                                <button onClick={prevSlide} className="p-3 bg-card rounded-full shadow border hover:bg-muted"><ChevronLeft className="w-6 h-6"/></button>
                                <span className="font-semibold text-muted-foreground">{currentSlide + 1} / {key_concepts.length}</span>
                                <button onClick={nextSlide} className="p-3 bg-card rounded-full shadow border hover:bg-muted"><ChevronRight className="w-6 h-6"/></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SectionCard id="timeline" title="Timeline of Discoveries" icon={<Clock className="w-6 h-6 text-primary"/>}>
                <div className="space-y-4">
                    {timeline.map((item: any, index: number) => (
                        <TimelineItem key={index} year={item.year} person={item.person} discovery={item.discovery} isLast={index === timeline.length - 1} />
                    ))}
                </div>
            </SectionCard>

            <SectionCard id="applications" title="Modern Applications" icon={<Atom className="w-6 h-6 text-primary"/>}>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
                    {applications.map((app: any) => {
                        const appIconData = iconMap[app.icon as keyof typeof iconMap];
                        if (!appIconData) return null;
                        const IconComponent = appIconData.icon;
                        return (
                             <ApplicationCard key={app.title} title={app.title} icon={<IconComponent className={`w-5 h-5 ${appIconData.color}`}/>}>
                                <p>{app.description}</p>
                            </ApplicationCard>
                        )
                    })}
                 </div>
            </SectionCard>

            <div className="p-4 bg-accent rounded-lg text-center">
                 <button onClick={handleComplete} className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto">
                    <CheckCircleIcon className="w-5 h-5"/>
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};
