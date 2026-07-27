import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Database, Search, ArrowRightLeft } from 'lucide-react';

interface MemoryStage {
    id: string;
    emoji: string;
    name: string;
    layer: 'Episodic Scratchpad' | 'Semantic Vector Store';
    tokens: string;
    action: string;
    description: string;
}

const memoryStages: MemoryStage[] = [
    { id: 'episodic', emoji: '🧠', name: 'Episodic Scratchpad', layer: 'Episodic Scratchpad', tokens: '3,850 / 4,000 Tokens', action: 'Fast Turn Retrieval', description: 'Holds exact text transcript for the last 10 messages. Fast, zero-RAG latency.' },
    { id: 'eviction', emoji: '⚡', name: 'Eviction & Compression', layer: 'Episodic Scratchpad', tokens: '-1,200 Evicted', action: 'LLM-Mini Distillation', description: 'Extracts core entities and user preferences while discarding filler text.' },
    { id: 'semantic', emoji: '💎', name: 'Semantic Knowledge Base', layer: 'Semantic Vector Store', tokens: '1,536-Dim Embeddings', action: 'Vector Upsert', description: 'Stores distilled facts as dense vector embeddings in Pinecone/Chroma.' },
    { id: 'retrieval', emoji: '🔍', name: 'Infinite Recall RAG', layer: 'Semantic Vector Store', tokens: '+120 Tokens Injected', action: 'Cosine Top-K Match', description: 'Retrieves relevant turn-1 historical facts seamlessly during turn-50 prompts.' },
];

export default function BrainMemoryIconographic({ prompt }: { prompt?: string }) {
    const [activeStageId, setActiveStageId] = useState<string>('episodic');

    const active = memoryStages.find(s => s.id === activeStageId) || memoryStages[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Dual-Hemisphere Memory Inspector <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-500/30">Cost -80%</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Bounded Active Context Window with Infinite Semantic Recall</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Vector Engine Online
                </div>
            </div>

            {/* Stage Selector Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {memoryStages.map((s) => {
                    const isSelected = s.id === activeStageId;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setActiveStageId(s.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{s.emoji}</span>
                            </div>
                            <div className="font-semibold text-xs text-slate-200">{s.name}</div>
                            <div className="text-[10px] font-mono text-purple-400 mt-1">{s.action}</div>
                        </button>
                    );
                })}
            </div>

            {/* Inspector Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{active.emoji}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{active.name}</h5>
                                <span className="text-xs text-purple-400 font-mono">{active.layer}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                            <Zap className="w-4 h-4 text-amber-400" />
                            {active.tokens}
                        </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{active.description}</p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <ArrowRightLeft className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Memory Protocol: Context capped at 4,000 tokens while maintaining complete conversation fidelity.</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {prompt && (
                <div className="mt-6 text-center text-xs text-slate-500 font-mono opacity-60">
                    {prompt}
                </div>
            )}
        </div>
    );
}
