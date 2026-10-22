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

type Accent = 'cyan' | 'warm';

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

  return (
    <section className={`mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 ${className}`} aria-labelledby={headingId}>
      <Reveal>
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">{eyebrow}</p>
          <h2 id={headingId} className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">
            {heading}
          </h2>
          <p className="mt-4 text-slate-600">{description}</p>
          {meta && <div className="mt-4 text-sm text-slate-500">{meta}</div>}
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter topics by study group">
          {TOPIC_GROUP_ORDER.map((group) => {
            const selected = activeGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => toggleGroup(group)}
                aria-pressed={selected}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-[color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 active:scale-[0.96] motion-reduce:transform-none ${
                  selected
                    ? 'border-accent-600 bg-accent-600/10 text-accent-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {group}
                <span className={`font-mono text-[10px] tabular-nums ${selected ? 'text-accent-600' : 'text-slate-400'}`}>
                  {counts.get(group) ?? 0}
                </span>
              </button>
            );
          })}
          {activeGroup && (
            <button
              type="button"
              onClick={() => setActiveGroup(null)}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-xs font-semibold text-slate-500 underline decoration-ink/20 underline-offset-4 transition-colors duration-150 hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
            >
              Show all {agentLabTopics.length}
            </button>
          )}
        </div>
      </Reveal>

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
    </section>
  );
}

export default AgentLabsCatalog;
