import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Zap, Lock, Cpu } from 'lucide-react';

export const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How does devLush AgentOS guarantee zero enterprise data leakage?",
            a: "Our ADAPT framework enforces strict OAuth2 RBAC, automatic PII redaction prior to model inference, and zero data retention agreements with foundation model providers. Your enterprise documents and proprietary trade secrets are never stored, logged, or used for model training."
        },
        {
            q: "How does Finhub perform automated equity valuation and fundamental analysis?",
            a: "Finhub's fundamental intelligence engine ingests SEC EDGAR 10-K/10-Q filings, computes multi-scenario DCF (Discounted Cash Flow) intrinsic valuations, WACC discount rate schedules, and performs automated DuPont accounting ratio reconciliations in seconds."
        },
        {
            q: "How long does it take to connect our enterprise ERP (SAP / NetSuite / Salesforce)?",
            a: "Most native connectors (Shopify Plus, Salesforce, AWS Cloud, NetSuite, SAP) can be deployed within 15 minutes using bi-directional webhooks and pre-configured least-privilege OAuth scopes without writing custom integration code."
        },
        {
            q: "Can we test drive agent swarms in an isolated sandbox before production rollout?",
            a: "Yes! All enterprise pilots include access to our isolated Deterministic Agent Sandbox where you can run synthetic workloads, review automated redlining outputs, and benchmark ROI before connecting live API tokens."
        },
        {
            q: "What governance controls exist for high-risk autonomous agent actions?",
            a: "Our Deterministic Policy Engine allows you to define hard threshold circuit-breakers (e.g. monetary transfers over $5k, contractual liability changes over 3x, or production firewall rules) which automatically pause execution and route to human managers for 1-click sign-off."
        }
    ];

    return (
        <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                    Frequently Asked Questions
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Enterprise Architecture & Governance Answers
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Everything you need to know about security, equity valuation models, and pilot deployment.
                </p>
            </div>

            <div className="space-y-4 text-left">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={idx}
                            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                            >
                                <span className="flex items-center gap-3">
                                    <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0" />
                                    <span>{faq.q}</span>
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                                        isOpen ? 'rotate-180 text-cyan-500' : ''
                                    }`}
                                />
                            </button>

                            {isOpen && (
                                <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FaqSection;
