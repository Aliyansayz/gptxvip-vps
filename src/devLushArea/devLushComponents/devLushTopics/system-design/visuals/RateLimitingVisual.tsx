import React from 'react';
import { Target } from 'lucide-react';

export const RateLimitingVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-pink-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-pink-100 dark:border-pink-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-pink-500/10 rounded-lg text-pink-600 dark:text-pink-400">
                    <Target className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-pink-900 dark:text-pink-300 uppercase tracking-wider">
                    Concept: Rate Limiting & Throttling
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Huge crowd */}
                    <g transform="translate(50, 75)">
                        <circle cx="-10" cy="-20" r="5" fill="#f43f5e" />
                        <circle cx="-25" cy="-10" r="5" fill="#f43f5e" />
                        <circle cx="-10" cy="0" r="5" fill="#f43f5e" />
                        <circle cx="-25" cy="10" r="5" fill="#f43f5e" />
                        <circle cx="-10" cy="20" r="5" fill="#f43f5e" />
                        <text x="-15" y="40" fill="#fb7185" fontSize="8" textAnchor="middle">SPIKE: 50 USERS</text>
                    </g>

                    {/* Turnstile */}
                    <rect x="150" y="50" width="20" height="50" fill="#0f172a" stroke="#db2777" strokeWidth="2" />
                    <line x1="160" y1="75" x2="180" y2="75" stroke="#db2777" strokeWidth="3" />
                    <text x="160" y="40" fill="#f472b6" fontSize="8" textAnchor="middle" fontWeight="bold">BUCKET (10/min)</text>

                    {/* Controlled flow */}
                    <g transform="translate(250, 75)">
                        <circle cx="0" cy="0" r="5" fill="#10b981" />
                        <circle cx="30" cy="0" r="5" fill="#10b981" />
                        <circle cx="60" cy="0" r="5" fill="#10b981" />
                        <text x="30" y="25" fill="#34d399" fontSize="8" textAnchor="middle">CONTROLLED INGRESS</text>
                    </g>

                    <path d="M 185 75 L 230 75" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 60 75 L 140 75" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
                </svg>
            </div>
        </div>
    );
};
