import { ArrowRight } from 'lucide-react'
import type { AgentLabTopic } from '../agentLabsData'
import { getAgentLabTopicHref } from '../agentLabsData'

interface AgentTopicPreviewProps {
  topic: AgentLabTopic
  compact?: boolean
  /**
   * The ground this card sits on.
   *
   * Explicit rather than `dark:`-prefixed: the shell keeps `<html class="dark">`
   * on permanently, so a `dark:bg-*` variant fires even inside a light section
   * and renders a black card on the paper ground.
   */
  tone?: 'light' | 'dark'
  /**
   * `warm` matches the premium landing/catalog accent ramp.
   * Defaults to `cyan` for surfaces that keep the Agent Labs chrome palette.
   */
  accent?: 'cyan' | 'warm'
}

/** A shared preview card built from the same chapter metadata used by the Agent Labs runtime. */
export function AgentTopicPreview({ topic, compact = false, tone = 'light', accent = 'cyan' }: AgentTopicPreviewProps) {
  const warm = accent === 'warm'
  const dark = tone === 'dark'

  const cardTone = dark
    ? 'border-white/15 bg-ink text-white'
    : 'border-slate-200 bg-white text-slate-950'
  const mutedTone = dark ? 'text-slate-300' : 'text-slate-600'
  const stepTone = dark
    ? 'border-white/10 bg-white/5 text-slate-200'
    : 'border-slate-200 bg-slate-50 text-slate-700'

  // The dark variant sits on the glass hero panel, where the bright display
  // stops clear 3:1. The light variant needs the deep AA step.
  const accentOnDark = warm ? 'text-accent-400' : 'text-cyan-300'
  const accentOnLight = warm ? 'text-accent-700' : 'text-cyan-700'
  const accentRing = warm ? 'focus-visible:ring-accent-600' : 'focus-visible:ring-cyan-500'
  const accentHover = warm ? 'hover:border-accent-300' : 'hover:border-cyan-400'
  const accentText = dark ? accentOnDark : accentOnLight

  return (
    <a
      href={getAgentLabTopicHref(topic.slug)}
      className={`group flex h-full flex-col rounded-2xl border p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${accentHover} ${accentRing} focus-visible:ring-offset-2 motion-reduce:transform-none ${cardTone} ${compact ? 'p-4' : 'sm:p-6'}`}
      aria-label={`Open ${topic.chapterTitle} interactive lesson`}
    >
      <div className="flex items-center justify-between gap-3">
        {/*
          `min-w-0` + truncate on the label and `shrink-0` on the badge: without
          both, the uppercase tracked eyebrow wraps to two lines and collides
          with the family chip.
        */}
        <span className={`min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.18em] ${accentText}`}>Interactive lesson</span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${dark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
          {topic.family}
        </span>
      </div>
      {/*
        The heading carries an explicit ink. `index.css` applies `dark:text-zinc-100`
        to every `h1`-`h6` in the base layer, and an element-level utility beats an
        inherited color — so without this the title renders near-white on a light card.
      */}
      <h3 className={`mt-4 font-bold tracking-tight ${compact ? 'text-lg' : 'text-xl'} ${dark ? 'text-white' : 'text-slate-950'}`}>{topic.title}</h3>
      <p className={`mt-1 text-xs font-semibold ${mutedTone}`}>{topic.chapterTitle}</p>
      <p className={`mt-3 text-sm leading-6 ${mutedTone}`}>{topic.outcome}</p>

      <div className="mt-5">
        <p className={`mb-2 text-[9px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Concept flow</p>
        <div className="grid grid-cols-3 gap-2" aria-label={`Concept flow: ${topic.previewSteps.join(', ')}`}>
          {topic.previewSteps.map((step, index) => (
            <div key={step} className={`flex min-h-14 flex-col justify-center rounded-xl border px-2 py-2 text-center ${stepTone}`}>
              <span className="text-[9px] font-bold opacity-60">0{index + 1}</span>
              <span className="mt-1 text-[10px] font-semibold leading-4">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <span className={`mt-5 inline-flex items-center gap-2 pt-0 text-sm font-bold ${accentText}`}>
        Open interactive lesson
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
      </span>
      <span className="sr-only"> The lesson opens at {topic.chapterTitle}.</span>
    </a>
  )
}

export default AgentTopicPreview
