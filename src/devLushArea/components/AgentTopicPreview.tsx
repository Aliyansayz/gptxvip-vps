import { ArrowRight } from 'lucide-react'
import type { AgentLabTopic } from '../agentLabsData'
import { getAgentLabTopicHref } from '../agentLabsData'

interface AgentTopicPreviewProps {
  topic: AgentLabTopic
  compact?: boolean
  dark?: boolean
}

/** A shared preview card built from the same chapter metadata used by the Agent Labs runtime. */
export function AgentTopicPreview({ topic, compact = false, dark = false }: AgentTopicPreviewProps) {
  const cardTone = dark
    ? 'border-white/15 bg-slate-900 text-white'
    : 'border-slate-200 bg-white text-slate-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
  const mutedTone = dark ? 'text-slate-300' : 'text-slate-600 dark:text-zinc-400'
  const stepTone = dark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'

  return (
    <a
      href={getAgentLabTopicHref(topic.slug)}
      className={`group block rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${cardTone} ${compact ? 'p-4' : 'sm:p-6'}`}
      aria-label={`Open ${topic.chapterTitle} interactive lesson`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-cyan-300' : 'text-cyan-700 dark:text-cyan-300'}`}>Agent Labs interactive lesson</span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${dark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-zinc-300'}`}>{topic.family}</span>
      </div>
      <h3 className={`mt-4 font-bold tracking-tight ${compact ? 'text-lg' : 'text-xl'}`}>{topic.title}</h3>
      <p className={`mt-1 text-xs font-semibold ${mutedTone}`}>{topic.chapterTitle}</p>
      <p className={`mt-3 text-sm leading-6 ${mutedTone}`}>{topic.outcome}</p>

      <div className="mt-5">
        <p className={`mb-2 text-[9px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-slate-500 dark:text-zinc-500'}`}>Concept flow</p>
        <div className="grid grid-cols-3 gap-2" aria-label={`Concept flow: ${topic.previewSteps.join(', ')}`}>
        {topic.previewSteps.map((step, index) => {
          return (
            <div key={step} className={`flex min-h-14 flex-col justify-center rounded-xl border px-2 py-2 text-center ${stepTone}`}>
              <span className="text-[9px] font-bold opacity-60">0{index + 1}</span>
              <span className="mt-1 text-[10px] font-semibold leading-4">{step}</span>
            </div>
          )
        })}
        </div>
      </div>

      <span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${dark ? 'text-cyan-300' : 'text-cyan-700 dark:text-cyan-300'}`}>
        Open interactive lesson <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
      <span className="sr-only"> The lesson opens at {topic.chapterTitle}.</span>
    </a>
  )
}

export default AgentTopicPreview
