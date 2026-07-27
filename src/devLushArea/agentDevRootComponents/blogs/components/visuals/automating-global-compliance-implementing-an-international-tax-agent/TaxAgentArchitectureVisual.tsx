import React from 'react';
import { motion } from 'motion/react';
import { Database, FileText, Globe, Server } from 'lucide-react';

export default function TaxAgentArchitectureVisual({ prompt }: { prompt?: string }) {
    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 my-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <h4 className="text-slate-200 text-lg font-semibold mb-8 text-center relative z-10">
                Tax Agent Orchestration Flow
            </h4>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                {/* ERP Node */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                        <Server className="text-slate-400 w-8 h-8" />
                    </div>
                    <span className="text-slate-400 text-xs font-mono mt-3">Corporate ERP</span>
                </div>
                
                {/* Connecting Line & Animated Packet */}
                <div className="flex-1 h-1 bg-slate-800 relative w-full hidden md:block">
                    <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Tax Agent Orchestrator Node */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-xl bg-indigo-950/50 border border-indigo-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <Globe className="text-indigo-400 w-10 h-10" />
                    </div>
                    <span className="text-indigo-300 text-xs font-mono mt-3 text-center">Tax Agent<br/>Orchestrator</span>
                </div>
                
                {/* Connecting Line & Animated Packet */}
                <div className="flex-1 h-1 bg-slate-800 relative w-full hidden md:block">
                    <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 1.5, delay: 0.75, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Treaties DB & Report Nodes */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                            <Database className="text-slate-400 w-6 h-6" />
                        </div>
                        <span className="text-slate-400 text-xs font-mono">Treaties DB</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <FileText className="text-emerald-400 w-6 h-6" />
                        </div>
                        <span className="text-emerald-400 text-xs font-mono">Compliance Report</span>
                    </div>
                </div>
            </div>
            {prompt && (
                <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center opacity-50 relative z-10">
                    {prompt}
                </div>
            )}
        </div>
    );
}
