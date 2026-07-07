import React, { useState } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, Bot, Network, BrainCircuit, Workflow, LayoutGrid, Presentation, ArrowRight } from 'lucide-react';

// --- Reusable Components ---
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

// --- Animations ---
export const ReActAnimationSlide = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full font-sans">
        <style>{`
            .react-signal { animation: pulse-signal 4s linear infinite; opacity: 0; }
            @keyframes pulse-signal {
                0%, 100% { opacity: 0; transform: scale(0.8); }
                10%, 25% { opacity: 1; transform: scale(1.1); }
                30% { opacity: 0; transform: scale(0.8); }
            }
            .pulse-text-1 { animation: highlight-text 4s linear infinite; }
            .pulse-text-2 { animation: highlight-text 4s linear infinite; animation-delay: 1.33s; }
            .pulse-text-3 { animation: highlight-text 4s linear infinite; animation-delay: 2.66s; }
            @keyframes highlight-text {
                0%, 100% { fill: hsl(var(--muted-foreground)); font-weight: normal; }
                10%, 20% { fill: hsl(var(--primary)); font-weight: bold; }
                30% { fill: hsl(var(--muted-foreground)); font-weight: normal; }
            }
        `}</style>
        
        {/* Base Triangle Layout for ReAct */}
        <path d="M 50 20 L 80 70 L 20 70 Z" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        
        {/* Nodes */}
        <circle cx="50" cy="20" r="12" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <circle cx="80" cy="70" r="12" fill="hsl(var(--card))" stroke="hsl(var(--accent-foreground))" strokeWidth="1.5" />
        <circle cx="20" cy="70" r="12" fill="hsl(var(--card))" stroke="hsl(var(--destructive))" strokeWidth="1.5" />

        {/* Signals running along paths */}
        <circle cx="50" cy="20" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" className="react-signal" style={{transformOrigin: '50px 20px'}} />
        <circle cx="80" cy="70" r="15" fill="none" stroke="hsl(var(--accent-foreground))" strokeWidth="2" className="react-signal" style={{transformOrigin: '80px 70px', animationDelay: '1.33s'}} />
        <circle cx="20" cy="70" r="15" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" className="react-signal" style={{transformOrigin: '20px 70px', animationDelay: '2.66s'}} />

        {/* Labels */}
        <text x="50" y="22" textAnchor="middle" fontSize="6" className="pulse-text-1">Thought</text>
        <text x="80" y="72" textAnchor="middle" fontSize="6" className="pulse-text-2">Action</text>
        <text x="20" y="72" textAnchor="middle" fontSize="6" className="pulse-text-3">Observe</text>
    </svg>
);

export const OrchestratorAnimationSlide = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full font-sans">
        <style>{`
            .packet-out { animation: fly-out 3s ease-in-out infinite; }
            .packet-in { animation: fly-in 3s ease-in-out infinite; }
            @keyframes fly-out {
                0% { opacity: 0; transform: translate(50px, 50px); }
                20% { opacity: 1; transform: translate(50px, 50px); }
                50% { opacity: 1; transform: translate(var(--targetX), var(--targetY)); }
                60%, 100% { opacity: 0; transform: translate(var(--targetX), var(--targetY)); }
            }
            @keyframes fly-in {
                0%, 50% { opacity: 0; transform: translate(var(--targetX), var(--targetY)); }
                60% { opacity: 1; transform: translate(var(--targetX), var(--targetY)); }
                90% { opacity: 1; transform: translate(50px, 50px); }
                100% { opacity: 0; transform: translate(50px, 50px); }
            }
        `}</style>
        
        {/* Connections */}
        <line x1="50" y1="50" x2="20" y2="20" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="50" y1="50" x2="80" y2="20" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="50" y1="50" x2="50" y2="90" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />

        {/* Worker Nodes */}
        <rect x="10" y="10" width="20" height="20" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="20" y="22" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W1</text>
        <rect x="70" y="10" width="20" height="20" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="80" y="22" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W2</text>
        <rect x="40" y="80" width="20" height="20" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="50" y="92" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W3</text>

        {/* Central Orchestrator */}
        <circle cx="50" cy="50" r="15" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary))" strokeWidth="2" />
        <text x="50" y="52" textAnchor="middle" fontSize="5" className="fill-primary font-bold">ROUTER</text>

        {/* Animated Data Packets (Outbound) */}
        <circle r="2" fill="hsl(var(--primary))" className="packet-out" style={{'--targetX': '20px', '--targetY': '20px'} as any} />
        <circle r="2" fill="hsl(var(--primary))" className="packet-out" style={{'--targetX': '80px', '--targetY': '20px', animationDelay: '0.5s'} as any} />
        <circle r="2" fill="hsl(var(--primary))" className="packet-out" style={{'--targetX': '50px', '--targetY': '90px', animationDelay: '1.0s'} as any} />
        
        {/* Animated Data Packets (Inbound results) */}
        <circle r="2" fill="hsl(var(--success-DEFAULT, #22c55e))" className="packet-in" style={{'--targetX': '20px', '--targetY': '20px'} as any} />
        <circle r="2" fill="hsl(var(--success-DEFAULT, #22c55e))" className="packet-in" style={{'--targetX': '80px', '--targetY': '20px', animationDelay: '0.5s'} as any} />
        <circle r="2" fill="hsl(var(--success-DEFAULT, #22c55e))" className="packet-in" style={{'--targetX': '50px', '--targetY': '90px', animationDelay: '1.0s'} as any} />
    </svg>
);

