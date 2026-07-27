import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Search, Link as LinkIcon, BookOpen } from 'lucide-react';

const cases = [
    { id: 1, name: "Smith v. TechCorp (2019)", score: "94%", desc: "Direct precedent on algorithmic liability.", x: 20, y: 15, delay: 0.5 },
    { id: 2, name: "DataPrivacy LLC v. State (2021)", score: "88%", desc: "Established data processing norms.", x: 75, y: 10, delay: 1.0 },
    { id: 3, name: "Doe v. AI Systems (2023)", score: "82%", desc: "Addressed autonomous agent autonomy.", x: 85, y: 65, delay: 1.5 },
    { id: 4, name: "State v. RobotMakers (2015)", score: "76%", desc: "Hardware liability, tangentially related.", x: 15, y: 75, delay: 2.0 },
];

export default function CaseLawNodeGraph({ prompt }: { prompt?: string }) {
    const [activeNodes, setActiveNodes] = useState<number[]>([]);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    useEffect(() => {
        const loadNodes = async () => {
            for (const c of cases) {
                await new Promise(r => setTimeout(r, 800));
                setActiveNodes(prev => [...prev, c.id]);
            }
        };
        loadNodes();
    }, []);

    return (
        <div className="w-full h-[500px] rounded-2xl bg-slate-950 p-6 my-8 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
            <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                    <Search className="w-5 h-5" /> Semantic Vector Search
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 shadow-lg max-w-xs">
                    <span className="text-slate-500 font-mono text-xs block mb-1">Query:</span>
                    "Liability for autonomous agents executing automated contracts without explicit human oversight."
                </div>
            </div>

            <div className="absolute inset-0 z-10">
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] z-20">
                        <Scale className="w-8 h-8 text-indigo-400" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700 z-20">Current Case</span>
                </div>

                {/* Nodes & Edges */}
                <AnimatePresence>
                    {cases.map((c) => {
                        const isActive = (activeNodes || []).includes(c.id);
                        if (!isActive) return null;

                        return (
                            <React.Fragment key={c.id}>
                                {/* SVG Line */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                                    <motion.line
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        x1="50%" y1="50%"
                                        x2={`${c.x}%`} y2={`${c.y}%`}
                                        stroke={hoveredNode === c.id ? "#818cf8" : "#334155"}
                                        strokeWidth={hoveredNode === c.id ? "2" : "1"}
                                        strokeDasharray={hoveredNode === c.id ? "none" : "4 4"}
                                    />
                                </svg>

                                {/* Node */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute z-20 cursor-pointer"
                                    style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
                                    onMouseEnter={() => setHoveredNode(c.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                >
                                    <div className="relative group flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            hoveredNode === c.id ? 'bg-emerald-500 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 border-2 border-slate-600'
                                        }`}>
                                            <BookOpen className={`w-4 h-4 ${hoveredNode === c.id ? 'text-white' : 'text-slate-400'}`} />
                                        </div>
                                        
                                        <div className={`mt-2 text-xs px-2 py-1 rounded whitespace-nowrap transition-colors ${
                                            hoveredNode === c.id ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50' : 'text-slate-400'
                                        }`}>
                                            {c.score} Match
                                        </div>

                                        {/* Hover Popover */}
                                        <AnimatePresence>
                                            {hoveredNode === c.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl z-30"
                                                >
                                                    <div className="font-bold text-slate-200 text-sm mb-1">{c.name}</div>
                                                    <div className="text-slate-400 text-xs mb-2 leading-relaxed">{c.desc}</div>
                                                    <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300">
                                                        <LinkIcon className="w-3 h-3" /> View Source Text
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </AnimatePresence>
            </div>

            {prompt && (
                <div className="absolute bottom-4 left-0 w-full text-xs text-slate-500 font-mono text-center opacity-50 z-30 pointer-events-none px-4">
                    {prompt}
                </div>
            )}
        </div>
    );
}
