import React from 'react';
import { motion } from 'motion/react';
import { Database, ArrowRight, FileText, Code, CheckCircle2 } from 'lucide-react';

export default function DataInfographicVisual() {
    return (
        <div className="w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-slate-800 font-sans my-8 overflow-hidden relative">
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-400" />
                Data Ingestion & Extraction Flow
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                {/* Step 1: Unstructured Data */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg relative w-full">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-4 border-slate-950 z-10 shadow-lg">1</div>
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-slate-200">Unstructured Treaties</h4>
                    </div>
                    <div className="text-xs text-slate-400 font-serif leading-relaxed line-clamp-3 mb-3 italic">
                        "Dividends paid by a company which is a resident of a Contracting State... may be taxed in that State... but if the beneficial owner is a resident... the tax so charged shall not exceed 15 percent..."
                    </div>
                    <div className="mt-auto flex gap-2 pt-2 border-t border-slate-800">
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700">PDFs</span>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700">Gov Portals</span>
                    </div>
                </div>

                <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="hidden lg:flex items-center justify-center text-slate-500"
                >
                    <ArrowRight className="w-8 h-8" />
                </motion.div>

                {/* Step 2: Vectorization */}
                <div className="flex-1 bg-indigo-950/40 border border-indigo-900/50 rounded-xl p-5 shadow-lg relative w-full h-full flex flex-col justify-center">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-4 border-slate-950 z-10 shadow-lg">2</div>
                    <div className="flex items-center gap-3 mb-4">
                        <Code className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-bold text-slate-200">Vector Embeddings</h4>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5 mb-4">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                                className="h-2 bg-indigo-500/50 rounded-sm"
                            />
                        ))}
                    </div>
                    <div className="text-[10px] text-indigo-300/70 font-mono text-center bg-indigo-950/50 py-1 rounded">
                        [0.014, -0.421, 0.881, ...]
                    </div>
                </div>

                <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse", delay: 0.5 }}
                    className="hidden lg:flex items-center justify-center text-slate-500"
                >
                    <ArrowRight className="w-8 h-8" />
                </motion.div>

                {/* Step 3: Structured Output */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg relative w-full h-full flex flex-col justify-center">
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-4 border-slate-950 z-10 shadow-lg">3</div>
                     <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-slate-200">Structured JSON</h4>
                    </div>
                    <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-[11px] text-emerald-300 shadow-inner">
                        <div className="text-pink-400">{"{"}</div>
                        <div className="pl-4 py-0.5"><span className="text-slate-300">"treaty"</span>: <span className="text-yellow-200">"US-IE Art 12"</span>,</div>
                        <div className="pl-4 py-0.5"><span className="text-slate-300">"maxRate"</span>: <span className="text-blue-300">15.0</span></div>
                        <div className="text-pink-400">{"}"}</div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        </div>
    );
}
