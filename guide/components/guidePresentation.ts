import { BarChart3, Radar, TrendingUp, ShieldCheck, FileCheck2, Boxes, Headphones, type LucideIcon } from "lucide-react";
import type { GuideDefinition } from "./guideTypes";

export interface GuidePresentation {
  brand: [string, string];
  headline: [string, string];
  stages: string[];
  icon: LucideIcon;
}
const presentations: Record<string, GuidePresentation> = {
  "AI Data Analyst Agent": { brand: ["DATA ANALYST", "AI / ANALYTICS"], headline: ["Questions in.", "Insight out."], stages: ["Connect", "Query", "Validate", "Investigate", "Explain", "Report"], icon: BarChart3 },
  "Competitive Intelligence Agent": { brand: ["COMPETITIVE", "INTELLIGENCE"], headline: ["Signals captured.", "Strategy clarified."], stages: ["Workspace", "Monitor", "Analyze", "Compare", "Brief", "Audit"], icon: Radar },
  "Market Intelligence Agent": { brand: ["MARKET", "INTELLIGENCE"], headline: ["Markets move.", "Stay informed."], stages: ["Scope", "Sources", "Signals", "Assess", "Publish", "Govern"], icon: TrendingUp },
  "Vulnerability Remediation Agent": { brand: ["REMEDIATION", "SECURITY / OPERATIONS"], headline: ["Exposure found.", "Risk resolved."], stages: ["Intake", "Prioritize", "Assign", "Remediate", "Verify", "Close"], icon: ShieldCheck },
  "Insurance Claims Agent": { brand: ["CLAIMS", "CASE OPERATIONS"], headline: ["Claims connected.", "Decisions documented."], stages: ["Intake", "Coverage", "Evidence", "Route", "Outcome", "Close"], icon: FileCheck2 },
  "ColdChain ERP": { brand: ["COLDCHAIN", "ERP / OPERATIONS"], headline: ["Every batch.", "Under control."], stages: ["Receive", "Store", "Pick", "Dispatch", "Deliver", "Close"], icon: Boxes },
  "Customer Support Agent": { brand: ["CUSTOMER SUPPORT", "AI / OPERATIONS"], headline: ["Support connected.", "Customers understood."], stages: ["Intake", "Understand", "Knowledge", "Resolve", "Escalate", "Improve"], icon: Headphones },
};
export function getGuidePresentation(guide: GuideDefinition): GuidePresentation {
  return presentations[guide.title] || { brand: [guide.title, guide.category], headline: ["Work connected.", "Clarity delivered."], stages: guide.sections.map(section => section.title), icon: FileCheck2 };
}
export const getManualPresentation = getGuidePresentation;
