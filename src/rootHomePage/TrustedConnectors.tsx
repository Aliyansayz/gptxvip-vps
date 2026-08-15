import React from 'react';
import { ShoppingBag, Database, Cloud, Cpu, FileSpreadsheet, HardDrive, Shield, GitBranch, Layers } from 'lucide-react';

export const TrustedConnectors: React.FC = () => {
    const connectors = [
        { name: 'Shopify Plus', icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />, desc: 'Cart Recovery & Dynamic Pricing' },
        { name: 'Salesforce CRM', icon: <Cloud className="w-4 h-4 text-cyan-500" />, desc: 'Lead Routing & Opportunity Scoring' },
        { name: 'AWS Infrastructure', icon: <Cpu className="w-4 h-4 text-amber-500" />, desc: 'Automated IAM & S3 Compliance' },
        { name: 'SAP ERP Ledger', icon: <Database className="w-4 h-4 text-blue-500" />, desc: 'Supply Chain PO Auto-Reordering' },
        { name: 'Jira Enterprise', icon: <FileSpreadsheet className="w-4 h-4 text-indigo-500" />, desc: 'Sprint Remediation & Bug Triaging' },
        { name: 'Oracle NetSuite', icon: <HardDrive className="w-4 h-4 text-purple-500" />, desc: 'AP/AR Invoicing Anomaly Guard' },
        { name: 'GitHub Enterprise', icon: <GitBranch className="w-4 h-4 text-zinc-400" />, desc: 'SOC 2 Evidence Auto-Harvester' }
    ];

    return (
        <section className="bg-zinc-100/70 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800/80 py-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-6 space-y-1">
                    <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                        Native Zero-Trust Connectors For Enterprise Operating Systems
                    </p>
                    <p className="text-[11px] text-zinc-500">
                        Zero custom code required • Bi-directional webhooks • 256-bit AES encrypted pipelines
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
                    {connectors.map((c) => (
                        <div 
                            key={c.name} 
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-cyan-500/50 hover:shadow-md transition-all group cursor-default"
                        >
                            <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-900 group-hover:scale-110 transition-transform">
                                {c.icon}
                            </span>
                            <div className="text-left">
                                <span className="block font-bold">{c.name}</span>
                                <span className="block text-[9px] text-zinc-600 dark:text-zinc-400 font-normal font-mono">{c.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedConnectors;
