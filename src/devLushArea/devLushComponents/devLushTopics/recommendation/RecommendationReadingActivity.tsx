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

const FilteringVisual: React.FC = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full max-h-[150px] mx-auto overflow-visible">
        {/* User Node */}
        <circle cx="20" cy="30" r="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="20" y="32" textAnchor="middle" fontSize="4" className="fill-indigo-400 font-bold font-mono">USER</text>

        {/* Similar User Node */}
        <circle cx="20" cy="10" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.5" />
        <text x="20" y="11" textAnchor="middle" fontSize="2.5" className="fill-slate-300 font-mono">SIMILAR</text>

        {/* Item Node */}
        <rect x="70" y="22" width="16" height="16" rx="2" fill="#022c22" stroke="#34d399" strokeWidth="1" />
        <text x="78" y="31" textAnchor="middle" fontSize="4" className="fill-emerald-400 font-bold font-mono">ITEM</text>

        {/* Collaborative Filtering Path (User -> Similar User -> Item) */}
        <path d="M 20 20 L 20 16" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1 1" />
        <path d="M 26 10 L 78 22" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1 1" markerEnd="url(#arrow-rec-1)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
        </path>
        <text x="50" y="14" textAnchor="middle" fontSize="3" className="fill-rose-400 font-mono">Collaborative</text>

        {/* Content-Based Filtering Path (User -> Item directly) */}
        <path d="M 30 30 L 70 30" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#arrow-rec-2)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
        <text x="50" y="34" textAnchor="middle" fontSize="3" className="fill-blue-400 font-mono">Content-Based</text>

        <defs>
            <marker id="arrow-rec-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-rec-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
        </defs>
    </svg>
);

export const RecommendationReadingActivity: React.FC<ChapterProps> = (props) => {
    const renderVisualizer = (conceptName: string) => {
        if (conceptName.includes("Filtering") || conceptName.includes("Recommendation")) {
            return <FilteringVisual />;
        }
        return null;
    };

    return <ReadingActivity {...props} renderVisualizer={renderVisualizer} />;
};

export default RecommendationReadingActivity;
