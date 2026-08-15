import React, { useState } from 'react';
import {
  AgenticRoleDefinition,
  AgenticRoleChapter,
  Difficulty
} from '../agenticRoleTypes';
import RoadmapMilestoneCard from './components/RoadmapMilestoneCard';
import DifficultyBadge from './components/DifficultyBadge';
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  Award,
  Layers,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { getRoleTheme, getCareerLevelBadge } from '../agenticThemeHelpers';

interface AgenticRolesHubProps {
  role: AgenticRoleDefinition;
  onLaunchChapter: (chapter: AgenticRoleChapter) => void;
  selectedDifficulty: Difficulty | 'all';
  onSelectDifficulty: (difficulty: Difficulty | 'all') => void;
  completedChapterIds?: string[];
}

export const AgenticRolesHub: React.FC<AgenticRolesHubProps> = ({
  role,
  onLaunchChapter,
  selectedDifficulty,
  onSelectDifficulty,
  completedChapterIds = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const theme = getRoleTheme(role.roleDomain);
  const careerBadge = getCareerLevelBadge(role.careerLevel);

  // Filter chapters by difficulty and search query
  const filteredChapters = role.chapters.filter((ch) => {
    const matchesDifficulty = selectedDifficulty === 'all' || ch.difficulty === selectedDifficulty;
    const matchesQuery =
      searchQuery.trim() === '' ||
      ch.day_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.chapter_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.critical_concepts?.some((c) => (c.concept || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDifficulty && matchesQuery;
  });

  const totalEstimatedMinutes = role.chapters.reduce((acc, ch) => acc + (ch.estimatedMinutes || 25), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6 md:p-8 animate-in fade-in duration-300">
      {/* Hero Header Banner */}
      <div
        className="relative rounded-3xl bg-slate-900/90 backdrop-blur border p-8 md:p-10 shadow-2xl overflow-hidden"
        style={{
          borderColor: `rgba(${theme.spotlightRgb}, 0.3)`,
          boxShadow: `0 20px 50px rgba(${theme.spotlightRgb}, 0.1)`
        }}
      >
        {/* Ambient Gradient Mesh Background */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: theme.accentHex }}
        />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${careerBadge.badgeClass}`}>
              {careerBadge.label}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                backgroundColor: `rgba(${theme.spotlightRgb}, 0.15)`,
                color: theme.accentHex
              }}
            >
              {role.totalDays} Days Curriculum
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {role.title}
            </h1>
            <p className="text-base text-slate-300 font-medium leading-relaxed">
              {role.tagline}
            </p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            {role.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{role.chapters.length} Progressive Milestones</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>~{Math.round(totalEstimatedMinutes / 60)} Hours Total</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span>{completedChapterIds.length}/{role.chapters.length} Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestone skills or concepts..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => onSelectDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Milestone Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Roadmap Progression</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredChapters.length} {filteredChapters.length === 1 ? 'Milestone' : 'Milestones'}
            </span>
          </h2>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Compass className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No milestones match your search</h3>
            <p className="text-xs text-slate-400">Try clearing the search input or changing the difficulty filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <RoadmapMilestoneCard
                key={chapter.day}
                chapter={chapter}
                isCompleted={completedChapterIds.includes(chapter.labComponentId)}
                onLaunch={onLaunchChapter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenticRolesHub;
