import React from 'react';
import { Exercise } from '../../devLushTypes';

import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import ReadingActivity from '../shared/ReadingActivity';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
    labData?: any;
}

const PayloadSanitizationVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* Unsanitized Payload Pipeline */}
        <text x="15" y="25" fontSize="4" className="fill-slate-500 dark:fill-slate-400 font-mono">Raw Input</text>
        <path d="M 10 35 L 45 35" stroke="#475569" strokeDasharray="2 2" />
        <circle cx="10" cy="35" r="2" fill="#ef4444">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L 35 0" />
        </circle>

        {/* Sanitization Filter */}
        <rect x="45" y="20" width="10" height="30" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1" />
        <path d="M 45 25 L 55 45 M 45 45 L 55 25" stroke="#10b981" strokeWidth="0.5" opacity="0.5" />
        <text x="50" y="15" textAnchor="middle" fontSize="4" className="fill-emerald-500 font-bold font-mono">Sanitizer</text>

        {/* Clean Payload */}
        <path d="M 55 35 L 90 35" stroke="#475569" strokeDasharray="2 2" />
        <circle cx="55" cy="35" r="2" fill="#10b981">
            <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 0 0 L 35 0" />
        </circle>
        <text x="75" y="25" fontSize="4" className="fill-slate-500 dark:fill-slate-400 font-mono">Safe Token</text>
    </svg>
);

const PrivilegeDroppingVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* High Privilege (Admin) */}
        <rect x="10" y="10" width="35" height="40" rx="2" fill="#4c0519" stroke="#ef4444" strokeWidth="1" />
        <text x="27.5" y="18" textAnchor="middle" fontSize="4" className="fill-red-400 font-bold font-mono">ROOT / ADMIN</text>
        <circle cx="27.5" cy="30" r="6" fill="#ef4444" opacity="0.8" />
        <text x="27.5" y="45" textAnchor="middle" fontSize="3" className="fill-red-400 font-mono">Vulnerable Agent</text>

        {/* Transition */}
        <path d="M 45 30 L 55 30" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow-flow-priv)" />

        {/* Low Privilege (Dropped) */}
        <rect x="55" y="15" width="35" height="30" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
        <text x="72.5" y="23" textAnchor="middle" fontSize="4" className="fill-blue-400 font-bold font-mono">USER_PROC</text>
        <circle cx="72.5" cy="32" r="4" fill="#3b82f6" opacity="0.8" />
        <text x="72.5" y="42" textAnchor="middle" fontSize="3" className="fill-blue-400 font-mono">Least Privilege Sandbox</text>

        <defs>
            <marker id="arrow-flow-priv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
        </defs>
    </svg>
);

export const OffensiveAiSecurityLensActivity: React.FC<ChapterProps> = (props) => {
    const renderVisualizer = (conceptName: string) => {
        if (conceptName.includes("Sanitization")) {
            return <PayloadSanitizationVisual />;
        }
        if (conceptName.includes("Privilege")) {
            return <PrivilegeDroppingVisual />;
        }
        return null;
    };

    return <ReadingActivity {...props} renderVisualizer={renderVisualizer} />;
};

export default OffensiveAiSecurityLensActivity;
