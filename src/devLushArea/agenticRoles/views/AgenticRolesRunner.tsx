import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Columns,
  Rows,
  Sparkles,
} from 'lucide-react';
import { AgenticRoleChapter, AgenticRoleDefinition } from '../agenticRoleTypes';
import { agenticRolesRegistry } from '../agenticRolesRegistry';
import FallbackRoleActivity from '../activities/FallbackRoleActivity';
import RoleConceptVisual from './components/RoleConceptVisual';
import DifficultyBadge from './components/DifficultyBadge';
import { getRoleTheme } from '../agenticThemeHelpers';
import { useTheoryCollections } from '../../agentDevRootComponents/TheoryCollectionContext';
import FavoriteButton from '../../agentDevRootComponents/FavoriteButton';
import { toast } from 'sonner';
import { ArticleLabLayout, QuizBank, chapterToArticleBlocks } from '../../../shared/components/article-lab';

export type RunnerMode = 'lab' | 'read';

interface AgenticRolesRunnerProps {
  chapter: AgenticRoleChapter;
  role: AgenticRoleDefinition;
  onBack: () => void;
  onCompleteChapter: (labComponentId: string) => void;
  mode?: RunnerMode;
}

export const AgenticRolesRunner: React.FC<AgenticRolesRunnerProps> = ({
  chapter,
  role,
  onBack,
  onCompleteChapter,
  mode = 'lab',
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`agentic_step_${chapter.labComponentId}`);
      const parsed = saved === null ? 0 : Number.parseInt(saved, 10);
      return Number.isFinite(parsed)
        ? Math.min(Math.max(0, parsed), Math.max(0, chapter.interactive_questions.length - 1))
        : 0;
    } catch {
      return 0;
    }
  });
  const [theoryVisible, setTheoryVisible] = useState(true);
  const [layoutPlacement, setLayoutPlacement] = useState<'side' | 'bottom'>('bottom');
  const [isTheorySaved, setIsTheorySaved] = useState(false);
  const [isCaseComplete, setIsCaseComplete] = useState(false);
  const theoryCtx = useTheoryCollections();
  const theme = getRoleTheme(chapter.roleDomain);
  const exercises = chapter.interactive_questions || [];
  const totalSteps = Math.max(1, exercises.length);
  const currentExercise = exercises[currentStep] || exercises[0];
  const ActivityComponent = agenticRolesRegistry[chapter.labComponentId] || FallbackRoleActivity;

  // Article blocks for read mode
  const articleBlocks = chapterToArticleBlocks(chapter);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`agentic_step_${chapter.labComponentId}`);
      const parsed = saved === null ? 0 : Number.parseInt(saved, 10);
      setCurrentStep(Number.isFinite(parsed) ? Math.min(Math.max(0, parsed), Math.max(0, chapter.interactive_questions.length - 1)) : 0);
    } catch {
      setCurrentStep(0);
    }
    setIsCaseComplete(false);
    setIsTheorySaved(false);
  }, [chapter.labComponentId]);

  useEffect(() => {
    titleRef.current?.focus();
  }, [chapter.labComponentId]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`agentic_step_${chapter.labComponentId}`, currentStep.toString());
    } catch {
      // The current lesson stays usable if session storage is unavailable.
    }
  }, [chapter.labComponentId, currentStep]);

  const handleStepComplete = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    if (!isCaseComplete) {
      setIsCaseComplete(true);
      onCompleteChapter(chapter.labComponentId);
    }
  };

  const handleSaveTheory = () => {
    try {
      theoryCtx.addTheoryToCollection('default', {
        labId: chapter.labComponentId,
        chapterTitle: chapter.day_title,
        exerciseTitle: chapter.day_title,
        courseType: 'agenticRoles',
        theory: {
          title: chapter.theory_content?.title || chapter.day_title,
          content: chapter.theory_content?.content || '',
          application: chapter.theory_content?.practical_takeaway || '',
        },
      });
      setIsTheorySaved(true);
      toast.success('Case theory saved to your Study Notebook.');
    } catch {
      toast.error('Theory could not be saved right now.');
    }
  };

  // Read mode: render article + quiz
  if (mode === 'read') {
    return (
      <ArticleLabLayout
        blocks={articleBlocks}
        roleDomain={chapter.roleDomain}
        roleShortTitle={role.shortTitle}
        chapterTitle={chapter.chapter_title}
        chapterDay={chapter.day}
        theme={theme}
        onBack={onBack}
        onSaveTheory={handleSaveTheory}
        isTheorySaved={isTheorySaved}
      >
        <QuizBank
          exercises={exercises}
          onComplete={() => onCompleteChapter(chapter.labComponentId)}
        />
      </ArticleLabLayout>
    );
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100">
      <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Agentic Role cases"
              className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cases</span>
            </button>
            <div className="min-w-0">
              <p className={`mb-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider sm:text-xs ${theme.text}`}>
                <Sparkles className="h-3.5 w-3.5" /> {role.shortTitle} · case {String(chapter.day).padStart(2, '0')}
              </p>
              <h1 ref={titleRef} tabIndex={-1} className="break-words font-heading text-lg font-bold leading-tight text-slate-900 focus:outline-none dark:text-white sm:text-3xl">
                {chapter.chapter_title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:justify-end">
            <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
            <FavoriteButton
              id={chapter.labComponentId}
              type="agentic_role_lab"
              title={`${chapter.day_title} (${chapter.course})`}
              courseId={role.id}
              menuAlign="right"
            />
            <div
              role="progressbar"
              aria-label="Case progress"
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-valuenow={isCaseComplete ? totalSteps : currentStep}
              aria-valuetext={isCaseComplete ? "Case complete" : `Decision ${currentStep + 1} of ${totalSteps}`}
              className="hidden min-h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:flex"
            >
              Decision <span className={`mx-1 ${theme.text}`}>{Math.min(currentStep + 1, totalSteps)}</span> / {totalSteps}
            </div>
            <button
              type="button"
              onClick={() => setTheoryVisible((visible) => !visible)}
              aria-expanded={theoryVisible}
              aria-controls={theoryVisible ? 'agentic-role-theory' : undefined}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${theoryVisible ? `${theme.bgSoft} ${theme.text} ${theme.borderSoft}` : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              <BookOpen className="h-4 w-4" /> Theory
            </button>
            {theoryVisible && (
              <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 lg:flex">
                <button
                  type="button"
                  onClick={() => setLayoutPlacement('side')}
                  aria-label="Show theory beside the case"
                  aria-pressed={layoutPlacement === 'side'}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${layoutPlacement === 'side' ? `${theme.bgSoft} ${theme.text}` : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Columns className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutPlacement('bottom')}
                  aria-label="Show theory below the case"
                  aria-pressed={layoutPlacement === 'bottom'}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${layoutPlacement === 'bottom' ? `${theme.bgSoft} ${theme.text}` : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Rows className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <main className="mx-auto w-full max-w-[1440px] p-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-5 sm:pb-8 lg:p-7">
          <section aria-label="Case briefing" className={`mb-4 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900 sm:mb-5 sm:p-5 ${theme.borderSoft}`}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className={`text-xs font-semibold uppercase tracking-wider ${theme.text}`}>The scenario</p>

            </div>
            <p className="max-w-5xl text-sm leading-6 text-slate-700 dark:text-slate-200 sm:text-base sm:leading-7">
              {currentExercise?.prompt || chapter.theory_content?.practical_takeaway || 'Review the case evidence, make a role-specific decision, and examine the outcome.'}
            </p>
            {currentExercise?.expectedToolCalls?.[0] && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Agent action: <span className="font-semibold text-slate-700 dark:text-slate-200">{currentExercise.expectedToolCalls[0].purpose}</span>
              </p>
            )}
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${theme.gradientFrom} ${theme.gradientTo}`} style={{ width: `${((isCaseComplete ? totalSteps : currentStep) / totalSteps) * 100}%` }} />
            </div>
          </section>

          {isCaseComplete && (
            <section role="status" className="mb-4 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Case complete</h2>
                  <p className="mt-1 text-sm leading-7 text-emerald-800 dark:text-emerald-300">Your decision has been added to progress for {role.shortTitle}.</p>
                </div>
              </div>
              <button type="button" onClick={onBack} className="min-h-11 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                Return to cases
              </button>
            </section>
          )}

          <div className={`grid min-w-0 gap-4 sm:gap-5 ${theoryVisible && layoutPlacement === 'side' ? 'grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_20rem]' : 'grid-cols-1'}`}>
            <section aria-label="Interactive case simulation" className="min-w-0">
              <ActivityComponent
                key={`${chapter.labComponentId}:${currentStep}`}
                step={currentStep}
                exercises={exercises}
                infoVisible={theoryVisible}
                infoPlacement={layoutPlacement}
                onComplete={handleStepComplete}
              />
            </section>

            {theoryVisible && (
              <aside id="agentic-role-theory" aria-label="Case theory" className="h-fit min-w-0 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.bgSoft} ${theme.text}`}>
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theory notes</p>
                      <h2 className="mt-1 break-words text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                        {chapter.theory_content?.title || 'Role framework'}
                      </h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveTheory}
                    aria-pressed={isTheorySaved}
                    className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isTheorySaved ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                  >
                    {isTheorySaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                    {isTheorySaved ? 'Saved' : 'Save'}
                  </button>
                </div>

                <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-300">
                  {chapter.theory_content?.content || 'Theory notes for this role case will appear here.'}
                </p>

                <RoleConceptVisual key={chapter.labComponentId} chapter={chapter} />

                {chapter.theory_content?.practical_takeaway && (
                  <div className={`rounded-xl border p-3 ${theme.bgSoft} ${theme.borderSoft}`}>
                    <p className={`mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider ${theme.text}`}>
                      <Sparkles className="h-3 w-3" /> Practical takeaway
                    </p>
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{chapter.theory_content.practical_takeaway}</p>
                  </div>
                )}

                {chapter.theory_content?.analogy && (
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mental model</p>
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{chapter.theory_content.analogy}</p>
                  </div>
                )}

                {chapter.critical_concepts.length > 0 && (
                  <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key concepts</h3>
                    {chapter.critical_concepts.map((concept) => (
                      <div key={concept.concept} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white">{concept.concept}</h4>
                        {concept.definition && <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-400">{concept.definition}</p>}
                      {concept.elaboration && <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{concept.elaboration}</p>}
                        {concept.industry_application && <p className="mt-3 border-l-2 border-indigo-300 pl-3 text-sm leading-7 text-slate-700 dark:text-slate-300"><span className="font-semibold">In practice: </span>{concept.industry_application}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgenticRolesRunner;
