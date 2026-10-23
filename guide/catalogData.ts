export type GuideCategory = "all" | "operations" | "ai" | "security" | "finance";
export type ManualCategory = GuideCategory;

export interface GuideItem {
  id: string;
  title: string;
  heading: string;
  category: Exclude<GuideCategory, "all">;
  description: string;
  classes: string;
  searchText: string;
  href: string | null;
  tags: string[];
}
export type Manual = GuideItem;

export const guides: GuideItem[] = [
  {
    "id": "1",
    "title": "Sunshine Distribution",
    "heading": "Sunshine Distribution",
    "category": "operations",
    "description": "FIFO warehouse and store distribution guide.",
    "classes": "sun reveal",
    "searchText": "01 software guide sunshine distribution warehouse inventory distribution ops 3 pages fifo warehouse and store distribution guide ready",
    "href": "/sunshine_distribution_guide",
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
    "searchText": "02 agent guide ai data analyst agent query validate visualize explain sql py bi ai 3 pages analytics workflows charts and anomaly explanation ready",
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
    "searchText": "03 intelligence guide competitive intelligence pricing hiring releases patents change signal ai intel monitor competitors and summarize meaningful change ready",
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
    "searchText": "04 market playbook market intelligence customers trends regulation risk opportunity risk ai market structured opportunity and risk briefing workflows ready",
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
    "searchText": "05 security runbook vulnerability remediation cve owner patch validate security cve prioritization ownership patching and verification ready",
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
    "searchText": "06 claims workflow insurance claims agent intake coverage fraud settlement adjuster ready finance ai claims intake through adjuster routing and settlement ready",
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
    "searchText": "07 erp operations coldchain erp batch fefo delivery reconciliation 2.8c stable ops erp cold-chain inventory route sales and day-end close ready",
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
    "searchText": "08 support playbook customer support agent intent kb crm sla escalation sla 24x7 ai support ticket handling knowledge lookup and escalation ready",
    "href": "/customer_support_agent",
    "tags": [
      "AI",
      "SUPPORT"
    ]
  }
];

export const manuals = guides;
