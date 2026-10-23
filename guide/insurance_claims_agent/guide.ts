import type { GuideDefinition } from "../components/guideTypes";

export const guide: GuideDefinition = {
  "title": "Insurance Claims Agent",
  "category": "FINANCE / CASE OPERATIONS",
  "subtitle": "Move a claim from intake to an accountable outcome.",
  "introduction": "A workflow guide for organizing claims intake, policy and evidence review, adjuster routing, and an approved settlement record. Use the applicable policy and your team’s review process for case decisions.",
  "highlights": [
    "Collect a complete case",
    "Route reviewed evidence",
    "Record the approved outcome"
  ],
  "sections": [
    {
      "id": "intake",
      "title": "Create and validate the case",
      "summary": "Keep the reported event and the submitted information together.",
      "steps": [
        "Record the claimant, policy reference, event details, notification time, and contact information.",
        "Collect relevant documents and preserve their original versions.",
        "Check for an existing related claim and flag possible duplicates for review.",
        "Identify missing information and assign a case owner to request it."
      ],
      "outcome": "The case has a clear identity, owner, and document checklist."
    },
    {
      "id": "coverage",
      "title": "Review the relevant policy record",
      "summary": "Connect the reported event to the applicable policy information.",
      "steps": [
        "Confirm the policyholder and the policy record that applies to the reported event.",
        "Review the applicable dates, coverage terms, limits, and relevant exclusions in that record.",
        "Record supporting evidence and questions that need an authorized reviewer.",
        "Keep policy interpretation separate from an automated summary or unverified assumption."
      ],
      "outcome": "The review notes identify the applicable policy material and any unresolved question."
    },
    {
      "id": "evidence",
      "title": "Organize evidence and anomalies",
      "summary": "Help the reviewer find the information needed for a decision.",
      "steps": [
        "Group documents, statements, receipts, images, and correspondence by their relevance to the event.",
        "Check for missing, inconsistent, or unreadable information and request clarification.",
        "Flag unusual patterns for review without treating a flag as a confirmed finding.",
        "Keep an evidence index with document sources and the history of updates."
      ],
      "outcome": "The evidence is navigable and unresolved inconsistencies are visible."
    },
    {
      "id": "route",
      "title": "Route the case to the right reviewer",
      "summary": "A complete handoff reduces repeated requests and unclear ownership.",
      "steps": [
        "Choose the appropriate adjuster or specialist using the case type and team responsibilities.",
        "Provide the event summary, policy references, evidence index, and open questions.",
        "Record the assigned reviewer, next action, and expected follow-up date.",
        "Track requests for additional information and retain communication history."
      ],
      "outcome": "The receiving reviewer has an actionable case and a clear next step."
    },
    {
      "id": "outcome",
      "title": "Record the reviewed decision and settlement action",
      "summary": "Case outcomes should follow the applicable review and authorization process.",
      "steps": [
        "Record the authorized reviewer’s decision and its supporting reasons.",
        "Check the approved amount or action against the reviewed case record and applicable policy terms.",
        "Obtain the required authorization before carrying out a settlement or other financial action.",
        "Record the communication sent to the claimant and any follow-up or dispute route."
      ],
      "outcome": "The approved outcome, authorization, and communication are connected to the case."
    },
    {
      "id": "close",
      "title": "Reconcile and close the case",
      "summary": "A closed case needs a complete record of what actually happened.",
      "steps": [
        "Confirm that approved actions and related transactions match the case record.",
        "Resolve outstanding documents, tasks, or communications before marking the case complete.",
        "Retain the evidence, reviewer notes, authorizations, and final outcome.",
        "Use the recorded lifecycle to review delays, incomplete submissions, and handoff problems."
      ],
      "outcome": "The final record explains the case outcome and any remaining obligation."
    }
  ],
  "illustrations": [
    
  ]
};

export const manual = guide;

