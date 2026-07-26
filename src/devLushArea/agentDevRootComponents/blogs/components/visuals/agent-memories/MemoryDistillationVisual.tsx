import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Database, MessageSquare, ArrowRightCircle } from 'lucide-react';

export default function MemoryDistillationVisual() {
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);
    const [vectors, setVectors] = useState<{ id: number; text: string }[]>([]);

    const incomingMessages = [
        "User: Optimize this loop.",
        "Agent: Used list comprehension.",
        "User: Also make it dark mode.",
        "Agent: Added CSS class 'dark'.",
        "User: Save to database.",
        "Agent: Configured PostgreSQL connection.",
    ];

    useEffect(() => {
        let msgIndex = 0;
        let vectorId = 100;
        
        const interval = setInterval(() => {
            if (msgIndex < incomingMessages.length) {
                setMessages(prev => {
                    const next = [...prev, { id: Date.now(), text: incomingMessages[msgIndex] }];
                    if (next.length > 4) {
                        // Evict the oldest one
                        const evicted = next.shift();
                        if (evicted) {
                            setTimeout(() => {
                                setVectors(v => [...v, { id: vectorId++, text: "Distilled: " + evicted.text.substring(0, 20) + "..." }]);
                            }, 500);
                        }
                    }
                    return next;
                });
                msgIndex++;
            } else {
                // reset for endless loop after a short delay
                setTimeout(() => {
                    msgIndex = 0;
                    setMessages([]);
                    setVectors([]);
                }, 4000);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-slate-800 font-sans my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-fuchsia-400" />
                Dynamic Context Distillation
            </h3>

            <div className="flex flex-col md:flex-row gap-6 relative">
                
                {/* Episodic Memory (Active Context) */}
                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-5 shadow-inner min-h-[320px] flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-400" />
                            <h4 className="font-bold text-slate-200">Episodic Memory</h4>
                        </div>
                        <div className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                            Active Context
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-end gap-2 overflow-hidden relative">
                         {messages.length === 4 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-0 w-full h-8 bg-gradient-to-b from-rose-500/20 to-transparent z-10 pointer-events-none rounded-t text-[10px] text-center text-rose-400 font-bold pt-1">
                                 TOKEN LIMIT REACHED
                             </motion.div>
                         )}
                         <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, x: 50, transition: { duration: 0.5 } }}
                                    key={msg.id}
                                    className={`p-3 rounded-lg text-sm border shadow-sm ${msg.text.startsWith('User') ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200 self-start w-10/12' : 'bg-slate-800/50 border-slate-600/50 text-slate-300 self-end w-10/12'}`}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Arrow indicator */}
                <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                    <ArrowRightCircle className="w-8 h-8 animate-pulse text-fuchsia-500/50" />
                    <div className="text-[10px] uppercase font-bold mt-2 text-fuchsia-400 tracking-widest text-center">Evict &<br/>Embed</div>
                </div>

                {/* Semantic Memory (Vector DB) */}
                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-5 shadow-inner min-h-[320px]">
                     <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-bold text-slate-200">Semantic Memory</h4>
                        </div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                            Vector DB
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 content-start">
                        <AnimatePresence>
                            {vectors.map((vec) => (
                                <motion.div
                                    key={vec.id}
                                    initial={{ opacity: 0, scale: 0, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-2.5 flex items-center gap-3 shadow-[0_0_10px_rgba(16,185,129,0.1)] w-full"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    </div>
                                    <div className="text-xs text-emerald-200 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                        [0.82, -0.1] {vec.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
