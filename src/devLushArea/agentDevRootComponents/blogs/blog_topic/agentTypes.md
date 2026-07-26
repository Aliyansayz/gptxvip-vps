# Exploring Agent Types: From Orchestrators to Specialists

Complex tasks require a specialized division of labor. Multi-agent systems leverage different morphologies to maximize efficiency.

## 1. The Orchestrator and Specialists
An Orchestrator agent breaks down a user prompt into sub-tasks and delegates them to specialized workers (e.g., a Database Expert, a Frontend Developer).
- **Visual Component:** A hierarchical tree graph. The Orchestrator node lights up first, passing animated data packets to child nodes representing the specialists.

### Task Delegation Payload (JSON)
```json
{
  "orchestrator_id": "master_node",
  "task": "Build a React Login Page",
  "delegations": [
    {
      "specialist": "UI_Designer_Agent",
      "sub_task": "Generate Tailwind CSS layout"
    },
    {
      "specialist": "Backend_Agent",
      "sub_task": "Write Node.js authentication middleware"
    }
  ]
}
```

## 2. Parallel Fan-Out Execution
For data processing, a coordinator fans out instructions to multiple identical agents working in parallel, aggregating their results upon completion.
- **Visual Component:** A scatter diagram where one node duplicates into ten, processes data, and collapses back into a single output node.
