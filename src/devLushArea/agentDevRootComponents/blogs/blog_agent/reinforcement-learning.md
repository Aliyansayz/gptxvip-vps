# Reinforcement Learning Agents: Mastering Environments

RL agents learn through trial and error, optimizing their policies based on reward signals.

## 1. Reward Shaping
An agent navigating a complex environment requires a carefully shaped reward function to avoid getting stuck in local optima.
- **Visual Component:** A grid-world simulation where the agent leaves a trail of green "+1" or red "-1" popups as it interacts with the environment.

### RL State Payload (JSON)
```json
{
  "agent_id": "rl_explorer",
  "episode": 420,
  "state_vector": [0.5, 1.2, -0.4],
  "action_taken": "MOVE_UP",
  "reward_received": 15.0,
  "q_value_update": 14.8
}
```

## 2. Policy Gradients
Instead of mapping states to values, a policy gradient agent learns a probability distribution over actions, allowing for smooth, continuous control.
- **Visual Component:** A probability distribution curve that physically shifts and sharpens as the agent becomes more confident in its optimal action.
