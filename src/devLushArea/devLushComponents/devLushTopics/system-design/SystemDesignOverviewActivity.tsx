import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, Network, Database, Layers, ArrowRightLeft, Activity } from 'lucide-react';

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

const GlobalTrafficRouterVisual: React.FC = () => {
    return (
        <div className="w-full bg-slate-950 p-6 rounded-2xl mb-8 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Global Traffic Routing</h3>
            <svg viewBox="0 0 400 200" className="w-full h-64">
                {/* Globe / Users */}
                <circle cx="60" cy="100" r="40" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M 60 60 C 80 80, 80 120, 60 140 M 60 60 C 40 80, 40 120, 60 140 M 20 100 L 100 100" stroke="#334155" fill="none" strokeWidth="1" />
                <circle cx="50" cy="80" r="3" fill="#3b82f6" className="animate-pulse" />
                <circle cx="70" cy="120" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="30" cy="110" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <text x="60" y="155" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">CLIENTS</text>

                {/* Load Balancer */}
                <rect x="160" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                <text x="180" y="103" textAnchor="middle" fontSize="8" fill="#a78bfa" fontWeight="bold">L7 LB</text>

                {/* Traffic paths from clients to LB */}
                <path d="M 100 100 L 160 100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />

                {/* Data Centers */}
                <rect x="280" y="30" width="60" height="40" rx="4" fill="#064e3b" stroke="#10b981" />
                <text x="310" y="53" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="bold">US-EAST</text>

                <rect x="280" y="130" width="60" height="40" rx="4" fill="#1e3a8a" stroke="#3b82f6" />
                <text x="310" y="153" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="bold">EU-WEST</text>

                {/* Paths from LB to DCs */}
                <path d="M 200 100 L 240 100 L 240 50 L 280 50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="animate-[dash_1.5s_linear_infinite]" />
                <path d="M 200 100 L 240 100 L 240 150 L 280 150" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="animate-[dash_1.5s_linear_infinite]" style={{ animationDelay: '0.7s' }} />
            </svg>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dash {
                    to { stroke-dashoffset: -8; }
                }
            `}} />
        </div>
    );
};

export const SystemDesignOverviewActivity: React.FC<{
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

            <GlobalTrafficRouterVisual />

            <SectionCard id="definition" title="What is System Design?" icon={<Network className="w-6 h-6 text-primary" />}>
                <p>System Design is the process of architecting and defining the modules, interfaces, and data for a system to satisfy specified requirements. In modern applications, this usually means designing <strong>distributed systems</strong>—systems whose components are located on different networked computers, communicating and coordinating their actions by passing messages to achieve a common goal.</p>
                <p>The main challenges involve scaling applications to handle millions of users while maintaining high availability, reliability, and low latency.</p>
            </SectionCard>

            <SectionCard id="tradeoffs" title="Trade-offs & Fundamentals" icon={<ArrowRightLeft className="w-6 h-6 text-primary" />}>
                <div className="w-full h-48 bg-background rounded-lg p-4 flex items-center justify-center">
                    <svg viewBox="0 0 300 100" className="w-full h-full">
                        <circle cx="150" cy="50" r="40" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" />
                        <circle cx="130" cy="40" r="25" fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent-foreground))" />
                        <text x="130" y="45" textAnchor="middle" fontSize="8" fill="hsl(var(--foreground))">Consistency</text>
                        <circle cx="170" cy="40" r="25" fill="hsl(var(--destructive)/0.2)" stroke="hsl(var(--destructive))" />
                        <text x="170" y="45" textAnchor="middle" fontSize="8" fill="hsl(var(--foreground))">Availability</text>
                        <circle cx="150" cy="75" r="25" fill="hsl(var(--success-DEFAULT, #22c55e)/0.2)" stroke="hsl(var(--success-DEFAULT, #22c55e))" />
                        <text x="150" y="80" textAnchor="middle" fontSize="8" fill="hsl(var(--foreground))">Partition Tolerance</text>
                        <text x="150" y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="hsl(var(--foreground))">CAP Theorem</text>
                    </svg>
                </div>
                <p>Designing distributed systems is all about trade-offs:</p>
                <ul>
                    <li><strong>CAP Theorem:</strong> You can only have two out of three: Consistency, Availability, and Partition Tolerance. In a distributed system, partitions (network failures) are inevitable, so you must choose between Consistency and Availability.</li>
                    <li><strong>Latency vs. Throughput:</strong> Making a single request faster (latency) vs. handling more requests concurrently (throughput).</li>
                    <li><strong>Horizontal vs. Vertical Scaling:</strong> Adding more machines (horizontal) vs. adding more power to an existing machine (vertical).</li>
                </ul>
            </SectionCard>

            <SectionCard id="applications" title="Interactive Examples in System Design" icon={<Layers className="w-6 h-6 text-primary" />}>
                <div className="grid md:grid-cols-2 gap-4">
                    <ExampleCard title="Database Sharding" icon={<Database className="w-5 h-5 text-blue-500" />} visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="10" width="20" height="40" rx="3" fill="hsl(var(--primary))" opacity="0.8" />
                            <rect x="40" y="10" width="20" height="40" rx="3" fill="hsl(var(--primary))" opacity="0.6" />
                            <rect x="70" y="10" width="20" height="40" rx="3" fill="hsl(var(--primary))" opacity="0.4" />
                            <path d="M 15 20 L 25 20 M 15 30 L 25 30 M 15 40 L 25 40" stroke="white" strokeWidth="2" />
                            <path d="M 45 20 L 55 20 M 45 30 L 55 30 M 45 40 L 55 40" stroke="white" strokeWidth="2" />
                            <path d="M 75 20 L 85 20 M 75 30 L 85 30 M 75 40 L 85 40" stroke="white" strokeWidth="2" />
                            <path d="M 50 5 L 20 5 M 50 5 L 80 5" stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="50" cy="5" r="3" fill="hsl(var(--destructive))" />
                        </svg>}>
                        Learn how to scale databases horizontally by splitting a single logical dataset into multiple distinct physical partitions (shards). Explore shard keys, consistent hashing, and failover mechanics.
                    </ExampleCard>
                    <ExampleCard title="Event-Driven Architecture" icon={<Activity className="w-5 h-5 text-green-500" />} visual={
                        <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="25" width="20" height="10" rx="2" fill="hsl(var(--muted-foreground))" />
                            <text x="20" y="32" textAnchor="middle" fontSize="6" fill="white">Producer</text>
                            <rect x="40" y="10" width="20" height="40" rx="2" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" />
                            <text x="50" y="25" textAnchor="middle" fontSize="6" fill="hsl(var(--foreground))">Kafka</text>
                            <text x="50" y="35" textAnchor="middle" fontSize="6" fill="hsl(var(--foreground))">Broker</text>
                            <rect x="70" y="15" width="20" height="10" rx="2" fill="hsl(var(--primary))" />
                            <text x="80" y="22" textAnchor="middle" fontSize="6" fill="white">Consumer</text>
                            <rect x="70" y="35" width="20" height="10" rx="2" fill="hsl(var(--primary))" />
                            <text x="80" y="42" textAnchor="middle" fontSize="6" fill="white">Consumer</text>
                            <path d="M 30 30 L 40 30" stroke="hsl(var(--foreground))" strokeWidth="1.5" markerEnd="url(#arrow-sys)" />
                            <path d="M 60 20 L 70 20" stroke="hsl(var(--foreground))" strokeWidth="1.5" markerEnd="url(#arrow-sys)" />
                            <path d="M 60 40 L 70 40" stroke="hsl(var(--foreground))" strokeWidth="1.5" markerEnd="url(#arrow-sys)" />
                            <defs><marker id="arrow-sys" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--foreground))" /></marker></defs>
                        </svg>}>
                        Simulate asynchronous communication where producers emit events to brokers, and consumers process them independently. Visualize topic partitions, offsets, and pub/sub patterns.
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
