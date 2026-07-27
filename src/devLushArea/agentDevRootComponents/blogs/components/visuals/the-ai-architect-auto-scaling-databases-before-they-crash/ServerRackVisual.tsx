import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Activity, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ServerRackVisual({ prompt }: { prompt?: string }) {
    const [load, setLoad] = useState(20);
    const [status, setStatus] = useState<'normal' | 'warning' | 'critical' | 'sharding' | 'sharded'>('normal');
    
    useEffect(() => {
        let currentLoad = 20;
        
        const sequence = async () => {
            while (true) {
                // Reset
                setStatus('normal');
                setLoad(20);
                currentLoad = 20;
                await new Promise(r => setTimeout(r, 2000));
                
                // Ramp up load
                for (let i = 0; i < 4; i++) {
                    currentLoad += 15;
                    setLoad(currentLoad);
                    if (currentLoad > 70) setStatus('warning');
                    await new Promise(r => setTimeout(r, 800));
                }
                
                // Critical spike
                currentLoad = 98;
                setLoad(currentLoad);
                setStatus('critical');
                await new Promise(r => setTimeout(r, 1500));
                
                // Agent intervenes
                setStatus('sharding');
                await new Promise(r => setTimeout(r, 2000));
                
                // Success
                setStatus('sharded');
                setLoad(35); // Load drops across shards
                await new Promise(r => setTimeout(r, 4000));
            }
        };
        sequence();
    }, []);

    const getBgColor = () => {
        switch (status) {
            case 'normal': return 'bg-emerald-950/20 border-emerald-500/20';
            case 'warning': return 'bg-amber-950/20 border-amber-500/40';
            case 'critical': return 'bg-red-950/40 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.2)]';
            case 'sharding': return 'bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.2)]';
            case 'sharded': return 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
        }
    };

    const getTextColor = () => {
        switch (status) {
            case 'normal': return 'text-emerald-400';
            case 'warning': return 'text-amber-400';
            case 'critical': return 'text-red-400 font-bold';
            case 'sharding': return 'text-indigo-400';
            case 'sharded': return 'text-emerald-400';
        }
    };

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 my-8 border border-slate-800 shadow-xl overflow-hidden font-mono relative">
            <div className="max-w-xl mx-auto flex flex-col gap-6">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-inner">
                    <div className="flex items-center gap-3">
                        <Activity className={`w-5 h-5 ${getTextColor()}`} />
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">System Status</div>
                            <div className={`text-sm uppercase tracking-wide ${getTextColor()}`}>
                                {status === 'normal' && "Load Optimal"}
                                {status === 'warning' && "Load Increasing"}
                                {status === 'critical' && "IOPS Saturation Imminent!"}
                                {status === 'sharding' && "Agent Executing Auto-Shard..."}
                                {status === 'sharded' && "Load Re-Balanced"}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">IOPS Load</div>
                        <div className={`text-2xl font-bold tabular-nums ${getTextColor()}`}>{load}%</div>
                    </div>
                </div>

                {/* Server Rack Area */}
                <div className="relative h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Monolithic Database (Shows initially and during load) */}
                    <AnimatePresence>
                        {status !== 'sharded' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, scale: status === 'critical' ? [1, 1.05, 1] : 1 }}
                                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                                transition={{ 
                                    duration: status === 'critical' ? 0.3 : 0.5, 
                                    repeat: status === 'critical' ? Infinity : 0 
                                }}
                                className={`w-3/4 p-6 rounded-xl border-2 flex items-center justify-center gap-4 transition-colors duration-500 ${getBgColor()}`}
                            >
                                <Database className={`w-12 h-12 ${getTextColor()}`} />
                                <div>
                                    <div className="text-slate-200 font-bold tracking-wide">DB_MASTER_01</div>
                                    <div className={`text-xs mt-1 ${getTextColor()}`}>{status === 'critical' ? 'CRASH IMMINENT' : 'MONOLITHIC NODE'}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Agent Intervention Overlay */}
                    <AnimatePresence>
                        {status === 'sharding' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 border border-indigo-500/30 rounded-xl"
                            >
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                                />
                                <div className="text-indigo-300 font-semibold uppercase tracking-wider">AI Architect Resolving...</div>
                                <div className="text-indigo-400/70 text-xs mt-2 font-mono">Applying Terraform: db_shard_count = 3</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sharded Databases (Shows after agent success) */}
                    <AnimatePresence>
                        {status === 'sharded' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full flex gap-4 justify-between px-4 z-10"
                            >
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: i * 0.15, type: 'spring' }}
                                        className="flex-1 p-4 rounded-xl border-2 bg-emerald-950/30 border-emerald-500/40 flex flex-col items-center justify-center gap-2"
                                    >
                                        <Database className="w-8 h-8 text-emerald-400" />
                                        <div className="text-slate-300 text-xs font-bold">SHARD_0{i}</div>
                                        <div className="text-emerald-500/70 text-[10px]">Load: {Math.floor(load/3 + (Math.random()*5))}%</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
