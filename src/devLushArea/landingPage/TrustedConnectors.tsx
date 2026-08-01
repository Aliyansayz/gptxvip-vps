import React from 'react';
import { ShoppingBag, Database, Cloud, Cpu, FileSpreadsheet, HardDrive, Shield } from 'lucide-react';

export const TrustedConnectors: React.FC = () => {
    const connectors = [
        { name: 'Shopify Plus', icon: <ShoppingBag className="w-4 h-4 text-emerald-500" /> },
        { name: 'Salesforce CRM', icon: <Cloud className="w-4 h-4 text-cyan-500" /> },
        { name: 'AWS Cloud Infrastructure', icon: <Cpu className="w-4 h-4 text-amber-500" /> },
        { name: 'SAP ERP Ledger', icon: <Database className="w-4 h-4 text-blue-500" /> },
        { name: 'Jira Enterprise', icon: <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> },
        { name: 'Oracle NetSuite', icon: <HardDrive className="w-4 h-4 text-purple-500" /> }
    ];

    return (
        <section className="bg-zinc-100/80 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800/80 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-6">
                    Native Zero-Trust Connectors For Enterprise Operating Systems
                </p>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-semibold">
                    {connectors.map((c) => (
                        <div 
                            key={c.name} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-cyan-500/40 transition-all"
                        >
                            {c.icon}
                            <span>{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
