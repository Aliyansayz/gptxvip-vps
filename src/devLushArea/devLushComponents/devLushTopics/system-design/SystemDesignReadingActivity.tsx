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

const ReplicationVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* Primary Node */}
        <rect x="40" y="10" width="20" height="15" rx="2" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="50" y="19" textAnchor="middle" fontSize="4" className="fill-indigo-400 font-bold font-mono">PRIMARY</text>

        {/* Replica 1 */}
        <rect x="20" y="35" width="20" height="15" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
        <text x="30" y="44" textAnchor="middle" fontSize="4" className="fill-slate-300 font-mono">REPLICA 1</text>

        {/* Replica 2 */}
        <rect x="60" y="35" width="20" height="15" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
        <text x="70" y="44" textAnchor="middle" fontSize="4" className="fill-slate-300 font-mono">REPLICA 2</text>

        {/* Replication Arrows */}
        <path d="M 45 25 L 30 35" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" markerEnd="url(#arrow-sd-1)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M 55 25 L 70 35" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" markerEnd="url(#arrow-sd-2)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.8s" repeatCount="indefinite" />
        </path>

        <defs>
            <marker id="arrow-sd-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80" />
            </marker>
            <marker id="arrow-sd-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80" />
            </marker>
        </defs>
    </svg>
);

export const SystemDesignReadingActivity: React.FC<ChapterProps> = (props) => {
    const renderVisualizer = (conceptName: string) => {
        if (conceptName.includes("Replication") || conceptName.includes("Consistency")) {
            return <ReplicationVisual />;
        }
        return null;
    };

    return <ReadingActivity {...props} renderVisualizer={renderVisualizer} />;
};

export default SystemDesignReadingActivity;
