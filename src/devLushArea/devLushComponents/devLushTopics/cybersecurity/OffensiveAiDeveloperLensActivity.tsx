import React from 'react';
import { Exercise } from '../../../../types';
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

const PerceptionLoopVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        <circle cx="50" cy="30" r="15" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2">
            <animateTransform attributeName="transform" type="rotate" from="0 50 30" to="360 50 30" dur="4s" repeatCount="indefinite" />
        </circle>
        
        {/* Core Agent */}
        <circle cx="50" cy="30" r="6" fill="#4f46e5" />
        <text x="50" y="31.5" textAnchor="middle" fontSize="3" className="fill-white font-bold font-mono">LLM</text>

        {/* Listeners */}
        <g transform="translate(25, 30)">
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.5" />
            <text x="0" y="1" textAnchor="middle" fontSize="3" className="fill-sky-400 font-mono">Sensors</text>
            <path d="M 8 0 L 15 0" stroke="#38bdf8" markerEnd="url(#arrow-dev-1)" />
        </g>
        
        <g transform="translate(75, 30)">
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#1e293b" stroke="#a855f7" strokeWidth="0.5" />
            <text x="0" y="1" textAnchor="middle" fontSize="3" className="fill-purple-400 font-mono">Actions</text>
            <path d="M -15 0 L -8 0" stroke="#a855f7" markerEnd="url(#arrow-dev-2)" />
        </g>

        <defs>
            <marker id="arrow-dev-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow-dev-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
        </defs>
    </svg>
);

const SyscallIsolationVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* Host OS Layer */}
        <rect x="10" y="45" width="80" height="10" rx="2" fill="#0f172a" />
        <text x="50" y="52" textAnchor="middle" fontSize="4" className="fill-slate-500 font-mono font-bold">Host OS Kernel</text>

        {/* SECCOMP Filter */}
        <rect x="20" y="35" width="60" height="6" fill="#7f1d1d" opacity="0.8" />
        <text x="50" y="39.5" textAnchor="middle" fontSize="3" className="fill-red-200 font-mono">SECCOMP BPF Filter (Block list)</text>

        {/* Isolated Containers */}
        <rect x="25" y="10" width="20" height="20" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2 1" />
        <text x="35" y="21" textAnchor="middle" fontSize="3" className="fill-yellow-500 font-mono">MicroVM A</text>

        <rect x="55" y="10" width="20" height="20" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2 1" />
        <text x="65" y="21" textAnchor="middle" fontSize="3" className="fill-yellow-500 font-mono">MicroVM B</text>

        {/* Blocked syscall attempt */}
        <path d="M 35 30 L 35 35" stroke="#ef4444" strokeWidth="1" />
        <line x1="32" y1="35" x2="38" y2="35" stroke="#ef4444" strokeWidth="1" />
    </svg>
);

export const OffensiveAiDeveloperLensActivity: React.FC<ChapterProps> = (props) => {
    const renderVisualizer = (conceptName: string) => {
        if (conceptName.includes("Perception")) {
            return <PerceptionLoopVisual />;
        }
        if (conceptName.includes("Syscall")) {
            return <SyscallIsolationVisual />;
        }
        return null;
    };

    return <ReadingActivity {...props} renderVisualizer={renderVisualizer} />;
};

export default OffensiveAiDeveloperLensActivity;
