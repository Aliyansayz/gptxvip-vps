import type { ManualDefinition } from "../components/manualTypes";
import image0 from "../pictures_source_for_next_version/ai-competitive-intelligence-agent-page-01.png";
import image1 from "../pictures_source_for_next_version/ai-competitive-intelligence-agent-page-02.png";
import image2 from "../pictures_source_for_next_version/ai-competitive-intelligence-agent-page-03.png";
import image3 from "../pictures_source_for_next_version/signalforge-ai-workspace-overview.png";
import image4 from "../pictures_source_for_next_version/signalforge-ai-application-overview.png";
import image5 from "../pictures_source_for_next_version/signalforge-ai-pages-01-03.png";

export const manual: ManualDefinition = {
  "title": "Competitive Intelligence Agent",
  "category": "AI / INTELLIGENCE",
  "subtitle": "Monitor markets. Detect change. Turn signals into insight.",
  "introduction": "Use the three-page research handbook and the SignalForge reference artwork to organize competitors, capture source evidence, compare changes, and deliver reviewed intelligence.",
  "highlights": [
    "Monitor approved sources",
    "Verify meaningful changes",
    "Brief the right audience"
  ],
  "sections": [
    {
      "id": "workspace",
      "title": "Create a competitor workspace",
      "summary": "Organize research around the companies, products, markets, and questions that matter to your team.",
      "steps": [
        "Define the competitor set and the questions the monitoring effort should answer.",
        "Record each company’s website, products, target markets, and relevant source links.",
        "Add pricing pages, release notes, careers pages, patent sources, and public announcements.",
        "Assign research ownership and distinguish a direct competitor from a related market participant."
      ],
      "outcome": "The workspace has a defined scope and a traceable set of sources."
    },
    {
      "id": "monitor",
      "title": "Monitor and capture source evidence",
      "summary": "An intelligence item starts with an observed change and the evidence needed to inspect it.",
      "steps": [
        "Capture the source URL, publication date when available, retrieval time, and relevant excerpt.",
        "Compare the new observation with the previous version or a documented baseline.",
        "Classify pricing, product releases, hiring, patents, partnerships, news, or messaging changes.",
        "Deduplicate repeated coverage and keep original evidence separate from generated summaries."
      ],
      "outcome": "Each change can be checked against its source and its previous state."
    },
    {
      "id": "analyze",
      "title": "Analyze signals and strategic themes",
      "summary": "Combine related observations without treating every small update as a strategic shift.",
      "steps": [
        "Compare plan packaging, usage limits, discounts, and product positioning over time.",
        "Review releases and hiring patterns together with patent activity and market announcements.",
        "Group related signals into themes such as expansion, specialization, efficiency, or security investment.",
        "State the significance and confidence of an interpretation, including competing explanations."
      ],
      "outcome": "A theme is supported by multiple observations and clearly separates evidence from interpretation."
    },
    {
      "id": "compare",
      "title": "Compare competitors and answer research questions",
      "summary": "Use consistent dimensions to make a comparison useful.",
      "steps": [
        "Choose comparable products, customer segments, regions, and time periods.",
        "Compare features, pricing models, positioning, hiring patterns, partnerships, and release activity.",
        "Ask focused research questions and require source-backed answers.",
        "Keep dates attached to figures and screenshots; the handbook’s example screens illustrate the workflow."
      ],
      "outcome": "The comparison describes the same dimensions and provides evidence for its conclusions."
    },
    {
      "id": "brief",
      "title": "Build briefs, reports, and watchlists",
      "summary": "Deliver a concise change summary with enough context for the recipient to act.",
      "steps": [
        "Write the observed change, previous state, current state, supporting evidence, and potential relevance.",
        "Choose a daily digest, weekly competitor brief, monthly review, or company-specific report.",
        "Configure watchlists around changes that matter to the team and keep alerts focused.",
        "Route material with uncertainty or sensitive implications through the appropriate human review."
      ],
      "outcome": "The brief names its audience, evidence, confidence, and next research question."
    },
    {
      "id": "audit",
      "title": "Review and preserve the research trail",
      "summary": "A useful research record survives after a dashboard or alert is read.",
      "steps": [
        "Record the original source, retrieval timestamp, and saved content or snapshot.",
        "Retain change classification, extracted facts, generated summary, and confidence.",
        "Keep human edits, reviewer decisions, publication time, and included reports.",
        "Use role-appropriate access for administration, analysis, editing, executive reading, and audit."
      ],
      "outcome": "Another researcher can reproduce the observation and see how it became a published insight."
    }
  ],
  "illustrations": [
    { src: image0, title: "Monitor & capture", alt: "Competitive Intelligence Agent: Monitor & capture", width: 1055, height: 1491 },
    { src: image1, title: "Classify & verify", alt: "Competitive Intelligence Agent: Classify & verify", width: 1055, height: 1491 },
    { src: image2, title: "Compare & report", alt: "Competitive Intelligence Agent: Compare & report", width: 1055, height: 1491 },
    { src: image3, title: "SignalForge workspace", alt: "Competitive Intelligence Agent: SignalForge workspace", width: 1536, height: 1024 },
    { src: image4, title: "SignalForge application", alt: "Competitive Intelligence Agent: SignalForge application", width: 1536, height: 1024 },
    { src: image5, title: "SignalForge monitoring", alt: "Competitive Intelligence Agent: SignalForge monitoring", width: 1536, height: 1024, panels: 3, panel: 0 },
    { src: image5, title: "SignalForge analysis", alt: "Competitive Intelligence Agent: SignalForge analysis", width: 1536, height: 1024, panels: 3, panel: 1 },
    { src: image5, title: "SignalForge briefings", alt: "Competitive Intelligence Agent: SignalForge briefings", width: 1536, height: 1024, panels: 3, panel: 2 }
  ]
};
