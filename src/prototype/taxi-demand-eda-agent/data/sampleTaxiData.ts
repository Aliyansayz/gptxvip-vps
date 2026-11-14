import type {
  AgentPrototypeDescriptor,
  RideRecord,
  TaxiDemoState,
} from "../types";

/** Deterministic PRNG so initial seed records and demo resets remain reproducible. */
function createSeededRandom(seedValue = 20261114) {
  let state = seedValue >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function generateSampleTaxiData(seedValue = 20261114): {
  records: RideRecord[];
  csvString: string;
} {
  const rand = createSeededRandom(seedValue);
  const records: RideRecord[] = [];
  const months: Array<{ name: string; season: RideRecord["season"] }> = [
    { name: "January", season: "Winter" },
    { name: "February", season: "Winter" },
    { name: "March", season: "Spring" },
    { name: "April", season: "Spring" },
    { name: "May", season: "Spring" },
    { name: "June", season: "Summer" },
    { name: "July", season: "Summer" },
    { name: "August", season: "Summer" },
    { name: "September", season: "Autumn" },
    { name: "October", season: "Autumn" },
    { name: "November", season: "Autumn" },
    { name: "December", season: "Winter" },
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let idCounter = 1;
  const targetHours = [2, 8, 12, 17, 21];

  months.forEach((m, mIndex) => {
    const sampleDays = [
      { dayNum: 10, dayOfWeek: daysOfWeek[1], isHoliday: false },
      { dayNum: 14, dayOfWeek: daysOfWeek[5], isHoliday: false },
      {
        dayNum: mIndex === 0 ? 1 : mIndex === 6 ? 4 : mIndex === 11 ? 25 : 18,
        dayOfWeek: daysOfWeek[3],
        isHoliday: true,
      },
    ];

    sampleDays.forEach((day) => {
      targetHours.forEach((hour) => {
        let baseRides = 50;
        let fareBase = 12.0;
        let durationBase = 15.0;
        let weather: RideRecord["weatherCondition"] = "Clear";
        let traffic: RideRecord["trafficLevel"] = "Medium";

        let seasonMultiplier = 1.0;
        if (m.season === "Summer") seasonMultiplier = 1.25;
        else if (m.season === "Winter") seasonMultiplier = 1.1;
        else if (m.season === "Autumn") seasonMultiplier = 0.95;

        const randWeather = rand();
        if (m.season === "Winter") {
          weather =
            randWeather < 0.4
              ? "Snowy"
              : randWeather < 0.7
                ? "Cloudy"
                : "Clear";
        } else {
          weather =
            randWeather < 0.25
              ? "Rainy"
              : randWeather < 0.5
                ? "Cloudy"
                : "Clear";
        }

        if (weather === "Snowy") {
          baseRides += 40;
          fareBase += 6.0;
          durationBase += 12.0;
          traffic = "High";
        } else if (weather === "Rainy") {
          baseRides += 25;
          fareBase += 4.0;
          durationBase += 7.0;
          traffic = "Medium";
        }

        const isWeekend =
          day.dayOfWeek === "Saturday" || day.dayOfWeek === "Sunday";

        if (hour === 8) {
          if (day.isHoliday) {
            baseRides += 15;
            traffic = "Low";
          } else if (isWeekend) {
            baseRides += 20;
            traffic = "Low";
          } else {
            baseRides += 160;
            traffic = "High";
            durationBase += 10.0;
          }
        } else if (hour === 17) {
          if (day.isHoliday) {
            baseRides += 30;
            traffic = "Low";
          } else if (isWeekend) {
            baseRides += 65;
            traffic = "Medium";
          } else {
            baseRides += 220;
            traffic = "High";
            durationBase += 15.0;
            fareBase += 5.5;
          }
        } else if (hour === 21) {
          if (day.isHoliday || isWeekend) {
            baseRides += 140;
            traffic = "Medium";
            fareBase += 3.0;
          } else {
            baseRides += 45;
            traffic = "Low";
          }
        } else if (hour === 2) {
          if (day.isHoliday || isWeekend) {
            baseRides += 95;
            traffic = "Low";
          } else {
            baseRides += 10;
            traffic = "Low";
          }
        } else {
          baseRides += 40;
          if (isWeekend) baseRides += 30;
        }

        const ridesCount = Math.round(
          Math.max(5, baseRides * seasonMultiplier + (rand() * 15 - 7)),
        );
        const averageFare = parseFloat(
          Math.max(5.0, fareBase + (rand() * 4 - 2)).toFixed(2),
        );
        const averageDuration = parseFloat(
          Math.max(3.0, durationBase + (rand() * 6 - 3)).toFixed(1),
        );

        const monthNum = String(mIndex + 1).padStart(2, "0");
        const dayNumStr = String(day.dayNum).padStart(2, "0");
        const hourStr = String(hour).padStart(2, "0");
        const timestamp = `2026-${monthNum}-${dayNumStr} ${hourStr}:00:00`;

        records.push({
          id: `ride_${idCounter++}`,
          timestamp,
          month: m.name,
          hour,
          season: m.season,
          holiday: day.isHoliday,
          dayOfWeek: day.dayOfWeek,
          ridesCount,
          averageFare,
          averageDuration,
          weatherCondition: weather,
          trafficLevel: traffic,
        });
      });
    });
  });

  records.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const header =
    "id,timestamp,month,hour,season,holiday,dayOfWeek,ridesCount,averageFare,averageDuration,weatherCondition,trafficLevel\n";
  const rows = records
    .map(
      (r) =>
        `"${r.id}","${r.timestamp}","${r.month}",${r.hour},"${r.season}",${r.holiday ? 1 : 0},"${r.dayOfWeek}",${r.ridesCount},${r.averageFare},${r.averageDuration},"${r.weatherCondition}","${r.trafficLevel}"`,
    )
    .join("\n");

  return {
    records,
    csvString: header + rows,
  };
}

export const AGENT_PROTOTYPES: AgentPrototypeDescriptor[] = [
  {
    id: "taxi_demand",
    name: "Taxi Demand Predictor",
    type: "Predictive Archetype",
    role: "Exploratory Data Analysis & Fleet Forecasting",
    category: "Analytics & EDA",
    status: "LIVE",
    statusLabel: "Fully Active (Sample Data)",
    purpose:
      "Forecast wait times, taxi demands, and surge pricing multipliers.",
    description:
      "Reads municipal transportation indexes, calculates hour-by-hour volumes, and models demand peaks against extreme winter or summer climates.",
    inputs: [
      "Hourly Ride Records",
      "Weather Conditions",
      "Seasonal Period",
      "Holiday Log Ledgers",
    ],
    outputs: [
      "Forecast Area Trends",
      "Surge Multipliers",
      "Traffic Delay Friction Matrix",
      "Operational Reports",
    ],
    responsibilities: [
      "Forecast regional commute volumes",
      "Map weather delays against average travel fare sizes",
      "Identify high density spikes on holidays",
      "Analyze passenger load distributions throughout peak periods",
    ],
    feeds: [
      "Stats KPI Grid",
      "Demand Area Charts",
      "Friction Matrix Bar Chart",
      "AI Report Copilot",
    ],
    isReal: true,
  },
  {
    id: "recon_agent",
    name: "Recon Agent",
    type: "Threat Surface Archetype",
    role: "Surface Discovery & DNS Enumeration",
    category: "Security & Recon",
    status: "PROTOTYPE",
    statusLabel: "Simulation Ready",
    purpose:
      "Discover the entire attack surface of the target before active testing begins.",
    description:
      "Performs passive and active reconnaissance to continuously build an inventory of internet-facing assets and technologies.",
    inputs: [
      "Program Scope",
      "Target Domains",
      "ASN Registrations",
      "CIDR IP Ranges",
    ],
    outputs: [
      "Subdomain Lists",
      "Live Host Inventories",
      "Technology Fingerprints",
      "Exposed Port Mappings",
    ],
    responsibilities: [
      "Subdomain enumeration and brute forcing",
      "DNS Intelligence gathering",
      "Certificate transparency log monitoring",
      "Server technology fingerprinting",
      "Asset inventory indexing",
    ],
    feeds: ["Scope Manager", "Endpoint Inventory", "Interesting URLs"],
    isReal: false,
  },
  {
    id: "scanner_agent",
    name: "Scanner Agent",
    type: "Vulnerability Audit Archetype",
    role: "Static Bundle & Parameter Integrity Auditor",
    category: "Vulnerability Scanning",
    status: "PROTOTYPE",
    statusLabel: "Simulation Ready",
    purpose:
      "Automatically inspect discovered assets for endpoints, parameters, secrets, and common vulnerability indicators.",
    description:
      "Executes crawling, fingerprinting, parameter extraction, JavaScript analysis, and lightweight vulnerability detection.",
    inputs: [
      "Discovered Subdomains",
      "Raw Endpoint Paths",
      "Harvested JS Bundles",
    ],
    outputs: [
      "Query Parameters",
      "Exposed Sensitive Tokens",
      "Client JS APIs",
      "Potential Injection Vectors",
    ],
    responsibilities: [
      "Endpoint path crawling",
      "Request parameter parsing",
      "Exposed JavaScript file scanning",
      "Secrets & Access Key tracking",
      "HTTP response status audits",
    ],
    feeds: ["Parameters Inventory", "JavaScript Files", "Secrets Found"],
    isReal: false,
  },
  {
    id: "analyzer_agent",
    name: "Analyzer Agent",
    type: "Cognitive Reasoning Archetype",
    role: "Finding Correlation & Triage Queue Orchestrator",
    category: "Triage & Synthesis",
    status: "PROTOTYPE",
    statusLabel: "Simulation Ready",
    purpose:
      "Correlate findings from all agents and prioritize the highest-value bug hunting opportunities.",
    description:
      "Uses AI reasoning to identify likely vulnerabilities, estimate impact, reduce duplicates, and recommend the next investigation.",
    inputs: [
      "Recon Records",
      "Scanner Alerts",
      "Historical Vuln Databases",
    ],
    outputs: [
      "Priority Triage Scores",
      "Attack Path Visualizations",
      "Vulnerability Draft Reports",
      "Human Validation Prompts",
    ],
    responsibilities: [
      "Automated risk grading (CVSS equivalent)",
      "Insight correlation & duplicates deduction",
      "Attack path formulation",
      "Estimated bounty value forecasting",
      "AI reasoning explanations and reports",
    ],
    feeds: ["Priority Queue", "Interesting URLs", "Agent Chat Copilot"],
    isReal: false,
  },
];

export const CATALOG_DATASETS = [
  {
    id: "taxi-demand",
    title: "Taxi Demand",
    status: "LIVE ON SITE",
    rows: 180,
    columns: 12,
    description:
      "Represents urban ride-sharing indices including commute peaks, holidays (New Year's Eve, July 4th, Christmas), severe weather friction rates, and spatial congestion ratios.",
  },
  {
    id: "micromobility-hubs",
    title: "Micromobility Hubs",
    status: "Q4 PREVIEW",
    rows: 5400,
    columns: 9,
    description:
      "Bike-share seasonal metrics mapping weekend recreational ride flows against midday commercial congestion indexes in downtown squares.",
  },
  {
    id: "airport-terminal-shuttles",
    title: "Airport Terminal Shuttles",
    status: "Q4 QUEUED",
    rows: 3200,
    columns: 10,
    description:
      "Granular shuttle arrivals, holiday delay intervals, luggage-loading delay coefficients, and terminal toll transit rates.",
  },
] as const;

const initialSample = generateSampleTaxiData();

export const seed: TaxiDemoState = {
  records: initialSample.records,
  csvString: initialSample.csvString,
  fileName: "nyc-taxi-sharing-demands-demo.csv",
  filters: {
    season: "All",
    weather: "All",
    dayType: "All",
  },
  selectedAgentId: "taxi_demand",
};

const VALID_SEASONS = new Set(["Winter", "Spring", "Summer", "Autumn"]);
const VALID_WEATHERS = new Set(["Clear", "Rainy", "Snowy", "Cloudy"]);
const VALID_TRAFFIC = new Set(["Low", "Medium", "High"]);
const VALID_DAY_TYPES = new Set(["All", "Workdays", "Holidays"]);

export function validate(state: TaxiDemoState): boolean {
  if (!state || typeof state !== "object") return false;
  if (!Array.isArray(state.records) || state.records.length === 0) return false;
  if (typeof state.csvString !== "string" || !state.csvString.trim())
    return false;
  if (typeof state.fileName !== "string" || !state.fileName.trim())
    return false;
  if (!state.filters || !VALID_DAY_TYPES.has(state.filters.dayType))
    return false;
  if (!AGENT_PROTOTYPES.some((a) => a.id === state.selectedAgentId))
    return false;

  return state.records.every(
    (r) =>
      typeof r.id === "string" &&
      typeof r.timestamp === "string" &&
      typeof r.hour === "number" &&
      Number.isFinite(r.hour) &&
      VALID_SEASONS.has(r.season) &&
      typeof r.holiday === "boolean" &&
      typeof r.ridesCount === "number" &&
      Number.isFinite(r.ridesCount) &&
      typeof r.averageFare === "number" &&
      Number.isFinite(r.averageFare) &&
      typeof r.averageDuration === "number" &&
      Number.isFinite(r.averageDuration) &&
      VALID_WEATHERS.has(r.weatherCondition) &&
      VALID_TRAFFIC.has(r.trafficLevel),
  );
}
