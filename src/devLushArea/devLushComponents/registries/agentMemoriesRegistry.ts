import React, { lazy } from 'react';

export const agentMemoriesRegistry: Record<string, React.ComponentType<any>> = {
  'in-context-memory-activity': lazy(() => import('../devLushTopics/agentMemories/InContextMemoryActivity')),
  'semantic-memory-activity': lazy(() => import('../devLushTopics/agentMemories/SemanticMemoryActivity')),
  'episodic-memory-activity': lazy(() => import('../devLushTopics/agentMemories/EpisodicMemoryActivity')),
};
