import React from 'react';
import { Route } from 'lucide-react';

export const ApiGatewayVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-purple-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-purple-100 dark:border-purple-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                    <Route className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                    Concept: API Gateway Routing
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Clients (Guests) */}
                    <g transform="translate(30, 75)">
                        <circle cx="-10" cy="-15" r="6" fill="#cbd5e1" />
                        <circle cx="-10" cy="15" r="6" fill="#cbd5e1" />
                        <text x="-10" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle">GUESTS (CLIENTS)</text>
                    </g>

                    {/* Concierge (API Gateway) */}
                    <rect x="120" y="45" width="50" height="60" rx="6" fill="#581c87" stroke="#a855f7" strokeWidth="2" />
                    <text x="145" y="70" fill="#d8b4fe" fontSize="8" textAnchor="middle" fontWeight="bold">CONCIERGE</text>
                    <text x="145" y="82" fill="#c084fc" fontSize="6" textAnchor="middle">(API Gateway)</text>

                    {/* Departments (Microservices) */}
                    <rect x="280" y="10" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="320" y="28" fill="#e2e8f0" fontSize="8" textAnchor="middle">Room Service API</text>

                    <rect x="280" y="60" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="320" y="78" fill="#e2e8f0" fontSize="8" textAnchor="middle">Billing API</text>

                    <rect x="280" y="110" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="320" y="128" fill="#e2e8f0" fontSize="8" textAnchor="middle">Laundry API</text>

                    {/* Flow lines */}
                    <path d="M 40 75 L 110 75" stroke="#a855f7" strokeWidth="2" />
                    <path d="M 180 60 L 270 25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 180 75 L 270 75" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 180 90 L 270 125" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
            </div>
        </div>
    );
};
