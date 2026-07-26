# Helpdesk Agents: Autonomous IT Support

Helpdesk agents transform IT support from reactive ticketing to proactive self-healing.

## 1. Sentiment-Aware Ticket Routing
The agent reads incoming tickets, detects user frustration via sentiment analysis, and routes angry VIP clients to human escalation immediately.
- **Visual Component:** A sorting conveyor belt visual. Tickets with high frustration scores glow red and are diverted to a priority lane.

### Routing Payload (JSON)
```json
{
  "agent_id": "support_router",
  "ticket_id": "T-9921",
  "user_tier": "ENTERPRISE",
  "sentiment": "EXTREMELY_ANGRY",
  "action": "ESCALATE_TO_HUMAN"
}
```

## 2. Self-Healing IT
When a user reports "WiFi is down," the agent autonomously SSHs into the local router, checks logs, and restarts the service without human intervention.
- **Visual Component:** A terminal window running diagnostic commands autonomously, concluding with a green "Service Restored" badge.
