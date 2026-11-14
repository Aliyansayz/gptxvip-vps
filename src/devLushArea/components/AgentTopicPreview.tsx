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
    ? 'border-white/15 bg-[#0e1326] text-white'
    : 'border-[#e9e9ec] bg-white text-[#101014]'
  const mutedTone = dark ? 'text-slate-300' : 'text-[#555560]'
  const stepTone = dark
    ? 'border-white/10 bg-white/5 text-slate-200'
    : 'border-[#e9e9ec] bg-[#f5f5f7] text-[#101014]'

  // Blue + electric yellow system matching /resources/usecases CaseStudyCard:
  // cobalt blue editorial headers & metrics paired with #d8ff38 interactive CTAs.
  const accentOnDark = warm ? 'text-[#d8ff38]' : 'text-cyan-300'
  const accentOnLight = warm ? 'text-[#343edb]' : 'text-cyan-700'
  const accentRing = warm ? 'focus-visible:ring-[#343edb]' : 'focus-visible:ring-cyan-500'
  const accentHover = warm ? 'hover:border-[#343edb] hover:shadow-[0_18px_38px_rgba(52,62,219,0.1)]' : 'hover:border-cyan-400'
  const accentText = dark ? accentOnDark : accentOnLight

  return (
    <a
      href={getAgentLabTopicHref(topic.slug)}
      className={`group flex h-full flex-col rounded-xl border p-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${accentHover} ${accentRing} focus-visible:ring-offset-2 motion-reduce:transform-none ${cardTone} ${compact ? 'p-4' : 'sm:p-5'}`}
      aria-label={`Open ${topic.chapterTitle} interactive lesson`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className={`min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? accentText : warm ? 'inline-flex items-center gap-1.5 rounded-full bg-[#343edb]/10 px-2.5 py-0.5 text-[#343edb]' : accentText}`}>
          Interactive lesson
        </span>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${dark ? 'bg-white/10 text-slate-200' : warm ? 'bg-[#d8ff38] text-[#101014]' : 'bg-slate-100 text-slate-600'}`}>
          {topic.family}
        </span>
      </div>
      <h3 className={`mt-3 font-medium tracking-[-0.025em] ${compact ? 'text-lg' : 'text-xl'} ${dark ? 'text-white' : 'text-[#101014] group-hover:text-[#343edb] transition-colors'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{topic.title}</h3>
      <p className={`mt-0.5 text-xs font-semibold ${mutedTone}`}>{topic.chapterTitle}</p>
      <p className={`mt-2 text-sm leading-5 max-w-[65ch] ${mutedTone}`}>{topic.outcome}</p>

      <div className="mt-3.5">
        <p className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-[#777780]'}`}>Concept flow</p>
        <div className="grid grid-cols-3 gap-1.5" aria-label={`Concept flow: ${topic.previewSteps.join(', ')}`}>
          {topic.previewSteps.map((step, index) => (
            <div key={step} className={`flex min-h-11 flex-col justify-center rounded-lg border px-2 py-1.5 text-center ${stepTone}`}>
              <span className={`text-[9px] font-bold ${warm ? (dark ? 'text-[#d8ff38]' : 'text-[#343edb]') : 'opacity-60'}`}>0{index + 1}</span>
              <span className="mt-0.5 text-[10px] font-semibold leading-3.5">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <span className={`mt-auto inline-flex min-h-[38px] items-center justify-between gap-2 border-t pt-3 mt-3.5 text-xs font-bold ${dark ? 'border-white/10 text-white' : 'border-[#e9e9ec] text-[#101014] group-hover:text-[#343edb]'}`}>
        <span>Open interactive lesson</span>
        <ArrowRight className={`h-6 w-6 rounded-full p-1 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ${warm ? 'bg-[#d8ff38] text-[#101014]' : 'text-current'}`} aria-hidden="true" />
      </span>
      <span className="sr-only"> The lesson opens at {topic.chapterTitle}.</span>
    </a>
  )
}

export default AgentTopicPreview
