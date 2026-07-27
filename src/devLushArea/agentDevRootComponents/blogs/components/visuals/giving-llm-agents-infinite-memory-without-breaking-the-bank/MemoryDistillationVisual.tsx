import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Database, ArrowDown, FileText } from 'lucide-react';

export default function MemoryDistillationVisual({ prompt }: { prompt?: string }) {
    const [messages, setMessages] = useState<number[]>([]);
    const [vectors, setVectors] = useState<number[]>([]);
    const [compressing, setCompressing] = useState(false);

    useEffect(() => {
        let msgId = 0;
        let vecId = 0;

        const loop = async () => {
            while (true) {
                // Add messages
                for (let i = 0; i < 5; i++) {
                    await new Promise(r => setTimeout(r, 600));
                    msgId++;
                    setMessages(prev => [msgId, ...prev]);
                }
                
                // Compress
                await new Promise(r => setTimeout(r, 800));
                setCompressing(true);
                await new Promise(r => setTimeout(r, 1500));
                
                setMessages(prev => prev.slice(0, 2)); // keep last 2
                setCompressing(false);
                
                vecId++;
                setVectors(prev => [vecId, ...prev].slice(0, 4)); // max 4 vectors in view
                
                await new Promise(r => setTimeout(r, 2000));
            }
        };
        loop();
    }, []);

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 my-8 border border-slate-800 shadow-xl overflow-hidden font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Episodic Memory (Fast Context) */}
                <div className="flex flex-col h-[320px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
                    <div className="bg-slate-800 p-3 flex items-center justify-between border-b border-slate-700 z-10">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-semibold text-slate-300">Episodic Memory (Context Window)</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{messages.length}/5 Tokens</span>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col-reverse gap-2 overflow-hidden relative">
                        <AnimatePresence>
                            {messages.map((id, index) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ 
                                        opacity: 0, 
                                        scale: 0.8, 
                                        x: index >= 2 ? 50 : 0, 
                                        filter: index >= 2 ? 'blur(10px)' : 'none',
                                        transition: { duration: 0.8 }
                                    }}
                                    className={`w-full p-2 rounded border text-xs flex items-center gap-2 ${
                                        compressing && index >= 2
                                            ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300 animate-pulse'
                                            : 'bg-slate-800 border-slate-700 text-slate-400'
                                    }`}
                                >
                                    <FileText className="w-3 h-3 opacity-50" />
                                    <div className="h-2 bg-current opacity-20 w-full rounded-full" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {compressing && (
                        <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <div className="bg-indigo-900 border border-indigo-500 text-indigo-200 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                                <ArrowDown className="w-3 h-3 animate-bounce" /> Distilling old context...
                            </div>
                        </div>
                    )}
                </div>

                {/* Semantic Memory (Long-term) */}
                <div className="flex flex-col h-[320px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-800 p-3 flex items-center gap-2 border-b border-slate-700">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-300">Semantic Memory (Vector DB)</span>
                    </div>
                    
                    <div className="flex-1 p-4 grid grid-cols-2 gap-3 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900">
                        <AnimatePresence>
                            {vectors.map((id) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, scale: 0, y: -50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="aspect-square bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                >
                                    <div className="text-center">
                                        <div className="text-emerald-400 text-[10px] font-mono mb-1">Dim: 1536</div>
                                        <div className="flex justify-center gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {prompt && (
                <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center opacity-50">
                    {prompt}
                </div>
            )}
        </div>
    );
}
