import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ContractRedlineViewer({ prompt }: { prompt?: string }) {
    const [hoveredClause, setHoveredClause] = useState<number | null>(null);

    return (
        <div className="w-full rounded-2xl bg-slate-100 p-8 my-8 border border-slate-200 shadow-xl overflow-hidden font-serif relative text-slate-800">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900 flex items-center px-4 justify-between shadow-md z-20">
                <div className="flex items-center gap-2 text-slate-300 font-sans text-sm font-semibold">
                    <FileText className="w-4 h-4" /> Vendor_Agreement_MSA_v2.docx
                </div>
                <div className="flex items-center gap-4 text-xs font-sans text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 1 Issue Found</span>
                    <Search className="w-4 h-4" />
                </div>
            </div>

            {/* Document Body */}
            <div className="mt-10 bg-white p-8 md:p-12 shadow-sm border border-slate-200 mx-auto max-w-2xl text-sm md:text-base leading-relaxed relative z-10">
                <h2 className="text-center font-bold text-lg mb-6 uppercase tracking-wider">Master Service Agreement</h2>
                
                <p className="mb-4 text-justify">
                    This Master Service Agreement ("Agreement") is entered into as of the Effective Date by and between the Service Provider and the Client.
                </p>

                <h3 className="font-bold mt-6 mb-2">7. Indemnification</h3>
                <p className="mb-4 text-justify">
                    Service Provider agrees to indemnify, defend, and hold harmless Client from any and all claims, damages, liabilities, costs, and expenses arising from the Services provided hereunder.
                </p>

                <h3 className="font-bold mt-6 mb-2">8. Limitation of Liability</h3>
                <p className="mb-4 text-justify">
                    Except for breaches of confidentiality and indemnification obligations, 
                    <span 
                        className="bg-amber-200/60 border-b-2 border-amber-400 cursor-pointer relative px-1 mx-1 rounded-sm transition-colors hover:bg-amber-300/60"
                        onMouseEnter={() => setHoveredClause(1)}
                        onMouseLeave={() => setHoveredClause(null)}
                    >
                        under no circumstances shall either party be liable to the other for any indirect, incidental, or consequential damages.
                    </span>
                    The total liability of Service Provider shall not exceed the amount paid by Client in the preceding 12 months.
                </p>

                <h3 className="font-bold mt-6 mb-2">9. Term and Termination</h3>
                <p className="mb-4 text-justify">
                    This Agreement shall commence on the Effective Date and continue for a period of one (1) year.
                </p>
            </div>

            {/* AI Agent Popover Overlay */}
            <AnimatePresence>
                {hoveredClause === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-30 bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden font-sans"
                    >
                        <div className="bg-indigo-950/50 p-3 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                                <AlertCircle className="w-4 h-4" /> Agent Finding: Non-Standard Clause
                            </div>
                            <X className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-300" />
                        </div>
                        <div className="p-4 text-sm text-slate-300">
                            <p className="mb-3 text-xs text-slate-400">
                                This liability exclusion is too broad and may violate standard risk-sharing policies (Rule: CL-09).
                            </p>
                            
                            <div className="bg-slate-950 rounded border border-slate-800 p-3 font-serif text-xs line-through text-red-400/70 mb-2">
                                under no circumstances shall either party be liable to the other for any indirect, incidental, or consequential damages.
                            </div>
                            
                            <div className="bg-indigo-950/30 rounded border border-indigo-500/30 p-3 font-serif text-xs text-emerald-400 relative">
                                <div className="absolute -top-2.5 right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded shadow">Suggested Redline</div>
                                neither party shall be liable for indirect, incidental, or consequential damages, <strong className="bg-emerald-900/50">except in cases of gross negligence or willful misconduct.</strong>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded flex items-center justify-center gap-1 transition-colors text-xs font-semibold">
                                    <CheckCircle2 className="w-3 h-3" /> Apply Redline
                                </button>
                                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded flex items-center justify-center gap-1 transition-colors text-xs font-semibold">
                                    Ignore
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {prompt && (
                <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-500 font-mono text-center opacity-70 relative z-10">
                    {prompt}
                </div>
            )}
        </div>
    );
}
