import React from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Layers,
  ListOrdered,
  Lock,
  MousePointer2,
  Play,
  ScrollText,
  Target,
  Workflow,
} from "lucide-react";
import { InteractiveQuestion } from "../../../types";
import { FavoriteButton } from "../addtoFavorites/FavoriteButton";

interface CoreConceptCardProps {
  concept: InteractiveQuestion;
  onStart: () => void;
  isLocked?: boolean;
  courseId?: string;
  lessonNumber?: number;
  isCompleted?: boolean;
  isNext?: boolean;
}

const getTypeDetails = (type: string) => {
  switch (type) {
    case "mcq": return { label: "Quick check", icon: ListOrdered };
    case "drag_and_drop": return { label: "Build & match", icon: MousePointer2 };
    case "code_completion": return { label: "Code practice", icon: Code2 };
    case "overview": return { label: "Lesson notes", icon: BookOpen };
    case "custom": return { label: "Interactive lab", icon: Layers };
    case "hft_journey_explainer": return { label: "Guided journey", icon: ScrollText };
    default: return { label: "Interactive lesson", icon: Workflow };
  }
};

export const CoreConceptCard: React.FC<CoreConceptCardProps> = ({
  concept,
  onStart,
  isLocked = false,
  courseId,
  lessonNumber,
  isCompleted = false,
  isNext = false,
}) => {
  const isOverview = concept.type === "overview";
  const typeDetails = getTypeDetails(concept.type);
  const TypeIcon = typeDetails.icon;

  return (
    <article className={`group relative rounded-2xl border bg-white p-4 shadow-sm transition-all dark:bg-zinc-900 sm:p-5 ${
      isNext
        ? "border-emerald-300 shadow-emerald-900/5 dark:border-emerald-800"
        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
    } ${isLocked ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          isCompleted
            ? "bg-emerald-500 text-white"
            : isOverview
              ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        }`}>
          {isCompleted ? <Check className="h-5 w-5" /> : <TypeIcon className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-zinc-400">
            {lessonNumber ? <span>Lesson {String(lessonNumber).padStart(2, "0")}</span> : null}
            <span>{typeDetails.label}</span>
            {concept.difficulty ? <span className="text-emerald-600 dark:text-emerald-400">{concept.difficulty}</span> : null}
          </div>
          <h4 className="text-base font-extrabold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
            {concept.title || "Interactive Challenge"}
          </h4>
          {courseId ? <span className="sr-only"> in {courseId}</span> : null}
        </div>
        {!isOverview && <FavoriteButton concept={concept} />}
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400 sm:text-sm">
        {concept.question || concept.prompt || concept.concept_tested || "Explore this topic with a short interactive lesson."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
          <Target className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{concept.concept_tested || "Core programming skill"}</span>
        </div>
        <button
          type="button"
          disabled={isLocked}
          onClick={onStart}
          className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-extrabold transition active:scale-[0.98] disabled:cursor-not-allowed ${
            isLocked
              ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              : isCompleted
                ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                : isNext
                  ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          }`}
        >
          {isLocked ? <Lock className="h-3.5 w-3.5" /> : isCompleted ? <ArrowRight className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          <span>{isLocked ? "Locked" : isCompleted ? "Review" : isOverview ? "Open lesson" : isNext ? "Start lesson" : "Start"}</span>
        </button>
      </div>
    </article>
  );
};
