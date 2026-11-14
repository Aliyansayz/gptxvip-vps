export interface RideRecord {
  id: string;
  timestamp: string;
  month: string;
  hour: number;
  season: "Winter" | "Spring" | "Summer" | "Autumn";
  holiday: boolean;
  dayOfWeek: string;
  ridesCount: number;
  averageFare: number;
  averageDuration: number;
  weatherCondition: "Clear" | "Rainy" | "Snowy" | "Cloudy";
  trafficLevel: "Low" | "Medium" | "High";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  suggestedCharts?: string[];
}

export interface EDAInsights {
  summaryText: string;
  findings: Array<{
    title: string;
    description: string;
    metric?: string;
    impact: "High" | "Medium" | "Low";
  }>;
  peakDemandPeriods: Array<{
    timeSlot: string;
    season: "Winter" | "Spring" | "Summer" | "Autumn" | "All";
    rideIntensity: "Peak" | "Moderate" | "Low";
    avgRides: number;
  }>;
  holidayStats: {
    holidayAvg: number;
    nonHolidayAvg: number;
    percentDifference: number;
    recommendation: string;
  };
}

export interface FilterState {
  season: string;
  weather: string;
  dayType: "All" | "Workdays" | "Holidays";
}

export interface KpiStats {
  totalRides: number;
  activeIntervals: number;
  avgFare: number;
  avgDuration: number;
  holidayDifference: number;
}

export interface AggregatedStats {
  holidayAvg: number;
  nonHolidayAvg: number;
  holidayPercentDifference: number;
  seasonalAverages: Record<string, number>;
  peakHours: Array<{ hour: number; avgRides: number }>;
  weatherAverages: Record<string, number>;
  highTrafficHour: number;
  highTrafficDuration: number;
  highTrafficFare: number;
}

export interface Finding {
  title: string;
  description: string;
  metric: string;
  impact: "High" | "Medium" | "Low";
  season?: string;
}

export interface AnalysisResponse {
  summary: string;
  findings: Finding[];
  agentThoughts: string;
  suggestedPrompts: string[];
}

export interface AgentPrototypeDescriptor {
  id: string;
  name: string;
  type: string;
  role: string;
  category:
    | "Analytics & EDA"
    | "Security & Recon"
    | "Vulnerability Scanning"
    | "Triage & Synthesis";
  status: "LIVE" | "PROTOTYPE";
  statusLabel: string;
  purpose: string;
  description: string;
  inputs: string[];
  outputs: string[];
  responsibilities: string[];
  feeds: string[];
  isReal: boolean;
}

export type WorkspaceTab =
  | "Platform Home"
  | "Agent Directory"
  | "Taxi Workspace"
  | "Data Catalog"
  | "Logicflow & Code";

export interface TaxiDemoState {
  records: RideRecord[];
  csvString: string;
  fileName: string;
  filters: FilterState;
  selectedAgentId: string;
}
