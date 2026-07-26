import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Activity, ArrowRight, ShieldCheck, DatabaseZap } from 'lucide-react';

export default function ServerRackVisual() {
    const [loadPhase, setLoadPhase] = useState<'normal' | 'warning' | 'critical' | 'resolved'>('normal');

    useEffect(() => {
        // Sequence: Normal -> Warning -> Critical -> Resolved
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 2000));
            setLoadPhase('warning');
            await new Promise(r => setTimeout(r, 2500));
            setLoadPhase('critical');
            await new Promise(r => setTimeout(r, 2500));
            setLoadPhase('resolved');
        };
        sequence();
    }, []);

    const getStatusColor = () => {
        switch (loadPhase) {
            case 'normal': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            case 'warning': return 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
            case 'critical': return 'text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse';
            case 'resolved': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
        }
    };

    const getIops = () => {
        switch (loadPhase) {
            case 'normal': return '3,450 / 10,000 IOPS';
            case 'warning': return '8,900 / 10,000 IOPS';
            case 'critical': return '9,980 / 10,000 IOPS';
            case 'resolved': return '4,200 / 10,000 IOPS'; // distributed
        }
    };

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-slate-800 font-sans my-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 relative z-10">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-indigo-400" />
                    Autonomous Scaling Engine
                </h3>
                {loadPhase === 'resolved' && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <ShieldCheck className="w-4 h-4" /> Agent PR Merged
                    </motion.div>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 min-h-[250px]">
                
                {/* Primary DB Node */}
                <div className="flex flex-col items-center gap-4 w-48">
                    <div className="text-xs text-slate-400 font-bold tracking-widest uppercase">Primary DB Node</div>
                    <motion.div 
                        className={`w-32 h-40 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-1000 ${getStatusColor()}`}
                        animate={{
                            y: loadPhase === 'critical' ? [-2, 2, -2] : 0
                        }}
                        transition={{ repeat: loadPhase === 'critical' ? Infinity : 0, duration: 0.1 }}
                    >
                        <Server className={`w-12 h-12 ${loadPhase === 'critical' ? 'text-rose-500' : 'text-current'}`} />
                        <div className="flex gap-1 mt-2">
                             <div className={`w-2 h-2 rounded-full ${loadPhase === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-current'}`}></div>
                             <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
                             <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
                        </div>
                    </motion.div>
                    <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-xs font-mono text-slate-300 w-full text-center">
                        {getIops()}
                    </div>
                </div>

                {/* Agent Action Line */}
                <div className="flex flex-col items-center w-32 relative h-[150px] justify-center">
                    <AnimatePresence>
                        {loadPhase === 'critical' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-6 bg-slate-900 border border-indigo-500 p-3 rounded-lg text-center shadow-xl shadow-indigo-500/20 w-56 z-20"
                            >
                                <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1 flex items-center justify-center gap-1"><DatabaseZap className="w-3 h-3"/> AI Architect</div>
                                <div className="text-xs text-slate-200">IOPS Saturation Predicted. Provisioning Replicas...</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {loadPhase === 'resolved' ? (
                         <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-0.5 bg-indigo-500 relative flex items-center justify-center">
                             <ArrowRight className="w-6 h-6 text-indigo-500 absolute bg-slate-950 rounded-full" />
                         </motion.div>
                    ) : (
                         <div className="w-full h-0.5 border-t-2 border-dashed border-slate-700"></div>
                    )}
                </div>

                {/* Read Replicas (Spawned when resolved) */}
                <div className="flex flex-col items-center gap-4 w-56 min-h-[200px] justify-end">
                    <AnimatePresence>
                        {loadPhase === 'resolved' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="flex flex-col gap-3 w-full items-center"
                            >
                                <div className="text-xs text-slate-400 font-bold tracking-widest uppercase">Read Replicas</div>
                                <div className="flex gap-4">
                                    <div className="w-24 h-32 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <Server className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <div className="w-24 h-32 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <Server className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-xs font-mono text-slate-300 w-full text-center">
                                    Load Distributed
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
            
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
    );
}
