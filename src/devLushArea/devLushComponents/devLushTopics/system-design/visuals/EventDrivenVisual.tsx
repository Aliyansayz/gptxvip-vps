import React from 'react';
import { Activity } from 'lucide-react';

export const EventDrivenVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-orange-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-orange-100 dark:border-orange-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
                    <Activity className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                    Concept: Event-Driven Architecture
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Waiter (Producer) */}
                    <g transform="translate(20, 60)">
                        <circle cx="20" cy="10" r="10" fill="#f97316" />
                        <text x="20" y="35" fill="#fdba74" fontSize="8" textAnchor="middle">WAITERS</text>
                        <text x="20" y="45" fill="#fb923c" fontSize="6" textAnchor="middle">(Producers)</text>
                    </g>

                    {/* Ticket Rail (Broker) */}
                    <rect x="120" y="20" width="160" height="110" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="200" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">TICKET RAIL (MESSAGE BROKER)</text>

                    {/* Partitions/Topics */}
                    <line x1="120" y1="50" x2="280" y2="50" stroke="#334155" strokeWidth="1" />
                    <line x1="120" y1="90" x2="280" y2="90" stroke="#334155" strokeWidth="1" />

                    {/* Tickets (Events) */}
                    <rect x="150" y="60" width="20" height="20" fill="#fcd34d" />
                    <rect x="190" y="60" width="20" height="20" fill="#fcd34d" />
                    <rect x="160" y="100" width="20" height="20" fill="#fcd34d" />

                    {/* Chefs (Consumers) */}
                    <g transform="translate(330, 30)">
                        <circle cx="20" cy="10" r="10" fill="#10b981" />
                        <text x="20" y="35" fill="#6ee7b7" fontSize="8" textAnchor="middle">CHEF 1</text>
                    </g>
                    <g transform="translate(330, 90)">
                        <circle cx="20" cy="10" r="10" fill="#10b981" />
                        <text x="20" y="35" fill="#6ee7b7" fontSize="8" textAnchor="middle">CHEF 2</text>
                        <text x="20" y="45" fill="#34d399" fontSize="6" textAnchor="middle">(Consumers)</text>
                    </g>

                    {/* Flow arrows */}
                    <path d="M 60 75 L 110 75" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 290 50 L 320 40" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 290 110 L 320 100" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
            </div>
        </div>
    );
};