export const EvaluatorOptimizerAnimationSlide = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full font-sans">
        <style>{`
            .eo-signal-forward { animation: eo-forward 4s linear infinite; }
            .eo-signal-backward { animation: eo-backward 4s linear infinite; }
            .eo-text-forward { animation: eo-highlight-f 4s linear infinite; }
            .eo-text-backward { animation: eo-highlight-b 4s linear infinite; }
            
            @keyframes eo-forward {
                0%, 20% { opacity: 0; transform: translate(30px, 50px); }
                30% { opacity: 1; transform: translate(50px, 50px); }
                40% { opacity: 1; transform: translate(70px, 50px); }
                50%, 100% { opacity: 0; transform: translate(70px, 50px); }
            }
            @keyframes eo-backward {
                0%, 60% { opacity: 0; transform: translate(70px, 50px); }
                70% { opacity: 1; transform: translate(50px, 20px); }
                80% { opacity: 1; transform: translate(30px, 50px); }
                90%, 100% { opacity: 0; transform: translate(30px, 50px); }
            }
            @keyframes eo-highlight-f {
                0%, 100% { fill: hsl(var(--muted-foreground)); font-weight: normal; }
                20%, 50% { fill: hsl(var(--primary)); font-weight: bold; }
            }
            @keyframes eo-highlight-b {
                0%, 100% { fill: hsl(var(--muted-foreground)); font-weight: normal; }
                60%, 90% { fill: hsl(var(--destructive)); font-weight: bold; }
            }
        `}</style>
        
        {/* Paths */}
        <path d="M 30 50 L 70 50" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M 70 50 Q 50 10 30 50" stroke="hsl(var(--destructive)/0.5)" fill="none" strokeWidth="2" strokeDasharray="4 2" />

        {/* Nodes */}
        <rect x="15" y="40" width="30" height="20" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <text x="30" y="52" textAnchor="middle" fontSize="6" className="eo-text-forward">Generator</text>

        <rect x="55" y="40" width="30" height="20" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--destructive))" strokeWidth="1.5" />
        <text x="70" y="52" textAnchor="middle" fontSize="6" className="eo-text-backward">Evaluator</text>

        <text x="50" y="30" textAnchor="middle" fontSize="5" className="eo-text-backward">Feedback Loop</text>

        {/* Signals */}
        <circle r="3" fill="hsl(var(--primary))" className="eo-signal-forward" />
        <circle r="3" fill="hsl(var(--destructive))" className="eo-signal-backward" />
    </svg>
);

