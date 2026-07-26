# Smart Home Agents (Bonus): Predictive IoT Orchestration

Smart home agents move beyond "turn on the lights" to orchestrating predictive energy management and ambient intelligence.

## 1. Predictive Energy Management
The agent analyzes weather forecasts, solar panel output, and family schedules to pre-heat the house when energy is cheapest.
- **Visual Component:** A house cross-section showing heat maps shifting dynamically as the agent reroutes solar power to the HVAC system based on a storm forecast.

### IoT Payload (JSON)
```json
{
  "agent_id": "home_orchestrator",
  "sensor_data": {
    "grid_price": "LOW",
    "solar_output": "HIGH",
    "forecast": "SNOW_IN_2_HOURS"
  },
  "action": "PREHEAT_LIVING_ROOM",
  "target_temp": 72.0
}
```
