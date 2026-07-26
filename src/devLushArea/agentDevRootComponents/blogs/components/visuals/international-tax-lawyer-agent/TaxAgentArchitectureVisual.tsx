import React from 'react';
import { motion } from 'motion/react';
import { Database, Network, FileCheck, Building2 } from 'lucide-react';

export default function TaxAgentArchitectureVisual() {
    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-slate-800 overflow-hidden relative font-sans my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center justify-center gap-2">
                <Network className="w-6 h-6 text-indigo-400" />
                Agent Orchestration Flow
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10 px-4">
                
                {/* Node 1: ERP */}
                <div className="flex flex-col items-center gap-3 w-32 shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg relative z-10">
                        <Building2 className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-bold text-slate-200 block">Corporate ERP</span>
                        <span className="text-[10px] text-slate-500">Asset Data</span>
                    </div>
                </div>

                {/* Connecting Line 1 */}
                <div className="hidden md:block flex-1 h-0.5 bg-slate-800 relative mx-4">
                    <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Node 2: Agent Orchestrator */}
                <div className="flex flex-col items-center gap-3 w-40 shrink-0 relative">
                    {/* Pulsing background */}
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    
                    <div className="w-20 h-20 rounded-2xl bg-indigo-900 border-2 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative z-10">
                        <Network className="w-10 h-10 text-indigo-300" />
                    </div>
                    <div className="text-center relative z-10">
                        <span className="text-sm font-bold text-indigo-100 block">Tax Agent</span>
                        <span className="text-[10px] text-indigo-300 uppercase tracking-wider">RAG + Rules Engine</span>
                    </div>
                </div>

                {/* Connecting Line 2 */}
                <div className="hidden md:block flex-1 h-0.5 bg-slate-800 relative mx-4">
                     <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                    />
                </div>

                {/* Node 4: Output */}
                <div className="flex flex-col items-center gap-3 w-32 shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-emerald-900/50 border border-emerald-700 flex items-center justify-center shadow-lg relative z-10">
                        <FileCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-bold text-emerald-100 block">Compliance</span>
                        <span className="text-[10px] text-emerald-500">Report & Filing</span>
                    </div>
                </div>

            </div>

            {/* Treaties Database (Bottom branch) */}
            <div className="mt-8 flex justify-center relative z-10">
                 {/* Vertical Connection */}
                 <div className="absolute -top-10 left-1/2 w-0.5 h-12 bg-slate-800 -translate-x-1/2">
                    <motion.div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                 </div>

                 <div className="flex flex-col items-center gap-3 w-32 bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-lg">
                    <Database className="w-6 h-6 text-amber-500" />
                    <div className="text-center">
                        <span className="text-xs font-bold text-slate-200 block">Treaties DB</span>
                        <span className="text-[10px] text-amber-500/70">Vector Search</span>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>
    );
}