export const ParallelFanoutAnimationSlide = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full font-sans">
        <style>{`
            .pf-signal-out { animation: pf-out 3s ease-in-out infinite; }
            .pf-signal-in { animation: pf-in 3s ease-in-out infinite; }
            
            @keyframes pf-out {
                0% { opacity: 0; transform: translate(15px, 50px); }
                10%, 40% { opacity: 1; transform: translate(30px, var(--targetY)); }
                50%, 100% { opacity: 0; transform: translate(50px, var(--targetY)); }
            }
            @keyframes pf-in {
                0%, 50% { opacity: 0; transform: translate(50px, var(--targetY)); }
                60%, 90% { opacity: 1; transform: translate(70px, var(--targetY)); }
                100% { opacity: 0; transform: translate(85px, 50px); }
            }
        `}</style>
        
        {/* Paths */}
        <path d="M 15 50 L 30 20 L 50 20 L 70 20 L 85 50" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 15 50 L 30 50 L 50 50 L 70 50 L 85 50" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 15 50 L 30 80 L 50 80 L 70 80 L 85 50" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />

        {/* Start / End */}
        <circle cx="15" cy="50" r="8" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <circle cx="85" cy="50" r="8" fill="hsl(var(--accent-foreground)/0.2)" stroke="hsl(var(--accent-foreground))" strokeWidth="1.5" />

        {/* Parallel Nodes */}
        <rect x="40" y="10" width="20" height="20" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="50" y="22" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W1</text>
        <rect x="40" y="40" width="20" height="20" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="50" y="52" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W2</text>
        <rect x="40" y="70" width="20" height="20" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x="50" y="82" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">W3</text>

        {/* Outbound Signals */}
        <circle r="2.5" fill="hsl(var(--primary))" className="pf-signal-out" style={{'--targetY': '20px'} as any} />
        <circle r="2.5" fill="hsl(var(--primary))" className="pf-signal-out" style={{'--targetY': '50px'} as any} />
        <circle r="2.5" fill="hsl(var(--primary))" className="pf-signal-out" style={{'--targetY': '80px'} as any} />

        {/* Inbound Signals */}
        <circle r="2.5" fill="hsl(var(--success-DEFAULT, #22c55e))" className="pf-signal-in" style={{'--targetY': '20px'} as any} />
        <circle r="2.5" fill="hsl(var(--success-DEFAULT, #22c55e))" className="pf-signal-in" style={{'--targetY': '50px'} as any} />
        <circle r="2.5" fill="hsl(var(--success-DEFAULT, #22c55e))" className="pf-signal-in" style={{'--targetY': '80px'} as any} />
    </svg>
);


const agentArchitectures = [
    { title: "ReAct Pattern", desc: "Interleaves reasoning traces (thought) with actions (tools). Enables agents to adapt plans based on observations.", Animation: ReActAnimationSlide },
    { title: "Orchestrator-Worker", desc: "A central LLM breaks down tasks and delegates to sub-agents, handling complex routing and aggregation.", Animation: OrchestratorAnimationSlide },
    { title: "Evaluator-Optimizer", desc: "One agent generates solutions while another critiques them in a feedback loop until criteria are met.", Animation: EvaluatorOptimizerAnimationSlide },
    { title: "Parallel Fanout", desc: "Dispatches the same prompt or sub-tasks to multiple agents simultaneously to aggregate diverse perspectives or speed up execution.", Animation: ParallelFanoutAnimationSlide },
];

