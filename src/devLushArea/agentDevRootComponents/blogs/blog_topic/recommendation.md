# Recommendation Agents: Hyper-Personalization

Recommendation agents use contextual bandits and collaborative filtering to predict user desires before the user even clicks.

## 1. Contextual Bandits for Content
Unlike static algorithms, a contextual bandit agent constantly explores new content while exploiting known user preferences, adapting instantly to a user's changing mood.
- **Visual Component:** A slot-machine style visual showing the agent testing a random "exploration" recommendation alongside safe "exploitation" recommendations.

### Recommendation Payload (JSON)
```json
{
  "agent_id": "recsys_bandit",
  "user_id": "u_8471",
  "context": "late_night_mobile",
  "selected_action": "serve_short_form_comedy",
  "exploration_probability": 0.15
}
```

## 2. Collaborative Filtering via Embeddings
The agent maps users and products into the same vector space, recommending items that are mathematically closest to the user's vector.
- **Visual Component:** A 3D scatter plot visual where user avatars and product icons cluster together dynamically.
