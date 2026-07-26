# Healthcare Agents: AI in Diagnostics

Healthcare agents act as powerful copilots for medical professionals, handling data routing and preliminary analysis securely.

## 1. Patient Triage & Data Routing
An agent processes intake forms, using NLP to categorize urgency and route the patient to the correct specialist queue while redacting PII to maintain HIPAA compliance.
- **Visual Component:** A flowchart showing raw text entering a "Redaction Node", turning sensitive words into asterisks, then routing to a specific doctor's queue.

### Triage Payload (JSON)
```json
{
  "agent_id": "triage_copilot",
  "patient_id": "REDACTED_UUID",
  "symptoms": ["chest pain", "shortness of breath"],
  "urgency_level": "CRITICAL",
  "routing_destination": "CARDIOLOGY_ER"
}
```

## 2. Diagnostic Copilot
The agent cross-references patient symptoms with vast medical databases to suggest potential diagnoses for the physician's review.
- **Visual Component:** A split-screen showing a medical scan on one side and an agent-generated bounding box highlighting anomalies on the other.
