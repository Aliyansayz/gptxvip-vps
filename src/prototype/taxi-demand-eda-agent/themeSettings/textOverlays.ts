export const textOverlays = {
  header: {
    title: "Taxi Demand EDA Agent",
    badge: "Sleek v2",
    subtitle:
      "Exploratory data science platform analyzing seasonal patterns, holiday spikes, and multi-agent orchestration.",
    logoLabel: "Taxi Demand EDA Agent logo",
  },
  workspace: {
    tabTitle: "Workspace",
    catalogTabTitle: "Data Catalog",
    resetButton: "Reset Data",
    exportButton: "Export CSV",
    activeDatasetLabel: "Active Dataset Origin",
    intervalParsedSuffix: "total interval records parsed successfully.",
    uploadHelper: "Drag and drop your Taxi CSV here",
    uploadOrClick: "or click to select file from desktop",
    narrative:
      "Demo taxi lists model high volume afternoon surges, multi-seasonal fluctuations (Summer peaks vs Winter snowy speed drops), and special holiday events.",
    uploadErrorCsvOnly:
      "Only CSV files are supported inside this analytics engine.",
    uploadErrorReader: "Unable to read the CSV file. Verify encoding.",
    uploadErrorParse: "CSV parsing failed. Verify formatting.",
  },
  catalog: {
    title: "Sleek Storage: Available Data Catalog",
    subtitle:
      "Toggle between municipal data assets loaded directly into client state for sandboxed exploratory data analysis (EDA).",
    taxiDemandTitle: "Taxi Demand",
    taxiDemandDesc:
      "Represents urban ride-sharing indices including commute peaks, holidays (New Year's Eve, July 4th), severe weather friction rates, and spatial congestion ratios.",
    taxiStatusBadge: "LIVE ON SITE",
    micromobilityTitle: "Micromobility Hubs",
    micromobilityBadge: "Q4 PREVIEW",
    micromobilityDesc:
      "Bike-share seasonal metrics mapping weekend recreational ride flows against midday commercial congestion indexes in downtown squares.",
    shuttlesTitle: "Airport Terminal Shuttles",
    shuttlesBadge: "Q4 QUEUED",
    shuttlesDesc:
      "Granular shuttle arrivals, holiday delay intervals, luggage-loading delay coefficients, and terminal toll transit rates.",
  },
  filtersPanel: {
    title: "Interactive EDA Control Panel",
    resetLabel: "Reset Filters",
    seasonLabel: "Seasonal Period",
    weatherLabel: "Climate / Weather",
    calendarLabel: "Calendar Category",
    showingTextPrefix: "Showing ",
    showingTextMiddle: " of ",
    showingTextSuffix: " hourly intervals matching active selections.",
    filtersActiveLabel: "Filters Active",
  },
  demandCharts: {
    distributionsTitle: "Hourly Peak Demand Distributions",
    workdayHolidayToggle: "Workdays vs Holidays",
    seasonalSpeedsToggle: "Seasonal Speeds",
    distributionsDesc:
      "Visualizes peak ride-sharing demand hotspots throughout critical times of day (8:00 AM commute peaks, 5:00 PM evening surge, nightlife activity).",
    noMatchingRecords: "No matching records for current filters.",
    dynamicsTitle: "Seasonal Volume Dynamics",
    dynamicsDesc:
      "Compares seasonal variations showing how ride volume relates with fare margins.",
    frictionTitle: "The Climate Friction Matrix: Weather vs Fares & Delay",
    frictionDesc:
      "Dual-Index visualization showing trip delays (traffic friction / slow-downs) and average fare size. Extreme weather triggers high trip durations coupled with surge premiums.",
  },
  statsGrid: {
    volumeTitle: "Active Demand Volume",
    volumeBadge: "+12.4% vs seasonal baseline",
    fareTitle: "Average Ride Fare",
    fareSubtitle: "Surge pricing active",
    fareBadge: "+5.1% priority surcharge",
    durationTitle: "Avg Trip Duration",
    durationSubtitle: "Frictional delay factored",
    durationBadge: "-2.4% roadway speed optimization",
    holidayTitle: "Holiday Surge Multiplier",
    holidaySubtitle: "vs regular business workdays",
    holidayBadgeHigh: "High density spike pattern",
    holidayBadgeDefault: "Standard flow rate",
  },
  copilot: {
    title: "Agent Copilot Actions",
    description:
      "The AI Agent translates raw CSV ledgers into prescriptive urban logistics insights. Choose a predefined analytic lens or write custom commands.",
    quickExplorations: "Quick Explorations",
    statusSecured: "Computational Engine & Copilot Ready",
    statusLocalOnly: "Local computational analytics active",
    statusKeyHelper:
      "Runs localized regression & deterministic fallback insights directly in browser.",
    starterHeader: "Awaiting Analytical Lens",
    starterDesc1: "Select a predefined template on the left panel like ",
    starterDesc2:
      " or send a custom question below to run the EDA Agent. It calculates averages on active records instantly.",
    exploreTitle: "What you can explore:",
    exploreList: [
      "• Peak Winter vs Summer trends",
      "• Workday commute spikes",
      "• Surge multipliers on holidays",
      "• Traffic friction optimization models",
    ],
    reportHeader: "Executive Demand Report",
    takeawaysHeader: "Structured Operational Takeaways",
    thoughtsToggleCollapse: "Collapse Internal Mathematical Reasoning",
    thoughtsToggleExpand: "Deconstruct Agent Inner Monologue",
    thoughtsHeader: "// Internal correlation analysis calculations",
    suggestedTitle: "Deep-Dive Recommendation Nodes",
    inputPlaceholder:
      "Ask the Agent for a custom data correlation calculation or business strategy...",
    sendButton: "Analyze",
    loadingAnalytics:
      "Analyzing seasons, weather fluctuations, and holiday demand spikes...",
  },
  dataTable: {
    title: "Ground Truth Raw CSV Ledger",
    searchPlaceholder: "Search by day, weather, season...",
    noRecords: "No matching records found.",
    showingPrefix: "Showing ",
    showingMiddle: " to ",
    showingOf: " of ",
    showingSuffix: " records",
    pagePrefix: "Page ",
    pageOf: " of ",
  },
  footer: {
    text: "Taxi Demand EDA Agent • All calculations computed locally inside sandboxed client-state.",
    subtext: "Reflecting live simulations • React 19 + Tailwind CSS.",
    poweredBy: "Powered by",
    poweredBadge: "Computational EDA Engine",
  },
};
