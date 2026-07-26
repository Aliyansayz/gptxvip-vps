# Legal Agents: The Automated Paralegal

Legal agents process massive volumes of text, ensuring compliance and surfacing precedents.

## 1. Contract Analysis & Redlining
An agent reviews vendor contracts, highlighting clauses that deviate from standard company policy (e.g., unlimited liability).
- **Visual Component:** A document viewer where non-compliant clauses are highlighted in yellow, with a popover showing the agent's suggested redline replacement.

### Contract Analysis Payload (JSON)
```json
{
  "agent_id": "paralegal_bot",
  "document": "Vendor_Agreement_v2.pdf",
  "flagged_clauses": [
    {
      "section": "7.2 Liability",
      "issue": "Missing liability cap",
      "suggested_redline": "Liability shall be capped at 12 months of fees."
    }
  ]
}
```

## 2. Case Law Research
The agent takes a brief description of a legal situation and retrieves the top 5 most relevant historical precedents using a semantic vector search.
- **Visual Component:** A node graph connecting a central case to historical cases based on semantic similarity scores.
