import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertTriangle, Radio, Lock, Activity } from 'lucide-react';

interface AlertItem {
    id: string;
    emoji: string;
    type: string;
    ip: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    action: string;
    details: string;
}

const alerts: AlertItem[] = [
    { id: '1', emoji: '🚨', type: 'Ransomware Pre-Execution', ip: '10.0.4.52', severity: 'CRITICAL', action: 'Host Quarantined in 42ms', details: 'Obfuscated PowerShell script attempting volume shadow copy deletion.' },
    { id: '2', emoji: '📡', type: 'Data Exfiltration Spike', ip: '10.0.5.100', severity: 'HIGH', action: 'Port Blocked & Token Revoked', details: 'Outbound TCP connection to unauthorized external IP over port 4444.' },
    { id: '3', emoji: '👾', type: 'Kerberoasting Attack', ip: '10.0.2.14', severity: 'MEDIUM', action: 'Account Flagged & Audited', details: 'Abnormal TGS service ticket requests targeting Domain Admin accounts.' },
];

export default function ThreatRadarIconographic({ prompt }: { prompt?: string }) {
    const [selectedAlertId, setSelectedAlertId] = useState<string>('1');

    const selected = alerts.find(a => a.id === selectedAlertId) || alerts[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Autonomous Threat Radar <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">MTTR &lt; 1s</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Real-Time SIEM Ingestion & Automated Remediation Grid</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Blue Team Shield Online
                </div>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {alerts.map((a) => {
                    const isSelected = a.id === selectedAlertId;
                    return (
                        <button
                            key={a.id}
                            onClick={() => setSelectedAlertId(a.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{a.emoji}</span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">
                                    {a.severity}
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-200">{a.type}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1">IP: {a.ip}</div>
                        </button>
                    );
                })}
            </div>

            {/* Incident Inspector */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{selected.emoji}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{selected.type}</h5>
                                <span className="text-xs text-slate-400 font-mono">Target Host: {selected.ip}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            <Lock className="w-4 h-4" />
                            {selected.action}
                        </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.details}</p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Autonomous Action Verdict: High confidence match (&gt;95%). Automated firewall rule dispatched to edge switch.</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {prompt && (
                <div className="mt-6 text-center text-xs text-slate-500 font-mono opacity-60">
                    {prompt}
                </div>
            )}
        </div>
    );
}
