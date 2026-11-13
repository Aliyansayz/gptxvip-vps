import React from 'react';
import { ArrowDown } from 'lucide-react';

interface KnowledgeCheckPromptCardProps {
  questionCount?: number;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onStart: () => void;
  className?: string;
}

/**
 * Editorial call-to-action card that explicitly gates the MCQ Knowledge Check
 * behind a button click rather than auto-transitioning on scroll or load.
 */
export const KnowledgeCheckPromptCard: React.FC<KnowledgeCheckPromptCardProps> = ({
  questionCount = 1,
  title = 'Check Your Knowledge',
  description,
  buttonLabel = 'Start Activity',
  onStart,
  className = '',
}) => {
  const defaultDesc = `Answer ${questionCount} quick ${questionCount === 1 ? 'question' : 'questions'} from this case.`;

  return (
    <section
      aria-label="Proceed to Knowledge Check"
      className={`rounded-3xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/90 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${className}`}
    >
      <div className="space-y-2">
        <h2 className="role-editorial-serif text-2xl font-bold text-stone-900 dark:text-white sm:text-4xl">
          {title}
        </h2>
        <p className="role-editorial-sans text-base text-stone-600 dark:text-stone-400 sm:text-lg">
          {description || defaultDesc}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="w-auto self-start sm:self-center shrink-0 px-7 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold text-base sm:text-lg transition shadow-sm inline-flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
      >
        <span>{buttonLabel}</span>
        <ArrowDown className="w-5 h-5" aria-hidden="true" />
      </button>
    </section>
  );
};

export default KnowledgeCheckPromptCard;
