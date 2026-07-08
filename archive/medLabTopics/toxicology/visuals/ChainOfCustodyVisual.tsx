import React from 'react';
import { ClipboardList } from 'lucide-react';

export const ChainOfCustodyVisual: React.FC = () => {
    const custodyData = [
        { name: "Sample Collected", value: "08:00 AM", unit: "", normal: "Officer A", category: "normal" },
        { name: "Sample Sealed", value: "08:05 AM", unit: "", normal: "Tamper-Evident Seal", category: "normal" },
        { name: "Log Updated", value: "08:15 AM", unit: "", normal: "Badge #4492", category: "normal" },
        { name: "Lab Receipt", value: "09:30 AM", unit: "", normal: "Tech B (Signed)", category: "normal" },
        { name: "Storage Temp", value: "04.0", unit: "°C", normal: "2-8°C Protocol", category: "normal" },
        { name: "Analyzed", value: "10:45 AM", unit: "", normal: "GC-MS Active", category: "normal" }
    ];

    const getStatusColor = (param: any) => {
        if (param.category === 'low') return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
        if (param.category === 'high') return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
        if (param.category === 'abnormal') return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
    };

    const getStatusIcon = (param: any) => {
        if (param.category === 'low') return '↓';
        if (param.category === 'high') return '↑';
        if (param.category === 'abnormal') return '⚠';
        return '✓';
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full border border-amber-200 dark:border-amber-800">
                    <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground mt-1">Review the custody log below to identify crucial forensic procedures.</p>
                </div>
            </div>
            
            <div className="flex-1">
                <div className="bg-muted/30 rounded-xl p-4 border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {custodyData.map((param, idx) => (
                            <div 
                                key={idx}
                                className={`p-4 rounded-lg border flex flex-col justify-between ${getStatusColor(param)}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm border-b-2 border-transparent uppercase tracking-wide opacity-80">{param.name}</span>
                                    <span className="font-bold text-lg flex items-center gap-1">
                                        {param.value} <span className="text-sm font-normal opacity-70">{param.unit}</span> {getStatusIcon(param)}
                                    </span>
                                </div>
                                <div className="text-xs opacity-70 border-t border-current/20 pt-2 mt-1">
                                    Reference: {param.normal}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
