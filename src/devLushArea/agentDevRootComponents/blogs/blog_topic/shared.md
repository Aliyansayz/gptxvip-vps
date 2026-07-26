# Shared Agent Architecture: Universal Coordination

When multiple agents exist in an ecosystem, they require a shared architecture to communicate, exchange memory, and avoid redundant work.

## 1. The Global Memory Store
All agents read and write to a shared Redis or Vector DB layer, meaning an insight learned by the Support Agent is instantly available to the Sales Agent.
- **Visual Component:** A central glowing orb (the database) with data streams pulsing outwards to multiple diverse agent avatars.

### Shared State Payload (JSON)
```json
{
  "system": "shared_bus",
  "event": "customer_upset",
  "publisher": "support_agent",
  "subscribers": ["sales_agent", "retention_agent"],
  "payload": {
    "user_id": "u_91",
    "status": "CHURN_RISK"
  }
}
```

## 2. Universal Protocol standard
Agents communicate using a standardized JSON schema (like FIPA or custom formats), allowing disparate models (GPT-4, Claude, local models) to collaborate seamlessly.
- **Visual Component:** A protocol handshake animation between two distinctly different robot icons, exchanging a formatted puzzle piece.
