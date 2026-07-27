import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, Layers, FileJson } from 'lucide-react';

export default function DataInfographicVisual({ prompt }: { prompt?: string }) {
    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-8 my-8 border border-slate-800 shadow-xl overflow-hidden relative group">
            <h4 className="text-slate-300 text-sm font-semibold tracking-wider uppercase mb-8">Data Transformation Flow</h4>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Step 1 */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm w-full md:w-auto"
                >
                    <FileText className="w-10 h-10 text-slate-400 mb-4" />
                    <span className="text-slate-300 text-sm font-medium text-center">Unstructured<br/>Treaty Text</span>
                </motion.div>
                
                <ArrowRight className="text-slate-600 hidden md:block" />
                <div className="md:hidden h-4 w-[2px] bg-slate-600" />
                
                {/* Step 2 */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30 backdrop-blur-sm w-full md:w-auto relative"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-xl border border-indigo-500/10"
                    />
                    <Layers className="w-10 h-10 text-indigo-400 mb-4 relative z-10" />
                    <span className="text-indigo-200 text-sm font-medium text-center relative z-10">Vector<br/>Embeddings</span>
                </motion.div>

                <ArrowRight className="text-slate-600 hidden md:block" />
                <div className="md:hidden h-4 w-[2px] bg-slate-600" />

                {/* Step 3 */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center bg-emerald-900/30 p-6 rounded-xl border border-emerald-500/30 backdrop-blur-sm w-full md:w-auto shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                >
                    <FileJson className="w-10 h-10 text-emerald-400 mb-4" />
                    <span className="text-emerald-200 text-sm font-medium text-center">Structured<br/>JSON Report</span>
                </motion.div>
            </div>
            
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {prompt && (
                <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center opacity-50 relative z-10">
                    {prompt}
                </div>
            )}
        </div>
    );
}
