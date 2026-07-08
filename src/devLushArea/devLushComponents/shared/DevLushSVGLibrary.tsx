import React from 'react';

export interface TopologyPattern {
    id: string;
    type: string;
}

export const renderTopology = (topology: TopologyPattern) => {
    switch (topology.type) {
        // System Design
        case 'arch-monolith':
            return (
                <g className="text-primary fill-current">
                    <rect x="25" y="25" width="50" height="50" rx="8" opacity="0.9" />
                    <circle cx="50" cy="50" r="10" className="text-white fill-current" />
                </g>
            );
        case 'arch-microservices':
            return (
                <g className="text-primary fill-current">
                    <rect x="20" y="20" width="25" height="25" rx="4" />
                    <rect x="55" y="20" width="25" height="25" rx="4" />
                    <rect x="20" y="55" width="25" height="25" rx="4" />
                    <rect x="55" y="55" width="25" height="25" rx="4" />
                    <line x1="45" y1="32" x2="55" y2="32" stroke="currentColor" strokeWidth="2" />
                    <line x1="45" y1="67" x2="55" y2="67" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="45" x2="32" y2="55" stroke="currentColor" strokeWidth="2" />
                </g>
            );
        case 'arch-event-driven':
            return (
                <g className="text-primary">
                    {/* Event Bus */}
                    <rect x="20" y="45" width="60" height="10" rx="2" className="fill-current opacity-50" />
                    {/* Publishers / Subscribers */}
                    <circle cx="30" cy="25" r="8" className="fill-current" />
                    <circle cx="70" cy="25" r="8" className="fill-current" />
                    <circle cx="30" cy="75" r="8" className="fill-current" />
                    <circle cx="70" cy="75" r="8" className="fill-current" />
                    {/* Lines to bus */}
                    <line x1="30" y1="33" x2="30" y2="45" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                    <line x1="70" y1="33" x2="70" y2="45" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                    <line x1="30" y1="55" x2="30" y2="67" stroke="currentColor" strokeWidth="2" />
                    <line x1="70" y1="55" x2="70" y2="67" stroke="currentColor" strokeWidth="2" />
                </g>
            );
        case 'arch-serverless':
            return (
                <g className="text-primary fill-current">
                    <path d="M 30 50 Q 50 10 70 50 Q 90 90 50 90 Q 10 90 30 50" opacity="0.3" />
                    <rect x="40" y="40" width="20" height="20" rx="2" />
                    <circle cx="20" cy="40" r="4" />
                    <circle cx="80" cy="60" r="4" />
                    <circle cx="50" cy="80" r="4" />
                </g>
            );
        // Cybersecurity
        case 'attack-ddos':
            return (
                <g className="text-red-500 fill-current">
                    <circle cx="50" cy="50" r="15" className="text-slate-800 dark:text-slate-200 fill-current" />
                    {/* Arrows converging */}
                    <polygon points="20,20 30,25 25,30" />
                    <line x1="10" y1="10" x2="25" y2="25" stroke="currentColor" strokeWidth="2" />
                    
                    <polygon points="80,20 75,30 70,25" />
                    <line x1="90" y1="10" x2="75" y2="25" stroke="currentColor" strokeWidth="2" />
                    
                    <polygon points="20,80 25,70 30,75" />
                    <line x1="10" y1="90" x2="25" y2="75" stroke="currentColor" strokeWidth="2" />
                    
                    <polygon points="80,80 70,75 75,70" />
                    <line x1="90" y1="90" x2="75" y2="75" stroke="currentColor" strokeWidth="2" />
                </g>
            );
        case 'attack-mitm':
            return (
                <g className="text-primary">
                    <rect x="15" y="40" width="20" height="20" rx="4" className="fill-current" />
                    <rect x="65" y="40" width="20" height="20" rx="4" className="fill-current" />
                    <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="50" cy="50" r="8" className="text-red-500 fill-current" />
                </g>
            );
        case 'defense-dmz':
            return (
                <g className="text-primary">
                    <rect x="10" y="20" width="25" height="60" rx="2" className="fill-current opacity-30" />
                    <rect x="40" y="20" width="20" height="60" rx="2" className="fill-current opacity-60" />
                    <rect x="65" y="20" width="25" height="60" rx="2" className="fill-current" />
                    <line x1="37" y1="20" x2="37" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-red-500" />
                    <line x1="62" y1="20" x2="62" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-red-500" />
                </g>
            );
        case 'defense-zero-trust':
            return (
                <g className="text-primary">
                    <rect x="25" y="25" width="20" height="20" rx="2" className="fill-current" />
                    <rect x="55" y="25" width="20" height="20" rx="2" className="fill-current" />
                    <rect x="25" y="55" width="20" height="20" rx="2" className="fill-current" />
                    <rect x="55" y="55" width="20" height="20" rx="2" className="fill-current" />
                    
                    {/* Tiny Padlocks on connections */}
                    <line x1="45" y1="35" x2="55" y2="35" stroke="currentColor" strokeWidth="1" />
                    <rect x="48" y="33" width="4" height="4" rx="1" className="text-green-500 fill-current" />
                    
                    <line x1="35" y1="45" x2="35" y2="55" stroke="currentColor" strokeWidth="1" />
                    <rect x="33" y="48" width="4" height="4" rx="1" className="text-green-500 fill-current" />
                    
                    <line x1="65" y1="45" x2="65" y2="55" stroke="currentColor" strokeWidth="1" />
                    <rect x="63" y="48" width="4" height="4" rx="1" className="text-green-500 fill-current" />
                    
                    <line x1="45" y1="65" x2="55" y2="65" stroke="currentColor" strokeWidth="1" />
                    <rect x="48" y="63" width="4" height="4" rx="1" className="text-green-500 fill-current" />
                </g>
            );
        // Agent Types
        case 'agent-sequential':
            return (
                <g className="text-primary fill-current">
                    <circle cx="20" cy="50" r="10" />
                    <circle cx="50" cy="50" r="10" />
                    <circle cx="80" cy="50" r="10" />
                    <line x1="30" y1="50" x2="40" y2="50" stroke="currentColor" strokeWidth="2" />
                    <polygon points="40,50 35,47 35,53" />
                    <line x1="60" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="2" />
                    <polygon points="70,50 65,47 65,53" />
                </g>
            );
        case 'agent-hierarchical':
            return (
                <g className="text-primary fill-current">
                    <rect x="40" y="15" width="20" height="20" rx="4" />
                    <circle cx="25" cy="65" r="10" />
                    <circle cx="50" cy="75" r="10" />
                    <circle cx="75" cy="65" r="10" />
                    <line x1="50" y1="35" x2="25" y2="55" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="35" x2="75" y2="55" stroke="currentColor" strokeWidth="2" />
                </g>
            );
        case 'agent-evaluator':
            return (
                <g className="text-primary fill-current">
                    <circle cx="35" cy="50" r="12" />
                    <rect x="55" y="38" width="24" height="24" rx="4" className="text-secondary fill-current" />
                    <path d="M 47 45 Q 50 35 55 45" stroke="currentColor" strokeWidth="2" fill="none" />
                    <polygon points="55,45 50,42 57,40" />
                    <path d="M 55 55 Q 50 65 47 55" stroke="currentColor" strokeWidth="2" fill="none" />
                    <polygon points="47,55 52,58 45,60" />
                </g>
            );
        case 'agent-swarm':
            return (
                <g className="text-primary fill-current">
                    <circle cx="30" cy="30" r="6" />
                    <circle cx="70" cy="30" r="6" />
                    <circle cx="50" cy="50" r="8" />
                    <circle cx="30" cy="70" r="6" />
                    <circle cx="70" cy="70" r="6" />
                    <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="1" />
                    <line x1="30" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="70" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="30" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="70" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="30" y1="30" x2="30" y2="70" stroke="currentColor" strokeWidth="1" />
                    <line x1="70" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="1" />
                    <line x1="30" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="1" />
                </g>
            );
        default:
            return <circle cx="50" cy="50" r="20" className="text-slate-400 fill-current" />;
    }
};

export const DevLushInfographic = ({ pattern }: { pattern: string }) => {
    return (
        <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[200px] mx-auto drop-shadow-xl opacity-80">
            {renderTopology({ id: 'preview', type: pattern })}
        </svg>
    );
};
