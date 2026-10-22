import AgentLabsCatalog from '../../components/AgentLabsCatalog'
import { agentLabTopics } from '../../agentLabsData'

/**
 * The `/agents` catalog root.
 *
 * This used to be a separate marketing page with its own hero, its own topic
 * grid, and no filter. That second grid is the thing this replaced: the catalog
 * root now renders `AgentLabsCatalog` — the exact component the landing page
 * uses — so `/agents` and `/` present one catalog rather than two that drift.
 *
 * Project surfaces live at `/agents/templates` and are linked from the shared
 * navbar, so browsing them does not depend on this page.
 */
export default function Home() {
  return (
    <div className="premium-surface min-h-screen bg-paper text-ink selection:bg-accent-200 selection:text-ink">
      <AgentLabsCatalog
        accent="warm"
        eyebrow="Agent catalog"
        heading="Choose an agent to learn from."
        description="Six focused paths through the Agent and its Types curriculum. Each preview opens the matching interactive lesson."
        meta={`${agentLabTopics.length} agents · ${agentLabTopics.length} interactive lessons · 3 study groups`}
        headingId="agent-catalog-heading"
        className="pb-8 pt-10 sm:pb-12 sm:pt-14"
      />
    </div>
  )
}
