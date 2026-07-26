# Agent Memories: Building Context-Aware Systems

For agents to perform long-term tasks effectively, they need sophisticated memory architectures that go beyond simple chat history.

## 1. Episodic vs. Semantic Memory
An agent maintains a short-term episodic memory for ongoing tasks (the "scratchpad") and a semantic vector database for long-term knowledge retrieval.
- **Visual Component:** A split-pane visual showing the active context window filling up, while older context gets distilled and "archived" into a vector space representation.

### Memory Vector Payload (JSON)
```json
{
  "memory_id": "mem_994x",
  "type": "semantic",
  "content": "User prefers concise Python code without comments.",
  "embedding": [0.012, -0.42, 0.88, ...],
  "metadata": {
    "source_conversation": "conv_821",
    "importance_score": 0.85
  }
}
```

## 2. Context Window Management
When the token limit approaches, the agent summarizes older conversations automatically, injecting the compressed context into the system prompt.
- **Visual Component:** A sliding window animation indicating token eviction and summary injection.

### State Payload (JSON)
```json
{
  "agent_id": "memory_manager",
  "current_tokens": 128000,
  "action": "compress_context",
  "summarization_output": "User discussed architecture for scalable WebSocket server in Go."
}
```
