# Education Agents (Bonus): Personalized Tutoring

Education agents adapt their curriculum based on the student's learning pace and knowledge gaps.

## 1. Curriculum Adaptation
If a student struggles with fractions, the agent detects the knowledge gap and dynamically generates a visual mini-game to reinforce the concept before moving on.
- **Visual Component:** A skill-tree visual where a node turns red (struggling), prompting the agent to spawn three smaller sub-nodes (remedial exercises) to bridge the gap.

### Tutor State (JSON)
```json
{
  "student_id": "std_104",
  "topic": "Algebraic Equations",
  "concept_mastery": {
    "variables": 0.9,
    "fractions": 0.3
  },
  "action": "GENERATE_REMEDIAL_FRACTION_MODULE"
}
```
