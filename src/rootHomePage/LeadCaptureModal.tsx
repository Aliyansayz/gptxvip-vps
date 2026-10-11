import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Zap, Bot, ArrowRight, Building, Mail, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialNote?: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
    isOpen,
    onClose,
    initialNote = ''
}) => {
    const [fullName, setFullName] = useState('');
    const [workEmail, setWorkEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('50-250');
    const [useCase, setUseCase] = useState('Autonomous Agent Fleet (devLush)');
    const [customNote, setCustomNote] = useState(initialNote);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (initialNote) {
            setCustomNote(initialNote);
        }
    }, [initialNote]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!workEmail.includes('@')) {
            toast.error('Please enter a valid work email.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            toast.success('Your Enterprise Sandbox request has been prioritized! An architect will reach out within 2 hours.');
        }, 900);
    };

    const handleResetAndClose = () => {
        setIsSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100"
            >
                {/* Modal Top Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                Deploy Enterprise Agent Fleet
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Schedule a 1-on-1 architecture briefing & private sandbox access
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleResetAndClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {isSuccess ? (
                        <div className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                Sandbox Access Request Confirmed
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                                Thank you, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{fullName || 'there'}</span>. We have provisioned your dedicated tenant and dispatched meeting credentials to <span className="font-mono text-cyan-500 font-bold">{workEmail}</span>.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={handleResetAndClose}
                                    className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Return to Platform
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Sarah Jenkins"
                                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Work Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={workEmail}
                                            onChange={(e) => setWorkEmail(e.target.value)}
                                            placeholder="sarah@acme-corp.com"
                                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Acme Global Inc."
                                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Company Size
                                    </label>
                                    <select
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="10-50">10 - 50 Employees</option>
                                        <option value="50-250">50 - 250 Employees</option>
                                        <option value="250-1000">250 - 1,000 Employees</option>
                                        <option value="1000+">1,000+ Enterprise</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Target Deployment Objective
                                </label>
                                <select
                                    value={useCase}
                                    onChange={(e) => setUseCase(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500"
                                >
                                    <option value="Autonomous Agent Fleet (devLush)">devLush Autonomous Swarm Fleet</option>
                                    <option value="Finhub Valuation & Fundamentals">Finhub Equity Valuation & Fundamental Accounting</option>
                                    <option value="Legal & IP Redline Automation">Legal & IP Contract Redlining</option>
                                    <option value="Ecommerce Buy-Box Margin Guard">Ecommerce Dynamic Pricing Guard</option>
                                    <option value="Continuous SOC2 Compliance">Continuous Cybersecurity & SOC 2</option>
                                </select>
                            </div>

                            {customNote && (
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Calculated Notes & Constraints
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={customNote}
                                        onChange={(e) => setCustomNote(e.target.value)}
                                        className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span>Confirming Tenant Allocation...</span>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 fill-zinc-950" />
                                            <span>Request Private Enterprise Sandbox</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC 2 Type II
                                </span>
                                <span>•</span>
                                <span>Zero Data Retention</span>
                                <span>•</span>
                                <span>No Credit Card Required</span>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LeadCaptureModal;
