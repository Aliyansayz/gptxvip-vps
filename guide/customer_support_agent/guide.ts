import type { GuideDefinition } from "../components/guideTypes";
import image0 from "../pictures_source_for_next_version/ai-customer-support-agent-pages-01-03.png";

export const guide: GuideDefinition = {
  "title": "Customer Support Agent",
  "category": "AI / CUSTOMER OPERATIONS",
  "subtitle": "Understand the request. Find the answer. Resolve or escalate.",
  "introduction": "Follow ticket intake, context and knowledge lookup, resolution, service-level monitoring, and continuous improvement. Read the steps alongside the three illustrated pages.",
  "highlights": [
    "Unify incoming requests",
    "Resolve with customer context",
    "Escalate and improve"
  ],
  "sections": [
    {
      "id": "intake",
      "title": "Receive and normalize the ticket",
      "summary": "Bring each request into a consistent record before assigning work.",
      "steps": [
        "Capture the message, channel, customer identifier, received time, and attachments.",
        "Check whether an existing conversation or ticket already covers the request.",
        "Record the subject, status, priority, and relevant response or resolution target.",
        "Keep the original message available alongside any normalized summary."
      ],
      "outcome": "The ticket has enough context for the next person or agent to start work."
    },
    {
      "id": "understand",
      "title": "Understand intent and retrieve context",
      "summary": "A response should address the customer’s actual request.",
      "steps": [
        "Identify the request type, urgency, and sentiment without replacing the original message.",
        "Check authorized CRM context, order history, shipment status, billing, and product information.",
        "Verify that the customer and relevant order or account are correctly matched.",
        "Ask for missing information when context is uncertain instead of assuming it."
      ],
      "outcome": "The intended outcome and the relevant account or order are clear."
    },
    {
      "id": "knowledge",
      "title": "Find an approved answer",
      "summary": "Use the knowledge sources appropriate to the issue.",
      "steps": [
        "Search help-center articles, internal procedures, product documentation, and relevant policy records.",
        "Confirm that the selected article applies to the customer’s product, plan, and situation.",
        "Use diagnostic steps in a sensible order for a technical issue and note what was tried.",
        "Draft a concise response that explains the answer and the next action."
      ],
      "outcome": "The proposed answer is grounded in applicable knowledge and customer context."
    },
    {
      "id": "resolve",
      "title": "Resolve the request or route the action",
      "summary": "The illustrated flow distinguishes routine actions, reviewed actions, and restricted actions.",
      "steps": [
        "Confirm the requested outcome and the applicable procedure before changing an order, account, or financial record.",
        "Check authorization for refunds, replacements, return labels, or account updates.",
        "Send actions that require a reviewer to the appropriate owner with the supporting context.",
        "Record the action taken and tell the customer what happens next without promising an unconfirmed outcome."
      ],
      "outcome": "The action and customer response are recorded with the necessary authorization."
    },
    {
      "id": "escalate",
      "title": "Monitor service targets and escalate",
      "summary": "Make a handoff actionable rather than forwarding an unexplained ticket.",
      "steps": [
        "Track response and resolution targets and flag tickets approaching their due time.",
        "Escalate unresolved, high-impact, sensitive, or out-of-scope requests to the appropriate team.",
        "Include the original request, context, attempted steps, evidence, and reason for escalation.",
        "Keep an owner assigned during the handoff and update the customer on the next step."
      ],
      "outcome": "The receiving team has the information and responsibility needed to continue."
    },
    {
      "id": "improve",
      "title": "Close the loop and improve the knowledge base",
      "summary": "Use operations reporting to reduce repeated problems.",
      "steps": [
        "Confirm the resolution, record closure details, and retain the conversation history.",
        "Review ticket volume, overdue work, escalations, satisfaction, and recurring issue categories.",
        "Identify low-confidence answers, repeated questions, and missing or outdated knowledge.",
        "Propose knowledge-base updates and preserve the ticket, action, and review history."
      ],
      "outcome": "The case has a recorded outcome and contributes to a useful improvement backlog."
    }
  ],
  "illustrations": [
    { src: image0, title: "Receive & route", alt: "Customer Support Agent: Receive & route", width: 1536, height: 1024, panels: 3, panel: 0 },
    { src: image0, title: "Resolve & escalate", alt: "Customer Support Agent: Resolve & escalate", width: 1536, height: 1024, panels: 3, panel: 1 },
    { src: image0, title: "Operate & improve", alt: "Customer Support Agent: Operate & improve", width: 1536, height: 1024, panels: 3, panel: 2 }
  ]
};

export const manual = guide;

