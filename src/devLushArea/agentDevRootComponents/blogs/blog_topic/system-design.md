# System Design Agents: The AI Architect

System design agents analyze infrastructure, predict bottlenecks, and propose scalable cloud architectures.

## 1. Scalability Prediction
The agent ingests current traffic metrics and predicts when a database will hit its IOPS limit, autonomously proposing a sharding strategy.
- **Visual Component:** A server rack visual that begins to glow red as load increases, followed by the agent splitting the database into multiple green sharded instances.

### Architecture Proposal (JSON)
```json
{
  "agent_id": "architect_bot",
  "alert": "DATABASE_IOPS_WARNING",
  "prediction": "Failure in 48 hours",
  "proposal": {
    "action": "IMPLEMENT_SHARDING",
    "shard_key": "user_id",
    "estimated_cost_increase": "$120/mo"
  }
}
```

## 2. Auto-Remediation
When a microservice fails, the agent instantly spins up a fallback service and updates the API gateway routing rules.
- **Visual Component:** A node graph of microservices where a failing node drops out, and the agent instantly wires a connection to a backup node.
