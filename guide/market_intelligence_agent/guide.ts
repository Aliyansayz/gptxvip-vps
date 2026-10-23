import type { GuideDefinition } from "../components/guideTypes";
import image0 from "../pictures_source_for_next_version/ai-market-intelligence-agent-pages-01-03.png";

export const guide: GuideDefinition = {
  "title": "Market Intelligence Agent",
  "category": "AI / MARKET RESEARCH",
  "subtitle": "Turn scattered signals into opportunity and risk briefs.",
  "introduction": "Follow monitoring and collection, analysis and discovery, then dashboards and reporting. Read the workflow alongside three illustrated pages.",
  "highlights": [
    "Monitor markets and customers",
    "Assess opportunities and risks",
    "Publish evidence-backed briefs"
  ],
  "sections": [
    {
      "id": "scope",
      "title": "Define the market and research scope",
      "summary": "A market workspace needs a clear industry, geography, customer segment, and decision.",
      "steps": [
        "Name the market or industry, region, customer group, and research question.",
        "List the key players, demand signals, trends, and known uncertainties.",
        "Identify a research owner and the timeframe for the decision.",
        "Choose the outputs needed: an overview, a trend review, an opportunity brief, or a risk brief."
      ],
      "outcome": "The research has a defined audience and a decision it supports."
    },
    {
      "id": "sources",
      "title": "Collect and organize trusted sources",
      "summary": "Combine external signals with authorized internal data where it is relevant.",
      "steps": [
        "Gather company announcements, news, research reports, public filings, patents, and customer feedback.",
        "Track publication dates, source links, and the distinction between a primary source and commentary.",
        "Review customer comments for recurring needs and separate sentiment from measured behavior.",
        "Track regulatory documents through proposal, consultation, publication, and relevant dates."
      ],
      "outcome": "The workspace contains dated, attributable signals that can be checked."
    },
    {
      "id": "signals",
      "title": "Normalize signals and identify trends",
      "summary": "A trend requires evidence across sources and time.",
      "steps": [
        "Normalize names, categories, dates, and units before comparing observations.",
        "Deduplicate repeated signals and verify the underlying event.",
        "Connect related observations and assess whether the pattern persists.",
        "Explain the strength of a trend and the evidence that would weaken the interpretation."
      ],
      "outcome": "A trend has a coherent evidence trail and an explicit confidence level."
    },
    {
      "id": "assess",
      "title": "Assess opportunities, risks, and scenarios",
      "summary": "Translate findings into a structured decision brief.",
      "steps": [
        "Describe the opportunity or risk, its evidence, affected segment, and likely time horizon.",
        "Compare demand, competitive intensity, strategic fit, execution difficulty, and potential impact.",
        "Record assumptions when sizing a market or constructing base, optimistic, and downside scenarios.",
        "Separate observed evidence from a forecast and identify the next validation step."
      ],
      "outcome": "The brief makes assumptions and uncertainties visible beside its conclusion."
    },
    {
      "id": "publish",
      "title": "Publish briefs and maintain watchlists",
      "summary": "Use a dashboard as an entry point to the underlying research.",
      "steps": [
        "Group active signals, opportunities, risks, and recent events in a consistent overview.",
        "Publish a short opportunity or risk brief with supporting links and a clear reader question.",
        "Choose alerts for meaningful changes in demand, regulation, competition, or supply conditions.",
        "Set a review cadence and audience for daily digests, weekly briefs, or monthly outlooks."
      ],
      "outcome": "Recipients can open the evidence behind a summary and know when it was reviewed."
    },
    {
      "id": "govern",
      "title": "Review access and preserve auditability",
      "summary": "Keep the path from source to recommendation visible.",
      "steps": [
        "Assign research, review, administration, and viewing responsibilities.",
        "Record the sources used, retrieval dates, transformations, and generated summaries.",
        "Retain edits, confidence levels, reviewer decisions, and published outputs.",
        "Revisit outdated signals and update briefs when their underlying assumptions change."
      ],
      "outcome": "A published brief has an owner, a review history, and current supporting evidence."
    }
  ],
  "illustrations": [
    { src: image0, title: "Monitor & collect", alt: "Market Intelligence Agent: Monitor & collect", width: 1536, height: 1024, panels: 3, panel: 0 },
    { src: image0, title: "Analyze & discover", alt: "Market Intelligence Agent: Analyze & discover", width: 1536, height: 1024, panels: 3, panel: 1 },
    { src: image0, title: "Brief & govern", alt: "Market Intelligence Agent: Brief & govern", width: 1536, height: 1024, panels: 3, panel: 2 }
  ]
};

export const manual = guide;

