import React, { useState } from 'react';
import { AgenticRoleChapter } from '../../agenticRoleTypes';
import DifficultyBadge from './DifficultyBadge';
import { Play, CheckCircle2, Clock, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { getRoleTheme } from '../../agenticThemeHelpers';

interface RoadmapMilestoneCardProps {
  chapter: AgenticRoleChapter;
  isCompleted?: boolean;
  onLaunch: (chapter: AgenticRoleChapter) => void;
}

export const RoadmapMilestoneCard: React.FC<RoadmapMilestoneCardProps> = ({
  chapter,
  isCompleted = false,
  onLaunch
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const theme = getRoleTheme(chapter.roleDomain);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl bg-slate-900/90 backdrop-blur border border-slate-800 p-6 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl overflow-hidden group flex flex-col justify-between"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${theme.spotlightRgb}, 0.15), transparent 80%)`
        }}
      />

      <div className="space-y-4 relative z-10">
        {/* Card Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: `rgba(${theme.spotlightRgb}, 0.15)`,
                borderColor: `rgba(${theme.spotlightRgb}, 0.4)`,
                color: theme.accentHex
              }}
            >
              DAY 0{chapter.day}
            </span>
            <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{chapter.estimatedMinutes || 25}m</span>
          </div>
        </div>

        {/* Title and Focus */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
            {chapter.day_title || chapter.chapter_title}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {chapter.chapter_title !== chapter.day_title ? chapter.chapter_title : chapter.course}
          </p>
        </div>

        {/* Core Concepts Chips */}
        {chapter.critical_concepts && chapter.critical_concepts.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
              Core Capabilities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {chapter.critical_concepts.slice(0, 3).map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300"
                >
                  {concept.concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {isCompleted ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          ) : (
            <span className="text-slate-500 text-[11px] font-mono">
              {chapter.interactive_questions?.length || 1} Mission Step
            </span>
          )}
        </div>

        <button
          onClick={() => onLaunch(chapter)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg cursor-pointer group/btn"
          style={{
            backgroundColor: theme.accentHex,
            boxShadow: `0 4px 14px rgba(${theme.spotlightRgb}, 0.3)`
          }}
        >
          <span>Launch Mission</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default RoadmapMilestoneCard;
