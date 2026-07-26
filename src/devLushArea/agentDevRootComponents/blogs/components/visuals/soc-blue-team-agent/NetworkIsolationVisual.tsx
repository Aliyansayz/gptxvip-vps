import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Server, Shield, Laptop, AlertOctagon, Lock, Database } from 'lucide-react';

export default function NetworkIsolationVisual() {
    const [state, setState] = useState<'normal' | 'detecting' | 'quarantined'>('normal');

    useEffect(() => {
        const runSimulation = async () => {
            await new Promise(r => setTimeout(r, 2000));
            setState('detecting');
            await new Promise(r => setTimeout(r, 2500));
            setState('quarantined');
            await new Promise(r => setTimeout(r, 4000));
            setState('normal'); // loop
        };
        const interval = setInterval(runSimulation, 8500);
        runSimulation();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[400px] rounded-2xl bg-slate-950 p-6 shadow-2xl border border-slate-800 relative font-sans my-8 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 relative z-20">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-sky-400" />
                    Autonomous Remediation
                </h3>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${state === 'normal' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : state === 'detecting' ? 'bg-rose-500 animate-ping' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></span>
                    <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                        {state === 'normal' ? 'Monitoring' : state === 'detecting' ? 'Threat Detected' : 'Endpoint Isolated'}
                    </span>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center z-10">
                
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Switch to Web Server */}
                    <line x1="50%" y1="20%" x2="25%" y2="50%" stroke="#334155" strokeWidth="2" />
                    {/* Switch to DB Server */}
                    <line x1="50%" y1="20%" x2="75%" y2="50%" stroke="#334155" strokeWidth="2" />
                    {/* Switch to Endpoint (Dynamic) */}
                    <motion.line 
                        x1="50%" y1="20%" x2="50%" y2="80%" 
                        stroke={state === 'quarantined' ? '#ef4444' : '#334155'} 
                        strokeWidth="2"
                        strokeDasharray={state === 'quarantined' ? '4 4' : '0'}
                        animate={{ opacity: state === 'quarantined' ? 0.2 : 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    
                    {/* Data packets flowing (normal mode) */}
                    {state === 'normal' && (
                        <motion.circle r="3" fill="#38bdf8"
                            initial={{ cx: "50%", cy: "80%" }}
                            animate={{ cx: "50%", cy: "20%" }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    )}

                    {/* Threat lateral movement attempt */}
                    {state === 'detecting' && (
                         <motion.circle r="4" fill="#f43f5e"
                            initial={{ cx: "50%", cy: "80%" }}
                            animate={{ cx: "25%", cy: "50%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    )}
                </svg>

                {/* Core Switch Node */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg relative z-10">
                        <Network className="w-6 h-6 text-slate-300" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-1">Core Switch</span>
                </div>

                {/* Web Server Node */}
                <div className="absolute top-[40%] left-[20%] flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg relative z-10">
                        <Server className="w-6 h-6 text-slate-300" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-1">Web API</span>
                </div>

                {/* DB Server Node */}
                <div className="absolute top-[40%] right-[20%] flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg relative z-10">
                        <Database className="w-6 h-6 text-slate-300" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-1">User DB</span>
                </div>

                {/* Endpoint Node (The Target) */}
                <div className="absolute top-[70%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="relative">
                        <AnimatePresence>
                            {state === 'quarantined' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1.2 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -inset-4 border-2 border-amber-500 rounded-2xl bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)] z-0 flex items-start justify-end"
                                >
                                    <Lock className="w-4 h-4 text-amber-500 absolute -top-2 -right-2 bg-slate-950 rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div 
                            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg relative z-10 transition-colors duration-500 border-2 ${state === 'normal' ? 'bg-slate-900 border-slate-700' : 'bg-rose-950/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}
                            animate={{ x: state === 'detecting' ? [-2, 2, -2] : 0 }}
                            transition={{ repeat: state === 'detecting' ? Infinity : 0, duration: 0.1 }}
                        >
                            <Laptop className={`w-6 h-6 ${state === 'normal' ? 'text-slate-300' : 'text-rose-500'}`} />
                        </motion.div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest bg-slate-950 px-1 mt-1 ${state === 'normal' ? 'text-slate-400' : 'text-rose-400'}`}>
                        Endpoint 10.0.4.52
                    </span>
                </div>

                {/* Agent Overlay Alert */}
                <AnimatePresence>
                    {state === 'detecting' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-sm border border-rose-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-30 min-w-[280px]"
                        >
                            <AlertOctagon className="w-8 h-8 text-rose-500 animate-pulse shrink-0" />
                            <div>
                                <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-0.5">Agent Alert</div>
                                <div className="text-sm text-slate-200 font-bold">Lateral movement matched.</div>
                                <div className="text-xs text-slate-400 mt-1 font-mono">Executing firewall isolation...</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
    );
}