export const AgentOverviewActivity: React.FC<{ 
  exercises: Exercise[]; 
  step: number;
  onComplete: () => void; 
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];
    const [keyConceptsView, setKeyConceptsView] = useState<'slide' | 'grid'>('slide');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleComplete = () => {
        toast.success("Overview marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise.title}</h2>
                <p className="text-muted-foreground mt-2">{exercise.prompt}</p>
                {exercise.question && <p className="text-muted-foreground mt-2 font-semibold">{exercise.question}</p>}
            </div>
            
            <SectionCard id="definition" title="What is an AI Agent?" icon={<Bot className="w-6 h-6 text-primary"/>}>
                <p>An AI Agent is a system powered by a large language model (LLM) that can perceive its environment, make decisions, and take actions using tools to achieve a specific goal.</p>
                <p>Unlike standard LLM interactions (like chatbots) which only return text, agents have <strong>agency</strong>—they can execute code, search the web, read files, or call external APIs autonomously in order to solve complex problems.</p>
                
                <div className="w-full h-40 bg-muted/30 rounded-lg p-4 flex items-center justify-center mt-6">
                     <svg viewBox="0 0 300 100" className="w-full h-full">
                        <rect x="20" y="30" width="60" height="40" rx="5" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <text x="50" y="55" textAnchor="middle" fontSize="10" className="font-bold fill-primary">User</text>
                        
                        <rect x="120" y="30" width="60" height="40" rx="5" fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent-foreground))" strokeWidth="2" />
                        <text x="150" y="55" textAnchor="middle" fontSize="10" className="font-bold fill-accent-foreground">Agent</text>
                        
                        <rect x="220" y="30" width="60" height="40" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
                        <text x="250" y="55" textAnchor="middle" fontSize="10" className="font-bold fill-muted-foreground">Tools</text>

                        <path d="M 80 40 L 115 40" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-agent)" />
                        <text x="97" y="35" textAnchor="middle" fontSize="7">Goal</text>
                        
                        <path d="M 115 60 L 80 60" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-agent)" />
                        <text x="97" y="70" textAnchor="middle" fontSize="7">Result</text>

                        <path d="M 180 40 L 215 40" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-agent)" />
                        <text x="197" y="35" textAnchor="middle" fontSize="7" className="fill-primary">Action</text>
                        
                        <path d="M 215 60 L 180 60" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-agent)" />
                        <text x="197" y="70" textAnchor="middle" fontSize="7" className="fill-primary">Observation</text>

                        <defs><marker id="arrow-agent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
                    </svg>
                </div>
            </SectionCard>

            <SectionCard id="architectures" title="Agent Architectures" icon={<Workflow className="w-6 h-6 text-primary"/>}>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground m-0">Different patterns for structuring agent workflows.</p>
                    <div className="flex bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setKeyConceptsView('slide')}
                            className={`p-2 rounded-md flex items-center transition-colors ${keyConceptsView === 'slide' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Slide View"
                        >
                            <Presentation className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setKeyConceptsView('grid')}
                            className={`p-2 rounded-md flex items-center transition-colors ${keyConceptsView === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {keyConceptsView === 'slide' ? (
                    <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-background">
                        <div className="flex border-b border-border">
                            <div className="w-1/3 bg-muted/30 p-4 border-r border-border">
                                {agentArchitectures.map((arch, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlideIndex(idx)}
                                        className={`w-full text-left p-3 rounded-lg mb-2 transition-all flex items-center justify-between ${currentSlideIndex === idx ? 'bg-primary text-primary-foreground font-medium shadow-md' : 'hover:bg-muted text-muted-foreground'}`}
                                    >
                                        <span>{arch.title}</span>
                                        {currentSlideIndex === idx && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                            <div className="w-2/3 p-8 flex flex-col justify-center relative min-h-[300px]">
                                <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {currentSlideIndex + 1} / {agentArchitectures.length}
                                </div>
                                <div className="h-48 w-full max-w-sm mx-auto mb-6">
                                    {React.createElement(agentArchitectures[currentSlideIndex].Animation)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-foreground">{agentArchitectures[currentSlideIndex].title}</h3>
                                    <p className="text-muted-foreground">{agentArchitectures[currentSlideIndex].desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {agentArchitectures.map((arch, idx) => (
                            <div key={idx} className="border border-border rounded-xl p-4 bg-background flex flex-col">
                                <h3 className="font-bold text-lg mb-2 text-foreground">{arch.title}</h3>
                                <div className="h-32 bg-muted/30 rounded-lg mb-4 flex items-center justify-center p-2">
                                    <arch.Animation />
                                </div>
                                <p className="text-sm text-muted-foreground">{arch.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            <SectionCard id="applications" title="Real-World Applications" icon={<Network className="w-6 h-6 text-primary"/>}>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <ExampleCard title="Customer Support" icon={<Bot className="w-5 h-5 text-green-500"/>} visual={
                         <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="20" y="20" width="60" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
                            <path d="M 30 40 L 70 40 M 30 60 L 50 60" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round"/>
                            <circle cx="70" cy="70" r="12" fill="hsl(var(--primary))"/>
                            <path d="M 66 70 L 70 74 L 76 66" stroke="hsl(var(--primary-foreground))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>}>
                        A specialist team architecture where a routing agent directs queries to specific sub-agents (billing, technical support, returns) who use tools to interact with internal databases.
                    </ExampleCard>
                     <ExampleCard title="Code Generation" icon={<BrainCircuit className="w-5 h-5 text-blue-500"/>} visual={
                         <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M 20 50 L 40 30 L 40 70 Z" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M 80 50 L 60 30 L 60 70 Z" fill="hsl(var(--accent-foreground)/0.2)" stroke="hsl(var(--accent-foreground))" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M 45 80 L 55 20" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round"/>
                         </svg>}>
                        Evaluator-Optimizer pattern in action: A 'Generator' agent writes code based on a prompt, while an 'Evaluator' agent runs tests and provides feedback until all tests pass.
                    </ExampleCard>
                    <ExampleCard title="Market Research" icon={<Workflow className="w-5 h-5 text-purple-500"/>} visual={
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="30" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4"/>
                            <circle cx="50" cy="20" r="8" fill="hsl(var(--primary))"/>
                            <circle cx="80" cy="50" r="8" fill="hsl(var(--accent-foreground))"/>
                            <circle cx="20" cy="50" r="8" fill="hsl(var(--destructive))"/>
                            <circle cx="50" cy="80" r="8" fill="hsl(var(--warning-DEFAULT, #eab308))"/>
                            <circle cx="50" cy="50" r="10" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="2"/>
                        </svg>}>
                        Parallel Fanout architecture where a single research prompt is dispatched to 5 different agents to search different web sources concurrently, with a final agent aggregating the results.
                    </ExampleCard>
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

export default AgentOverviewActivity;
