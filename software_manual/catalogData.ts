export type ManualCategory = "all" | "operations" | "ai" | "security" | "finance";
export interface Manual { id: string; title: string; heading: string; category: Exclude<ManualCategory, "all">; description: string; classes: string; searchText: string; href: string | null; tags: string[]; }
export const manuals: Manual[] = [
  {
    "id": "1",
    "title": "Sunshine Distribution",
    "heading": "Sunshine Distribution",
    "category": "operations",
    "description": "FIFO warehouse and store distribution manual.",
    "classes": "sun reveal",
    "searchText": " \n           01 \n           \n             software manual \n             \u2600 \n             sunshine distribution \n             warehouse \u00b7 inventory \u00b7 distribution \n                    \n           \n           \n              ops  3 pages  \n             sunshine distribution \n             fifo warehouse and store distribution manual. \n                 ready  \u2197  \n           \n         ",
    "href": "/sunshine_distribution_manual",
    "tags": [
      "OPS",
      "3 PAGES"
    ]
  },
  {
    "id": "2",
    "title": "AI Data Analyst Agent",
    "heading": "AI Data Analyst Agent",
    "category": "ai",
    "description": "Analytics workflows, charts and anomaly explanation.",
    "classes": "cyan reveal delay-1",
    "searchText": " \n           02 \n           \n             agent handbook \n                        \n             ai data analyst agent \n             query \u00b7 validate \u00b7 visualize \u00b7 explain \n             sql / py / bi \n           \n           \n              ai  3 pages  \n             ai data analyst agent \n             analytics workflows, charts and anomaly explanation. \n                 ready  \u2197  \n           \n         ",
    "href": "/ai_data_analyst_agent",
    "tags": [
      "AI",
      "3 PAGES"
    ]
  },
  {
    "id": "3",
    "title": "Competitive Intelligence Agent",
    "heading": "Competitive Intelligence",
    "category": "ai",
    "description": "Monitor competitors and summarize meaningful change.",
    "classes": "violet reveal delay-2",
    "searchText": " \n           03 \n           \n             intelligence manual \n                      \n             competitive intelligence \n             pricing \u00b7 hiring \u00b7 releases \u00b7 patents \n             change signal \n           \n           \n              ai  intel  \n             competitive intelligence \n             monitor competitors and summarize meaningful change. \n                 ready  \u2197  \n           \n         ",
    "href": "/competitive_intelligence_agent",
    "tags": [
      "AI",
      "INTEL"
    ]
  },
  {
    "id": "4",
    "title": "Market Intelligence Agent",
    "heading": "Market Intelligence Agent",
    "category": "ai",
    "description": "Structured opportunity and risk briefing workflows.",
    "classes": "lime reveal",
    "searchText": " \n           04 \n           \n             market playbook \n                        \n             market intelligence \n             customers \u00b7 trends \u00b7 regulation \u00b7 risk \n             opportunity / risk \n           \n           \n              ai  market  \n             market intelligence agent \n             structured opportunity and risk briefing workflows. \n                 ready  \u2197  \n           \n         ",
    "href": "/market_intelligence_agent",
    "tags": [
      "AI",
      "MARKET"
    ]
  },
  {
    "id": "5",
    "title": "Vulnerability Remediation Agent",
    "heading": "Vulnerability Remediation",
    "category": "security",
    "description": "Prioritization, ownership, patching and verification.",
    "classes": "red reveal delay-1",
    "searchText": " \n           05 \n           \n             security runbook \n              !  \n             vulnerability remediation \n             cve \u00b7 owner \u00b7 patch \u00b7 validate \n                      \n           \n           \n              security  cve  \n             vulnerability remediation \n             prioritization, ownership, patching and verification. \n                 ready  \u2197  \n           \n         ",
    "href": "/vulnerability_remediation_agent",
    "tags": [
      "SECURITY",
      "CVE"
    ]
  },
  {
    "id": "6",
    "title": "Insurance Claims Agent",
    "heading": "Insurance Claims Agent",
    "category": "finance",
    "description": "Claims intake through adjuster routing and settlement.",
    "classes": "orange reveal delay-2",
    "searchText": " \n           06 \n           \n             claims workflow \n                \u2713  \n             insurance claims agent \n             intake \u00b7 coverage \u00b7 fraud \u00b7 settlement \n             adjuster ready \n           \n           \n              finance  ai  \n             insurance claims agent \n             claims intake through adjuster routing and settlement. \n                 ready  \u2197  \n           \n         ",
    "href": "/insurance_claims_agent",
    "tags": [
      "FINANCE",
      "AI"
    ]
  },
  {
    "id": "7",
    "title": "ColdChain ERP",
    "heading": "ColdChain ERP",
    "category": "operations",
    "description": "Cold-chain inventory, route sales and day-end close.",
    "classes": "ice reveal",
    "searchText": " \n           07 \n           \n             erp operations \n             \u2723 \n             coldchain erp \n             batch \u00b7 fefo \u00b7 delivery \u00b7 reconciliation \n              2.8\u00b0c    stable  \n           \n           \n              ops  erp  \n             coldchain erp \n             cold-chain inventory, route sales and day-end close. \n                 ready  \u2197  \n           \n         ",
    "href": "/coldchain_erp",
    "tags": [
      "OPS",
      "ERP"
    ]
  },
  {
    "id": "8",
    "title": "Customer Support Agent",
    "heading": "Customer Support Agent",
    "category": "ai",
    "description": "Ticket handling, knowledge lookup and escalation.",
    "classes": "blue reveal delay-1",
    "searchText": " \n           08 \n           \n             support playbook \n                    \n             customer support agent \n             intent \u00b7 kb \u00b7 crm \u00b7 sla \u00b7 escalation \n             sla / 24\u00d77 \n           \n           \n              ai  support  \n             customer support agent \n             ticket handling, knowledge lookup and escalation. \n                 ready  \u2197  \n           \n         ",
    "href": "/customer_support_agent",
    "tags": [
      "AI",
      "SUPPORT"
    ]
  }
];
