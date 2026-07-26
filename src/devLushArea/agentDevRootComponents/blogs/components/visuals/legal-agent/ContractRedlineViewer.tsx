import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export default function ContractRedlineViewer() {
    const [hoveredRedline, setHoveredRedline] = useState<boolean>(false);

    return (
        <div className="w-full rounded-2xl bg-slate-950 p-6 shadow-2xl border border-slate-800 font-sans my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-400" />
                Contract Analysis Viewer
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Document Viewer */}
                <div className="flex-1 bg-slate-100 rounded-xl p-6 shadow-inner text-slate-800 text-sm leading-relaxed font-serif relative overflow-hidden">
                    <p className="mb-4">
                        <strong>7.1 Indemnification.</strong> Vendor agrees to indemnify and hold harmless the Company from any claims arising out of this Agreement.
                    </p>
                    <p className="mb-4">
                        <strong>7.2 Liability.</strong> 
                        <span 
                            className="bg-yellow-300/50 cursor-pointer border-b-2 border-yellow-500 transition-colors hover:bg-yellow-300 px-1 rounded relative mx-1"
                            onMouseEnter={() => setHoveredRedline(true)}
                            onMouseLeave={() => setHoveredRedline(false)}
                        >
                            Vendor's liability under this agreement shall be completely unlimited and unconstrained by any financial cap or time limit.
                        </span>
                    </p>
                    <p>
                        <strong>7.3 Confidentiality.</strong> Both parties agree to maintain strict confidentiality regarding all proprietary data shared during the term.
                    </p>
                    
                    {/* Popover */}
                    <AnimatePresence>
                        {hoveredRedline && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-10"
                            >
                                <div className="flex items-start gap-3 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-100">Critical Deviation Found</h4>
                                        <p className="text-xs text-slate-400 mt-1">Unlimited liability violates corporate risk policy.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 rounded p-3 mt-3 relative">
                                    <div className="text-[10px] uppercase text-teal-400 font-bold mb-1 tracking-wider">Suggested Redline</div>
                                    <p className="text-sm text-slate-200 font-serif line-through decoration-red-500 mb-2 opacity-70">
                                        liability... shall be completely unlimited...
                                    </p>
                                    <p className="text-sm text-emerald-400 font-serif border-l-2 border-emerald-500 pl-2">
                                        Vendor's total aggregate liability shall be strictly capped at the fees paid in the trailing 12 months.
                                    </p>
                                    <CheckCircle className="w-4 h-4 text-emerald-500 absolute top-3 right-3 opacity-50" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-3">
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">Agent Status</div>
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Analysis Complete
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex-1">
                         <div className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-bold">Flagged Issues</div>
                         <div className="bg-slate-800/50 border border-amber-500/30 rounded p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
                              onMouseEnter={() => setHoveredRedline(true)}
                              onMouseLeave={() => setHoveredRedline(false)}
                         >
                             <div className="flex items-center gap-2">
                                 <AlertTriangle className="w-4 h-4 text-amber-500" />
                                 <span className="text-sm text-slate-200">Liability Clause</span>
                             </div>
                             <ChevronRight className="w-4 h-4 text-slate-500" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
