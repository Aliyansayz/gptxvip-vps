import React, { useMemo, useState } from 'react';
import { agentLabTopics } from '../agentLabsData';
import AgentTopicPreview from './AgentTopicPreview';
import { Reveal, RevealGroup, RevealItem } from '../../shared/components/Reveal';

/**
 * The Agent Labs topic catalog.
 *
 * This is the one implementation of the catalog that both the landing page and
 * `/agents` render. It used to be inline markup in `RootHomePage`, which meant
 * the catalog root silently drifted away from it — a second grid with no filter
 * and no entrance animation. Sharing the component is what stops that recurring.
 */

type Accent = 'cyan' | 'warm' | 'soc';

/**
 * Study groups, in the order they are taught.
 *
 * Six `family` values collapse into three groups a learner can hold in their
 * head. The grouping is a study progression, not the raw taxonomy, so it lives
 * here rather than in `agentLabsData`.
 */
const TOPIC_GROUP_ORDER = ['Foundations', 'Build and secure', 'Applied work'] as const;

const FAMILY_TO_GROUP: Record<string, (typeof TOPIC_GROUP_ORDER)[number]> = {
  Foundations: 'Foundations',
  Context: 'Build and secure',
  Action: 'Build and secure',
  Reliability: 'Applied work',
  Governance: 'Applied work',
  Orchestration: 'Applied work',
};

export interface AgentLabsCatalogProps {
  accent?: Accent;
  eyebrow?: string;
  heading?: string;
  description?: string;
  /** Count line beside the heading. Pass `null` to hide it. */
  meta?: React.ReactNode;
  className?: string;
  /** Heading id, so a caller can point `aria-labelledby` at this section. */
  headingId?: string;
}

export function AgentLabsCatalog({
  accent = 'warm',
  eyebrow = 'Agent Labs',
  heading = 'Explore agent topics.',
  description = 'Each preview opens the matching interactive lesson from the Agent and its Types curriculum.',
  meta,
  className = '',
  headingId = 'agent-labs-catalog-heading',
}: AgentLabsCatalogProps) {
  const [activeGroup, setActiveGroup] = useState<(typeof TOPIC_GROUP_ORDER)[number] | null>(null);

  const topics = useMemo(
    () => (activeGroup ? agentLabTopics.filter((topic) => FAMILY_TO_GROUP[topic.family] === activeGroup) : agentLabTopics),
    [activeGroup],
  );

  // Clicking the active group clears it. Without this the filter is a one-way
  // door, and the only way back to the full catalog is a page reload.
  const toggleGroup = (group: (typeof TOPIC_GROUP_ORDER)[number]) =>
    setActiveGroup((current) => (current === group ? null : group));

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    agentLabTopics.forEach((topic) => {
      const group = FAMILY_TO_GROUP[topic.family];
      map.set(group, (map.get(group) ?? 0) + 1);
    });
    return map;
  }, []);

  const warm = accent === 'warm';
  const soc = accent === 'soc';

  return (
    <section className={`border-b ${soc ? 'border-slate-200 bg-[#F8FAFC]' : 'border-[#e9e9ec] bg-[#f8f9fc]'} py-10 sm:py-12 ${className}`} aria-labelledby={headingId}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div className="max-w-xl">
              <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] ${soc ? 'bg-[#CCFBF1] text-[#0F766E]' : warm ? 'bg-[#343edb]/10 text-[#343edb]' : 'bg-cyan-50 text-cyan-700'}`}>
                05 / {eyebrow.toUpperCase()}
              </span>
              <h2
                id={headingId}
                className={`text-2xl sm:text-4xl font-medium tracking-[-0.04em] ${soc ? 'text-[#0F172A]' : 'text-[#101014]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {heading}
              </h2>
              <p className={`mt-2 text-sm leading-relaxed sm:text-base ${soc ? 'text-slate-600' : 'text-[#555560]'}`}>{description}</p>
              {meta && <div className="mt-1.5 text-xs text-[#777780]">{meta}</div>}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter topics by study group">
              {TOPIC_GROUP_ORDER.map((group) => {
                const selected = activeGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleGroup(group)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold transition-[color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 ${soc ? 'focus-visible:ring-[#0D9488]' : warm ? 'focus-visible:ring-[#343edb]' : 'focus-visible:ring-cyan-500'} focus-visible:ring-offset-2 active:scale-[0.96] motion-reduce:transform-none ${
                      selected
                        ? soc
                          ? 'border-transparent bg-gradient-to-r from-[#0D9488] to-[#0284C7] text-white font-bold shadow-xs'
                          : warm
                            ? 'border-[#343edb] bg-[#343edb] text-white font-bold shadow-xs'
                            : 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold'
                        : soc
                          ? 'border-slate-200 bg-white text-slate-600 hover:border-[#0D9488] hover:text-[#0F172A]'
                          : 'border-[#e9e9ec] bg-white text-[#555560] hover:border-[#343edb] hover:text-[#101014]'
                    }`}
                  >
                    {group}
                    <span className={`font-mono text-[10px] tabular-nums ${selected ? (soc ? 'text-[#CCFBF1]' : warm ? 'text-[#d8ff38]' : 'text-cyan-800') : 'text-[#777780]'}`}>
                      {counts.get(group) ?? 0}
                    </span>
                  </button>
                );
              })}
              {activeGroup && (
                <button
                  type="button"
                  onClick={() => setActiveGroup(null)}
                  className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-bold underline decoration-2 underline-offset-4 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${soc ? 'text-[#0D9488] decoration-[#2DD4BF] hover:text-[#0284C7] focus-visible:ring-[#0D9488]' : 'text-[#343edb] decoration-[#d8ff38] hover:text-[#2534bf] focus-visible:ring-[#343edb]'}`}
                >
                  Show all {agentLabTopics.length}
                </button>
              )}
            </div>
          </Reveal>
        </div>

        {/*
          Re-keyed on the filter so switching groups replays the cascade instead
          of leaving the new cards at opacity 0, from a `once: true` observer that
          already fired on the previous set.
        */}
        <RevealGroup key={activeGroup || 'all'} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {topics.map((topic, index) => (
            <RevealItem key={topic.slug} index={index} className="h-full">
              <AgentTopicPreview topic={topic} compact accent={accent} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p role="status" aria-live="polite" className="sr-only">
          {activeGroup ? `Showing ${topics.length} of ${agentLabTopics.length} topics in ${activeGroup}.` : `Showing all ${agentLabTopics.length} topics.`}
        </p>
      </div>
    </section>
  );
}

export default AgentLabsCatalog;
