import React from 'react';
import { motion } from 'motion/react';
import { Scale, FileSearch, Link } from 'lucide-react';

export default function CaseLawNodeGraph() {
    const precedents = [
        { id: 1, name: "Oracle v. Google (2021)", similarity: "98%", color: "border-teal-500", x: "-30%", y: "-40%", delay: 0.2 },
        { id: 2, name: "Alice Corp (2014)", similarity: "85%", color: "border-indigo-500", x: "30%", y: "-35%", delay: 0.4 },
        { id: 3, name: "Lotus v. Borland (1995)", similarity: "72%", color: "border-slate-500", x: "-20%", y: "40%", delay: 0.6 },
        { id: 4, name: "Mayo v. Prometheus (2012)", similarity: "64%", color: "border-slate-600", x: "25%", y: "45%", delay: 0.8 },
    ];

    return (
        <div className="w-full h-[500px] rounded-2xl bg-slate-950 p-6 shadow-2xl border border-slate-800 relative font-sans my-8 overflow-hidden flex items-center justify-center">
            
            <div className="absolute top-6 left-6 z-20">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <FileSearch className="w-6 h-6 text-indigo-400" />
                    Semantic Vector Search
                </h3>
                <p className="text-xs text-slate-400 mt-1">Mapping natural language briefs to historical precedents.</p>
            </div>

            <div className="relative w-full max-w-lg h-full flex items-center justify-center mt-8">
                
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full z-0 opacity-30" style={{ pointerEvents: 'none' }}>
                    <motion.line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} />
                    <motion.line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4 }} />
                    <motion.line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#64748b" strokeWidth="1" strokeDasharray="4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.6 }} />
                    <motion.line x1="50%" y1="50%" x2="75%" y2="85%" stroke="#475569" strokeWidth="1" strokeDasharray="4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }} />
                </svg>

                {/* Central Node */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-24 h-24 bg-slate-900 border-2 border-indigo-400 rounded-full flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20 relative z-10 p-2 text-center">
                        <Scale className="w-6 h-6 text-indigo-300 mb-1" />
                        <span className="text-[10px] font-bold text-slate-200 leading-tight">Current Brief</span>
                    </div>
                </div>

                {/* Precedent Nodes */}
                {precedents.map((node) => (
                    <motion.div 
                        key={node.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: node.delay, type: 'spring', stiffness: 100 }}
                        className={`absolute z-10 bg-slate-900 border ${node.color} rounded-xl p-3 shadow-xl flex flex-col items-center min-w-[120px]`}
                        style={{ transform: `translate(${node.x}, ${node.y})` }}
                    >
                        <div className="text-xs font-bold text-slate-200 text-center mb-1">{node.name}</div>
                        <div className="bg-slate-800 rounded px-2 py-0.5 flex items-center gap-1 mt-1 border border-slate-700">
                            <Link className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-mono text-emerald-400">{node.similarity} Match</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
    );
}
