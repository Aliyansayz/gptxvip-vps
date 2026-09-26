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
        <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 pt-10 sm:pt-16 pb-8 sm:pb-12 text-zinc-600 dark:text-zinc-400 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
                
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 text-left">
                    
                    {/* Brand Col */}
                    <div className="col-span-2 lg:col-span-2 space-y-3.5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                <BarChart3 className="text-white dark:text-black w-5 h-5" />
                            </div>
                            <span className="font-sans font-black tracking-tight text-xl uppercase text-zinc-900 dark:text-white">
                                GPTX.VIP
                            </span>
                        </div>

                        <p className="text-xs leading-relaxed max-w-sm">
                            Next-generation enterprise autonomous agent orchestration, equity valuation, and fundamental accounting intelligence platform. Certified for zero-retention high security.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-zinc-400">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-mono">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>SOC 2 Type II Certified</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-mono">
                                <span>GDPR &amp; HIPAA Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 1: Platform */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Ecosystem Pillars
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={onNavigateFinhub} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    Finhub Equity &amp; Accounting Lab
                                </button>
                            </li>
                            <li>
                                <button onClick={onNavigateDevLush} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    devLush Autonomous Swarms
                                </button>
                            </li>
                            <li>
                                <button onClick={onNavigateBlogs} className="hover:text-cyan-500 transition-colors cursor-pointer">
                                    Research Blogs &amp; Papers
                                </button>
                            </li>
                            <li>
                                <button onClick={onBookDemo} className="hover:text-cyan-500 transition-colors cursor-pointer font-bold text-cyan-500">
                                    Deploy Enterprise Sandbox &rarr;
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Verticals */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Verticals
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">Legal &amp; IP Redlining</a></li>
                            <li><a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">Ecommerce Margin Guard</a></li>
                            <li><a href="#vertical-solutions" className="hover:text-cyan-500 transition-colors">Supply Chain PO Logistics</a></li>
                            <li><a href="#fleet-catalog" className="hover:text-cyan-500 transition-colors">Autonomous Fleet Catalog</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Governance */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                            Governance &amp; Trust
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#governance-framework" className="hover:text-cyan-500 transition-colors">ADAPT Security Standard</a></li>
                            <li><a href="#roi-calculator" className="hover:text-cyan-500 transition-colors">Enterprise ROI Modeler</a></li>
                            <li><a href="#faq" className="hover:text-cyan-500 transition-colors">Compliance FAQ</a></li>
                            <li><a href="#lead-magnet" className="hover:text-cyan-500 transition-colors">2026 Security Whitepaper</a></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                    <p className="text-zinc-500">
                        &copy; {new Date().getFullYear()} GPTX.VIP &bull; devLush AgentOS &bull; All enterprise rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-zinc-400">
                        <span>Security Policy</span>
                        <span>&bull;</span>
                        <span>Terms of Service</span>
                        <span>&bull;</span>
                        <span>SOC 2 Portal</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
