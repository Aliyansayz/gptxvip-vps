import React, { useState } from 'react';
import { toast } from 'sonner';
// FIX: Import Atom and Zap icons from lucide-react to resolve missing name errors.
import { CheckCircleIcon, BrainCircuit, Layers, Clock, Lightbulb, LayoutGrid, RectangleHorizontal, ChevronLeft, ChevronRight, Bot, Code, MessageSquare, Image as ImageIcon, FlaskConical, Languages, Atom, Zap } from 'lucide-react';

// --- Reusable Components ---

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; id: string }> = ({ title, icon, children, id }) => (
    <div id={id} className="bg-card border border-border rounded-2xl p-6 shadow-sm scroll-mt-20">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">{icon}<span className="ml-3">{title}</span></h2>
        <div className="space-y-4 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1">{children}</div>
    </div>
);

const ApplicationCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-background border border-border rounded-xl p-4 flex flex-col h-full">
        <h3 className="font-bold text-foreground flex items-center mb-2">{icon}<span className="ml-2">{title}</span></h3>
        <div className="text-xs text-muted-foreground flex-grow">{children}</div>
    </div>
);

const TimelineItem: React.FC<{ year: string; person: string; discovery: string; isLast: boolean }> = ({ year, person, discovery, isLast }) => (
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
    Languages: { icon: Languages, color: 'text-blue-500' },
    MessageSquare: { icon: MessageSquare, color: 'text-cyan-500' },
    Code: { icon: Code, color: 'text-green-500' },
    Image: { icon: ImageIcon, color: 'text-purple-500' },
    FlaskConical: { icon: FlaskConical, color: 'text-amber-500' },
    Bot: { icon: Bot, color: 'text-destructive' },
};

export const AnimationSlide1 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
        <style>{`
            .token-la-s1 { font-size: 8px; text-anchor: middle; fill: white; }
            .attn-line-la-s1 { stroke: hsl(var(--primary)); animation: attn-la-s1 3s ease-in-out infinite; }
            @keyframes attn-la-s1 { 
                0%, 100% { stroke-opacity: 0.2; stroke-width: 0.5; }
                50% { stroke-opacity: 1; stroke-width: 1.5; }
            }
        `}</style>
        <text x="50" y="15" className="token-la-s1 font-bold">jumps</text>
        <text x="15" y="45" className="token-la-s1">The</text>
        <text x="35" y="45" className="token-la-s1">quick</text>
        <text x="60" y="45" className="token-la-s1">brown</text>
        <text x="85" y="45" className="token-la-s1">fox</text>

        <path d="M 50 20 L 15 40" className="attn-line-la-s1" style={{animationDelay: '0.6s'}} fill="none" />
        <path d="M 50 20 L 35 40" className="attn-line-la-s1" style={{animationDelay: '0.4s'}} fill="none" />
        <path d="M 50 20 L 60 40" className="attn-line-la-s1" style={{animationDelay: '0.2s'}} fill="none" />
        <path d="M 50 20 L 85 40" className="attn-line-la-s1" style={{animationDelay: '0s'}} fill="none" />
    </svg>
);

export const AnimationSlide2 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
        <text x="50" y="15" textAnchor="middle" fontSize="8" fill="white">fox</text>
        <rect x="20" y="25" width="60" height="10" rx="2" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))"/>
        <text x="50" y="32" textAnchor="middle" fontSize="6" fill="white">Token Vector</text>
        
        <text x="50" y="45" textAnchor="middle" fontSize="12" fill="white">+</text>

        <rect x="20" y="50" width="60" height="10" rx="2" fill="hsl(var(--destructive)/0.2)" stroke="hsl(var(--destructive))"/>
        <text x="50" y="57" textAnchor="middle" fontSize="6" fill="white">Position Vector (pos=4)</text>
    </svg>
);

