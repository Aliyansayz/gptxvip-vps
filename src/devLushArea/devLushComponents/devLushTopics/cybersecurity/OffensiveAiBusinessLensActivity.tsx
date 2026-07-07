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

const AttackSurfaceVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* Radar Scanner */}
        <circle cx="50" cy="30" r="20" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="50" cy="30" r="10" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 50 30 L 70 30" stroke="#4ade80" strokeWidth="1" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 50 30" to="360 50 30" dur="3s" repeatCount="indefinite" />
        </path>
        
        {/* Discovered Assets */}
        <circle cx="65" cy="18" r="2" fill="#ef4444" opacity="0.8">
            <animate attributeName="opacity" values="0.2; 1; 0.2" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x="70" y="19" fontSize="3" className="fill-red-400 font-mono">Exposed API</text>

        <circle cx="35" cy="42" r="2" fill="#3b82f6" opacity="0.8">
            <animate attributeName="opacity" values="0.2; 1; 0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="25" y="46" fontSize="3" className="fill-blue-400 font-mono">Staging DB</text>

        <circle cx="40" cy="15" r="2" fill="#f59e0b" opacity="0.8">
            <animate attributeName="opacity" values="0.2; 1; 0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
    </svg>
);

const PenTestVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* Agent Node */}
        <rect x="10" y="25" width="16" height="12" rx="2" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="18" y="32" textAnchor="middle" fontSize="4" className="fill-indigo-400 font-bold font-mono">AGENT</text>

        {/* Attack Paths */}
        <path d="M 26 31 L 70 20" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="2 2" markerEnd="url(#arrow-biz-1)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M 26 31 L 70 42" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="2 2" markerEnd="url(#arrow-biz-2)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />
        </path>

        {/* Target Systems */}
        <rect x="74" y="15" width="16" height="10" rx="1" fill="#022c22" stroke="#34d399" strokeWidth="0.5" />
        <text x="82" y="21" textAnchor="middle" fontSize="3" className="fill-emerald-400 font-mono">Web App</text>
        
        <rect x="74" y="37" width="16" height="10" rx="1" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.5" />
        <text x="82" y="43" textAnchor="middle" fontSize="3" className="fill-slate-300 font-mono">Auth API</text>

        <defs>
            <marker id="arrow-biz-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-biz-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
        </defs>
    </svg>
);

export const OffensiveAiBusinessLensActivity: React.FC<ChapterProps> = (props) => {
    const renderVisualizer = (conceptName: string) => {
        if (conceptName.includes("Attack Surface") || conceptName.includes("Discovery")) {
            return <AttackSurfaceVisual />;
        }
        if (conceptName.includes("Penetration Testing") || conceptName.includes("Automated")) {
            return <PenTestVisual />;
        }
        return null;
    };

    return <ReadingActivity {...props} renderVisualizer={renderVisualizer} />;
};

export default OffensiveAiBusinessLensActivity;
