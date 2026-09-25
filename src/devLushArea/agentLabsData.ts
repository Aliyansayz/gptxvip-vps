export interface AgentLabTopic {
  slug: string
  title: string
  family: string
  outcome: string
  query: string
}

/** Shared topic vocabulary for the root shell, catalog, and runtime landing. */
export const agentLabTopics: AgentLabTopic[] = [
  { slug: 'agent-architectures', title: 'Agent architectures', family: 'Foundations', outcome: 'Compare ReAct, sequential, and orchestrator-worker patterns.', query: 'architecture orchestration' },
  { slug: 'memory-systems', title: 'Memory systems', family: 'Context', outcome: 'See how semantic and episodic memory change the next action.', query: 'memory context' },
  { slug: 'tool-execution', title: 'Tool execution', family: 'Action', outcome: 'Trace how an agent chooses, calls, and verifies a tool.', query: 'tools execution' },
  { slug: 'evaluation-loops', title: 'Evaluation loops', family: 'Reliability', outcome: 'Inspect feedback, scoring, and evaluator-optimizer patterns.', query: 'evaluation reliability' },
  { slug: 'safety-boundaries', title: 'Safety boundaries', family: 'Governance', outcome: 'Make permissions, failure states, and human review visible.', query: 'safety governance' },
  { slug: 'multi-agent-coordination', title: 'Multi-agent coordination', family: 'Orchestration', outcome: 'Map delegation, shared context, and handoff responsibilities.', query: 'multi-agent orchestration' },
]