export const AnimationSlide3 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
        <style>{`.flow-la-s3 { animation: flow-s3 3s linear infinite; } @keyframes flow-s3 { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }`}</style>
        <rect x="5" y="25" width="20" height="10" fill="hsl(var(--muted))" />
        <path d="M 25 30 L 40 30" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />

        <g>
            <rect x="40" y="5" width="40" height="15" rx="2" fill="hsl(var(--primary)/0.2)" />
            <text x="60" y="15" textAnchor="middle" fontSize="6" fill="white">Head 1</text>
            <path d="M 40 12.5 L 80 12.5" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2 2" className="flow-la-s3" />
        </g>
        <g>
             <rect x="40" y="22.5" width="40" height="15" rx="2" fill="hsl(var(--destructive)/0.2)" />
             <text x="60" y="32.5" textAnchor="middle" fontSize="6" fill="white">Head 2</text>
             <path d="M 40 30 L 80 30" stroke="hsl(var(--destructive))" strokeWidth="1" strokeDasharray="2 2" className="flow-la-s3" style={{animationDelay: '0.2s'}}/>
        </g>
        <g>
             <rect x="40" y="40" width="40" height="15" rx="2" fill="hsl(var(--accent-foreground)/0.2)" />
             <text x="60" y="50" textAnchor="middle" fontSize="6" fill="white">Head 3</text>
              <path d="M 40 47.5 L 80 47.5" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeDasharray="2 2" className="flow-la-s3" style={{animationDelay: '0.4s'}}/>
        </g>
    </svg>
);

export const AnimationSlide4 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
        <style>{`.flow-la-s4 { animation: flow-s4 4s linear infinite; } @keyframes flow-s4 { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }`}</style>
        <text x="15" y="10" textAnchor="middle" fontSize="6" fill="white">Input</text>
        <rect x="5" y="15" width="20" height="30" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" />
        <path d="M 25 30 L 75 30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="100" className="flow-la-s4" />
        <text x="50" y="25" textAnchor="middle" fontSize="5" fill="white">Context</text>
        <text x="85" y="10" textAnchor="middle" fontSize="6" fill="white">Output</text>
        <rect x="75" y="15" width="20" height="30" fill="hsl(var(--destructive)/0.2)" stroke="hsl(var(--destructive))" />
    </svg>
);

export const AnimationSlide5 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
        <g fill="hsl(var(--primary))">
            <circle cx="20" cy="20" r="4"/>
            <circle cx="20" cy="40" r="4"/>
        </g>
        <g fill="hsl(var(--destructive))">
             <circle cx="50" cy="15" r="4"/>
             <circle cx="50" cy="30" r="4"/>
             <circle cx="50" cy="45" r="4"/>
        </g>
        <g fill="hsl(var(--accent-foreground))">
             <circle cx="80" cy="20" r="4"/>
             <circle cx="80" cy="40" r="4"/>
        </g>
        <g stroke="hsl(var(--border))" strokeWidth="0.5">
            <path d="M 20 20 L 50 15 M 20 20 L 50 30 M 20 20 L 50 45" />
            <path d="M 20 40 L 50 15 M 20 40 L 50 30 M 20 40 L 50 45" />
            <path d="M 50 15 L 80 20 M 50 15 L 80 40" />
            <path d="M 50 30 L 80 20 M 50 30 L 80 40" />
            <path d="M 50 45 L 80 20 M 50 45 L 80 40" />
        </g>
    </svg>
);

export const AnimationSlide6 = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full">
         <style>{`.flow-la-s6 { animation: flow-s6 3s linear infinite; } @keyframes flow-s6 { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }`}</style>
         <text x="15" y="33" fontSize="8" fill="white">x</text>
         <rect x="30" y="20" width="40" height="20" rx="2" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" />
         <text x="50" y="33" textAnchor="middle" fontSize="6" fill="white">F(x)</text>
         <text x="80" y="33" fontSize="12" fill="white">+</text>
         <text x="95" y="33" fontSize="8" fill="white">F(x)+x</text>
         <path d="M 18 30 L 30 30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="2 2" className="flow-la-s6" />
         <path d="M 70 30 L 77 30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="2 2" className="flow-la-s6" style={{animationDelay: '1s'}} />
         <path d="M 18 30 C 18 10, 77 10, 77 30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);

const animations = [
    AnimationSlide1, AnimationSlide2, AnimationSlide3, 
    AnimationSlide4, AnimationSlide5, AnimationSlide6
];

export const LanguageTransformerOverview: React.FC<{ exercise: any; onComplete: () => void; }> = ({ exercise, onComplete }) => {
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
            
            <SectionCard id="why-it-matters" title={why_it_matters.title} icon={<BrainCircuit className="w-6 h-6 text-primary"/>}>
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
                        <Layers className="w-6 h-6 text-primary"/><span className="ml-3">Key Concepts</span>
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
                        const IconComponent = appIconData ? appIconData.icon : Zap;
                        const iconColor = appIconData ? appIconData.color : 'text-primary';
                        return (
                             <ApplicationCard key={app.title} title={app.title} icon={<IconComponent className={`w-5 h-5 ${iconColor}`}/>}>
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

export default LanguageTransformerOverview;
