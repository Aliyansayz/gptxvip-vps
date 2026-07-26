# Gaming Agents (Bonus): Dynamic NPCs

Gaming agents use LLMs to create NPCs with memory, personality, and dynamic behavioral trees.

## 1. Dynamic Narrative Generation
Instead of a pre-written dialogue tree, the NPC agent dynamically generates dialogue based on the player's past actions (e.g., if the player stole an item, the NPC acts guarded).
- **Visual Component:** A dialogue tree that physically branches and grows new nodes in real-time as the player speaks to the NPC.

### NPC State (JSON)
```json
{
  "npc_name": "Eldrin_The_Merchant",
  "player_reputation": -45,
  "memories": ["Player stole a health potion on Day 2"],
  "current_emotion": "SUSPICIOUS",
  "generated_dialogue": "I'm keeping my eye on you. Keep your hands where I can see them."
}
```
