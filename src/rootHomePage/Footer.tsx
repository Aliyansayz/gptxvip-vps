import React from 'react';
import { BarChart3, ShieldCheck, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

interface FooterProps {
    onNavigateFinhub: () => void;
    onNavigateDevLush: () => void;
    onNavigateBlogs: () => void;
    onBookDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    onNavigateFinhub,
    onNavigateDevLush,
    onNavigateBlogs,
    onBookDemo,
}) => {
    return (
        <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 pt-16 pb-12 text-zinc-600 dark:text-zinc-400 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
                
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                <BarChart3 className="text-white dark:text-black w-5 h-5" />
                            </div>
                            <span className="font-display font-black tracking-tighter text-xl uppercase text-zinc-900 dark:text-white">
                                GPTX.VIP
                            </span>
                        </div>

                        <p className="text-xs leading-relaxed max-w-sm">
                            Next-generation enterprise autonomous agent orchestration, equity valuation, and fundamental accounting intelligence platform. Certified for zero-retention high security.
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-zinc-400">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>SOC 2 Type II Certified</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
                                <span>GDPR & HIPAA Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 1: Platform */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Ecosystem Pillars
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={onNavigateFinhub} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    Finhub Equity & Accounting Lab
                                </button>
                            </li>
                            <li>
                                <button onClick={onNavigateDevLush} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    devLush AgentOS Swarms
                                </button>
                            </li>
                            <li>
                                <button onClick={onNavigateBlogs} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    Research Blogs & Papers
                                </button>
                            </li>
                            <li>
                                <a href="#fleet-catalog" className="hover:text-cyan-500 transition-colors">
                                    Specialized Fleet Catalog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Solutions */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Enterprise Verticals
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">
                                    Legal MSA Redliner
                                </a>
                            </li>
                            <li>
                                <a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">
                                    Ecommerce Margin Guard
                                </a>
                            </li>
                            <li>
                                <a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">
                                    Supply Chain Re-Routing
                                </a>
                            </li>
                            <li>
                                <a href="#governance-framework" className="hover:text-cyan-500 transition-colors">
                                    ADAPT Security Standard
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Resources & CTA */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Get Started
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={onBookDemo} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer">
                                    Request Enterprise Sandbox
                                </button>
                            </li>
                            <li>
                                <a href="#roi-calculator" className="hover:text-cyan-500 transition-colors">
                                    Calculate Enterprise ROI
                                </a>
                            </li>
                            <li>
                                <a href="#lead-magnet" className="hover:text-cyan-500 transition-colors">
                                    2026 Security Whitepaper
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-cyan-500 transition-colors">
                                    Architecture FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Legal Bar */}
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                    <p>
                        © 2026 GPTX.VIP • devLush AgentOS • All rights reserved. Zero Data Retention Enterprise Guarantee.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-emerald-500 font-mono font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            All Swarm Nodes Operational
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
