export interface AgentLabTopic {
  slug: string
  title: string
  family: string
  outcome: string
  courseId: string
  chapterId: string
  chapterTitle: string
  previewSteps: [string, string, string]
}

/** Shared Agent Labs topics mapped directly to chapters in the interactive curriculum. */
export const agentLabTopics: AgentLabTopic[] = [
  { slug: 'agent-architectures', title: 'Agent architectures', family: 'Foundations', outcome: 'Follow the ReAct loop as an agent reasons, acts, and observes results.', courseId: 'agent-and-its-types', chapterId: 'agent-react-pattern', chapterTitle: 'ReAct Pattern', previewSteps: ['Reason', 'Act', 'Observe'] },
  { slug: 'memory-systems', title: 'Memory systems', family: 'Context', outcome: 'Explore how retrieval and stored context support an agent response.', courseId: 'agent-and-its-types', chapterId: 'agent-memory-architectures', chapterTitle: 'Memory Systems (RAG)', previewSteps: ['Retrieve', 'Ground', 'Respond'] },
  { slug: 'tool-execution', title: 'Tool execution', family: 'Action', outcome: 'Trace how an agent connects a decision to an external action.', courseId: 'agent-and-its-types', chapterId: 'agent-execution-layer', chapterTitle: 'The Execution & Action Layer', previewSteps: ['Choose', 'Execute', 'Verify'] },
  { slug: 'evaluation-loops', title: 'Evaluation loops', family: 'Reliability', outcome: 'Inspect how evaluation feedback drives another refinement pass.', courseId: 'agent-and-its-types', chapterId: 'agent-evaluator-optimizer', chapterTitle: 'Evaluator-Optimizer', previewSteps: ['Draft', 'Evaluate', 'Refine'] },
  { slug: 'safety-boundaries', title: 'Safety boundaries', family: 'Governance', outcome: 'See where human approval gates a high-impact agent action.', courseId: 'agent-and-its-types', chapterId: 'agent-human-in-the-loop', chapterTitle: 'Human-in-the-Loop (HITL)', previewSteps: ['Review', 'Approve', 'Execute'] },
  { slug: 'multi-agent-coordination', title: 'Multi-agent coordination', family: 'Orchestration', outcome: 'Follow an orchestrator as it delegates work and resolves results.', courseId: 'agent-and-its-types', chapterId: 'agent-types-orchestrator', chapterTitle: 'Orchestrator → Workers', previewSteps: ['Delegate', 'Collect', 'Resolve'] },
]

export const getAgentLabTopic = (slug?: string | null): AgentLabTopic | undefined =>
  agentLabTopics.find((topic) => topic.slug === slug)

export const getAgentLabTopicHref = (slug: string): string => `/agents/lab/${encodeURIComponent(slug)}`
