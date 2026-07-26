import React, { useState } from 'react';
import { GlossaryTerm, Citation, TextSegment } from '../../types/types';
import { BookOpen, AlertTriangle, ShieldAlert, History, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 1. Tooltip for Domain Terms
export const TermTooltip: React.FC<{ segment: TextSegment }> = ({ segment }) => {
    const [isHovered, setIsHovered] = useState(false);

    let colorClass = 'text-primary font-semibold';
    if (segment.style === 'domain_legal') colorClass = 'text-teal-600 font-semibold cursor-help border-b border-teal-600/30 hover:border-teal-600';
    if (segment.style === 'domain_technical') colorClass = 'text-indigo-600 font-semibold cursor-help border-b border-indigo-600/30 hover:border-indigo-600';
    if (segment.style === 'domain_financial') colorClass = 'text-emerald-600 font-semibold cursor-help border-b border-emerald-600/30 hover:border-emerald-600';
    if (segment.style === 'citation') return (
        <sup className="text-xs ml-0.5">
            <a href={`#citation-${segment.link}`} className="text-indigo-500 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-2">[{segment.text}]</a>
        </sup>
    );

    return (
        <span 
            className={`relative inline-block ${colorClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {segment.text}
            <AnimatePresence>
                {isHovered && segment.definition && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white/80 backdrop-blur-xl text-slate-800 text-sm rounded-xl shadow-2xl border border-white/50 pointer-events-none"
                    >
                        <div className="font-bold mb-1.5 text-slate-900 border-b border-slate-200/50 pb-1">{segment.text}</div>
                        <div className="text-slate-600 font-normal leading-relaxed">{segment.definition}</div>
                        {/* Tooltip triangle */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/80 backdrop-blur-xl"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

// 2. Glossary Table
export const GlossaryTable: React.FC<{ terms: GlossaryTerm[] }> = ({ terms }) => {
    return (
        <div className="my-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 m-0">Key Terminology</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {terms.map((t, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row p-4 hover:bg-slate-50/50 transition-colors">
                        <div className="sm:w-1/3 font-semibold text-slate-900 mb-1 sm:mb-0">{t.term}</div>
                        <div className="sm:w-2/3 text-slate-600 text-sm leading-relaxed">{t.definition}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Context Panel (History/News)
export const ContextPanel: React.FC<{ variant: 'history' | 'news'; children: React.ReactNode }> = ({ variant, children }) => {
    const isHistory = variant === 'history';
    const Icon = isHistory ? History : Newspaper;
    const bgColor = isHistory ? 'bg-amber-50/50' : 'bg-blue-50/50';
    const borderColor = isHistory ? 'border-amber-200' : 'border-blue-200';
    const iconColor = isHistory ? 'text-amber-600' : 'text-blue-600';
    const title = isHistory ? 'Historical Context' : 'Current Events';

    return (
        <aside className={`my-8 p-6 rounded-2xl border ${borderColor} ${bgColor} flex flex-col md:flex-row gap-6 items-start shadow-sm`}>
            <div className={`p-3 bg-white rounded-xl shadow-sm border ${borderColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${iconColor}`}>{title}</h4>
                <div className="text-slate-800 leading-relaxed text-sm">
                    {children}
                </div>
            </div>
        </aside>
    );
};

// 4. Alert Block (Precautionary/Extreme)
export const AlertBlock: React.FC<{ variant: 'precautionary' | 'extreme'; children: React.ReactNode }> = ({ variant, children }) => {
    const isExtreme = variant === 'extreme';
    const Icon = isExtreme ? ShieldAlert : AlertTriangle;
    const bgColor = isExtreme ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
    const iconColor = isExtreme ? 'text-red-600' : 'text-yellow-600';
    const title = isExtreme ? 'Extreme Scenario' : 'Precautionary Note';

    return (
        <div className={`my-8 p-6 rounded-xl border ${bgColor} flex gap-4 items-start shadow-sm`}>
            <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${iconColor}`} />
            <div>
                <h4 className={`text-base font-bold mb-1 ${iconColor}`}>{title}</h4>
                <div className="text-slate-800 text-sm leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

// 5. Citation Footer
export const CitationFooter: React.FC<{ citations: Citation[] }> = ({ citations }) => {
    if (!citations || citations.length === 0) return null;

    return (
        <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">References</h3>
            <ol className="list-decimal pl-5 space-y-3">
                {citations.map((cit) => (
                    <li key={cit.id} id={`citation-${cit.id}`} className="text-sm text-slate-600 pl-2">
                        {cit.text}
                        {cit.link && (
                            <a href={cit.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-500 hover:underline">
                                [Source &nearr;]
                            </a>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};
