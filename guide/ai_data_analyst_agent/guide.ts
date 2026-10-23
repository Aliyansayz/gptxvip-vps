import type { GuideDefinition } from "../components/guideTypes";
import image0 from "../pictures_source_for_next_version/ai-data-analyst-agent-page-01.png";
import image1 from "../pictures_source_for_next_version/ai-data-analyst-agent-page-02.png";
import image2 from "../pictures_source_for_next_version/ai-data-analyst-agent-page-03.png";

export const guide: GuideDefinition = {
  "title": "AI Data Analyst Agent",
  "category": "AI / ANALYTICS",
  "subtitle": "Ask questions. Validate answers. Turn data into insight.",
  "introduction": "Follow the illustrated handbook from a business question through a checked analysis, a visual explanation, and a recurring report. Keep the source data, query, and review history connected.",
  "highlights": [
    "Connect and query",
    "Validate and investigate",
    "Explain and report"
  ],
  "sections": [
    {
      "id": "connect",
      "title": "Connect and understand the data",
      "summary": "Start with the business question and the datasets needed to answer it.",
      "steps": [
        "Choose the relevant database, warehouse, spreadsheet, or authorized API source.",
        "Inspect tables, field meanings, relationships, refresh dates, and the grain of each dataset.",
        "Check access permissions and limit the analysis to the data the analyst is allowed to read.",
        "Define the reporting period, metric, and comparison before asking for a result."
      ],
      "outcome": "The question, source, period, and metric are explicit."
    },
    {
      "id": "query",
      "title": "Ask a question and review the query",
      "summary": "Natural-language questions should become a clear analysis plan before they become a chart.",
      "steps": [
        "Ask a focused question, such as how monthly sales changed and which region contributed most.",
        "Review the proposed datasets, joins, filters, aggregation, and time boundaries.",
        "Inspect the generated SQL and confirm it measures the intended business concept.",
        "Keep read-only analysis separate from updates, deletions, schema changes, and restricted data access."
      ],
      "outcome": "A reviewed query answers the intended question without changing source records."
    },
    {
      "id": "validate",
      "title": "Validate results before using them",
      "summary": "The second illustrated page distinguishes validated results, results needing review, and data-quality warnings.",
      "steps": [
        "Check missing values, duplicate records, join integrity, outliers, and date gaps.",
        "Reconcile headline totals with a trusted source and inspect a sample of contributing rows.",
        "Check aggregation logic, units, and whether a comparison uses equivalent periods.",
        "Resolve warnings or explain the limitation before presenting a result as trustworthy."
      ],
      "outcome": "The result has a quality status and a clear explanation of any remaining limitation."
    },
    {
      "id": "investigate",
      "title": "Visualize and investigate changes",
      "summary": "Move from a useful overview to the evidence behind an unusual result.",
      "steps": [
        "Choose a line chart for change over time, a bar chart for comparison, or another suitable chart for the question.",
        "Apply date, region, product, and channel filters consistently across the dashboard.",
        "Investigate spikes, drops, and unexpected gaps across region, product, customer segment, and channel.",
        "Separate an observed pattern from its proposed explanation and retain the supporting figures."
      ],
      "outcome": "Charts and a drill-down path explain what changed and what evidence supports the interpretation."
    },
    {
      "id": "explain",
      "title": "Explain the finding and answer follow-ups",
      "summary": "A useful explanation connects the numbers to a business decision.",
      "steps": [
        "Summarize what happened, why it may have happened, and what it means.",
        "Include the comparison period, major contributing factors, and confidence or unresolved questions.",
        "Use follow-up questions to compare another period, exclude a segment, or inspect affected products.",
        "Keep the context and filters visible when turning the analysis into a dashboard or report."
      ],
      "outcome": "A reader can understand the result and trace it back to the analysis."
    },
    {
      "id": "report",
      "title": "Schedule reports and retain the audit trail",
      "summary": "The final illustrated page covers delivery, agent activity, human approval, roles, and auditability.",
      "steps": [
        "Choose a daily, weekly, monthly, or exception-driven reporting purpose and audience.",
        "Review delivery destinations and obtain the required review before distributing sensitive material or creating new scheduled jobs.",
        "Inspect the activity timeline for query execution, validation, investigation, and delivery.",
        "Retain the original question, sources, SQL, filters, outputs, recipients, approvals, and timestamps."
      ],
      "outcome": "A repeatable report has an accountable owner, appropriate access, and a reproducible history."
    }
  ],
  "illustrations": [
    { src: image0, title: "Connections & queries", alt: "AI Data Analyst Agent: Connections & queries", width: 1055, height: 1491 },
    { src: image1, title: "Validate & investigate", alt: "AI Data Analyst Agent: Validate & investigate", width: 1055, height: 1491 },
    { src: image2, title: "Reports & governance", alt: "AI Data Analyst Agent: Reports & governance", width: 1055, height: 1491 }
  ]
};

export const manual = guide;

