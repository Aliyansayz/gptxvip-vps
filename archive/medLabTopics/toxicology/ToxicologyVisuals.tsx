import React from 'react';
import { Exercise } from '../../../types';
import {
    DoseResponseVisual,
    CellularToxicityVisual,
    ChromatogramVisual,
    PharmacokineticsVisual,
    ChainOfCustodyVisual,
    LeadToxicityVisual,
    ToxidromeMonitorVisual,
    ToxicologyAnalogyVisual
} from './visuals';

export const ToxicologyPrimaryVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const title = exercise.title.toLowerCase();
    const chapterId = exercise.id || ''; 

    if (chapterId.includes('tox-1') || title.includes('dose')) {
        return <DoseResponseVisual />;
    }

    if (chapterId.includes('tox-2') || title.includes('cellular') || title.includes('damage')) {
        return <CellularToxicityVisual />;
    }

    if (chapterId.includes('tox-3') || title.includes('detection')) {
        return <ChromatogramVisual />;
    }

    if (chapterId.includes('tox-4') || title.includes('monitoring')) {
        return <PharmacokineticsVisual />;
    }

    if (chapterId.includes('tox-5') || title.includes('legal')) {
        return <ChainOfCustodyVisual />;
    }

    if (chapterId.includes('tox-6') || title.includes('heavy metal')) {
        return <LeadToxicityVisual />;
    }

    if (chapterId.includes('tox-7') || title.includes('toxidrome')) {
        return <ToxidromeMonitorVisual />;
    }

    // Default Fallback
    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col items-center justify-center overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">Toxicology Analysis</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full">
                <circle cx="50" cy="25" r="10" fill="#3b82f6" className="animate-ping" />
                <circle cx="50" cy="25" r="10" fill="#2563eb" />
                <text x="50" y="45" fontSize="4" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Processing Sample...</text>
            </svg>
        </div>
    );
};

export { ToxicologyAnalogyVisual };
