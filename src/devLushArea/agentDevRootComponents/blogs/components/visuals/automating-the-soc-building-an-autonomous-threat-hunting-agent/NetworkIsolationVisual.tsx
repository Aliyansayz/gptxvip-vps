import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, ShieldAlert, Monitor, Server, Lock } from 'lucide-react';

export default function NetworkIsolationVisual({ prompt }: { prompt?: string }) {
    const [step, setStep] = useState(0); // 0: Normal, 1: Infected, 2: Isolated

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                setStep(0);
                await new Promise(r => setTimeout(r, 2000));
                setStep(1);
                await new Promise(r => setTimeout(r, 1500));
                setStep(2);
                await new Promise(r => setTimeout(r, 3000));
            }
        };
        sequence();
    }, []);

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 my-8 border border-slate-800 shadow-xl overflow-hidden relative">
            <h4 className="text-slate-300 text-sm font-semibold tracking-wider uppercase mb-8 text-center">Autonomous Threat Quarantine</h4>
            
            <div className="relative h-64 flex items-center justify-center">
                {/* Core Router */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-lg">
                        <Network className="text-slate-400 w-8 h-8" />
                    </div>
                </div>

                {/* Healthy Node 1 */}
                <div className="absolute top-8 left-12 flex flex-col items-center">
                    <Monitor className="text-emerald-400 w-8 h-8 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">10.0.4.12</span>
                </div>
                {/* Healthy Node 1 Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Healthy Node 2 */}
                <div className="absolute bottom-8 right-12 flex flex-col items-center">
                    <Server className="text-emerald-400 w-8 h-8 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">10.0.5.100</span>
                </div>
                {/* Healthy Node 2 Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* The Target Node */}
                <div className="absolute top-12 right-20 flex flex-col items-center z-20">
                    <motion.div
                        animate={{
                            backgroundColor: step === 0 ? "rgb(30 41 59)" : step === 1 ? "rgb(127 29 29)" : "rgb(30 41 59)",
                            borderColor: step === 0 ? "rgb(51 65 85)" : step === 1 ? "rgb(220 38 38)" : "rgb(217 119 6)",
                        }}
                        className="w-14 h-14 rounded-xl border-2 flex items-center justify-center relative shadow-lg transition-colors duration-300"
                    >
                        <Monitor className={`${step === 1 ? 'text-red-500' : 'text-slate-400'} w-6 h-6`} />
                        
                        {/* Amber Shield Quarantine */}
                        <AnimatePresence>
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1.3 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 rounded-xl border-2 border-amber-500 bg-amber-500/20 flex items-center justify-center backdrop-blur-[2px]"
                                >
                                    <Lock className="text-amber-400 w-5 h-5 absolute -top-3 -right-3 bg-slate-900 rounded-full p-1 shadow-lg border border-amber-500/50" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <span className="text-xs text-slate-500 font-mono mt-3">10.0.4.52</span>
                </div>

                {/* The Target Node Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <motion.line 
                        x1="80%" y1="20%" x2="50%" y2="50%" 
                        stroke={step === 1 ? "#ef4444" : "#334155"} 
                        strokeWidth="2" 
                        animate={{
                            strokeDasharray: step === 2 ? "0 100" : "4 4",
                            opacity: step === 2 ? 0 : 1
                        }}
                    />
                </svg>

                {/* Status Readout */}
                <div className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs w-64 shadow-lg">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-400">
                        <ShieldAlert className="w-4 h-4" /> Agent Log
                    </div>
                    {step === 0 && <span className="text-slate-500">[INFO] Monitoring network traffic...</span>}
                    {step === 1 && <span className="text-red-400 animate-pulse">[CRIT] Lateral movement detected on 10.0.4.52!</span>}
                    {step === 2 && <span className="text-amber-400">[ACT] Quarantine applied to 10.0.4.52. Rules updated.</span>}
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
