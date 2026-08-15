import React, { useState } from 'react';
import {
  AgenticRoleChapter,
  AgenticRoleDefinition
} from '../agenticRoleTypes';
import { agenticRolesRegistry } from '../agenticRolesRegistry';
import FallbackRoleActivity from '../activities/FallbackRoleActivity';
import DifficultyBadge from './components/DifficultyBadge';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Settings,
  Star,
  BookmarkPlus,
  Check
} from 'lucide-react';
import { getRoleTheme } from '../agenticThemeHelpers';
import { useFavorites } from '../../agentDevRootComponents/FavoritesContext';
import { useTheoryCollections } from '../../agentDevRootComponents/TheoryCollectionContext';
import { toast } from 'sonner';

interface AgenticRolesRunnerProps {
  chapter: AgenticRoleChapter;
  role: AgenticRoleDefinition;
  onBack: () => void;
  onCompleteChapter: (labComponentId: string) => void;
}

export const AgenticRolesRunner: React.FC<AgenticRolesRunnerProps> = ({
  chapter,
  role,
  onBack,
  onCompleteChapter
}) => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(`agentic_step_${chapter.labComponentId}`);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        return isNaN(parsed) ? 0 : parsed;
      }
    } catch (e) {
      // fallback
    }
    return 0;
  });
  const [theoryVisible, setTheoryVisible] = useState(true);
  const [layoutPlacement, setLayoutPlacement] = useState<'side' | 'bottom'>('side');
  const [isTheorySaved, setIsTheorySaved] = useState(false);

  // Sync step progress with sessionStorage
  React.useEffect(() => {
    try {
      sessionStorage.setItem(`agentic_step_${chapter.labComponentId}`, currentStep.toString());
    } catch (e) {
      // fallback
    }
  }, [chapter.labComponentId, currentStep]);

  const theme = getRoleTheme(chapter.roleDomain);

  // Contexts
  let favoritesCtx: ReturnType<typeof useFavorites> | null = null;
  let theoryCtx: ReturnType<typeof useTheoryCollections> | null = null;

  try {
    favoritesCtx = useFavorites();
  } catch (e) {
    // Context fallback
  }

  try {
    theoryCtx = useTheoryCollections();
  } catch (e) {
    // Context fallback
  }

  const isFavorite = favoritesCtx?.favorites.some((f) => f.id === chapter.labComponentId) || false;

  const handleToggleFavorite = () => {
    if (!favoritesCtx) return;
    if (isFavorite) {
      favoritesCtx.removeFavorite(chapter.labComponentId);
      toast.info("Removed from saved favorites");
    } else {
      favoritesCtx.addFavorite({
        id: chapter.labComponentId,
        type: 'devlush_lab',
        title: `${chapter.day_title} (${chapter.course})`,
        courseId: role.id
      });
      toast.success("Saved to career favorites!");
    }
  };

  const handleSaveTheory = () => {
    if (!theoryCtx) {
      toast.success("Theory concept saved to local study notes!");
      setIsTheorySaved(true);
      return;
    }

    try {
      theoryCtx.addTheoryToCollection('default', {
        labId: chapter.labComponentId,
        chapterTitle: chapter.day_title,
        exerciseTitle: chapter.day_title,
        courseType: 'devLush',
        theory: {
          title: chapter.theory_content?.title || chapter.day_title,
          content: chapter.theory_content?.content || '',
          application: chapter.theory_content?.practical_takeaway || ''
        }
      });
      setIsTheorySaved(true);
      toast.success("Theory concept added to your Study Notebook!");
    } catch (err) {
      toast.success("Theory saved to session notes!");
      setIsTheorySaved(true);
    }
  };

  // Lookup the dedicated activity component from registry
  const ActivityComponent = agenticRolesRegistry[chapter.labComponentId] || FallbackRoleActivity;

  const exercises = chapter.interactive_questions || [];
  const currentExercise = exercises[currentStep] || exercises[0];

  const handleStepComplete = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onCompleteChapter(chapter.labComponentId);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-950 text-slate-100 animate-in fade-in duration-300">
      {/* Top Mission Navigation Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Roadmap Hub</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <div className="flex items-center gap-2.5">
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold"
              style={{
                backgroundColor: `rgba(${theme.spotlightRgb}, 0.2)`,
                color: theme.accentHex
              }}
            >
              DAY 0{chapter.day}
            </span>
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-xs md:max-w-md">
              {chapter.day_title}
            </span>
            <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Step Progress Counter */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Step {currentStep + 1} of {Math.max(1, exercises.length)}</span>
          </div>

          {/* Theory Panel Toggle */}
          <button
            onClick={() => setTheoryVisible((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              theoryVisible
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Theory Bridge</span>
          </button>

          {/* Placement Toggle */}
          <button
            onClick={() => setLayoutPlacement((prev) => (prev === 'side' ? 'bottom' : 'side'))}
            className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer hidden lg:block"
            title={`Switch to ${layoutPlacement === 'side' ? 'Bottom' : 'Side'} Layout`}
          >
            <LayoutTemplate className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div
          className={`grid gap-6 ${
            theoryVisible && layoutPlacement === 'side'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* Interactive Simulation Sandbox (Left or Full) */}
          <div
            className={`space-y-6 ${
              theoryVisible && layoutPlacement === 'side' ? 'lg:col-span-8' : 'w-full'
            }`}
          >
            <ActivityComponent
              step={currentStep}
              exercises={exercises}
              infoVisible={theoryVisible}
              infoPlacement={layoutPlacement}
              onComplete={handleStepComplete}
            />
          </div>

          {/* Theory Bridge Panel (Right or Bottom) */}
          {theoryVisible && (
            <div
              className={`rounded-2xl bg-slate-900/90 backdrop-blur border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 ${
                layoutPlacement === 'side' ? 'lg:col-span-4 h-fit' : 'w-full'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {chapter.theory_content?.title || 'Architectural Theory & Invariants'}
                  </h3>
                </div>

                {/* Save Theory Button */}
                <button
                  onClick={handleSaveTheory}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isTheorySaved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                  title="Save Theory to Notebook"
                >
                  {isTheorySaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{isTheorySaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                {chapter.theory_content?.content}
              </div>

              {chapter.theory_content?.practical_takeaway && (
                <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Practical Enterprise Takeaway
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {chapter.theory_content.practical_takeaway}
                  </p>
                </div>
              )}

              {/* Critical Concepts List */}
              {chapter.critical_concepts && chapter.critical_concepts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                    Key Formal Concepts
                  </span>
                  <div className="space-y-2">
                    {chapter.critical_concepts.map((concept, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white block">{concept.concept}</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{concept.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgenticRolesRunner;
