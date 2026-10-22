export type IndustryType =
  | 'All'
  | 'Financial Services'
  | 'Healthcare & Life Sciences'
  | 'Manufacturing & Supply Chain'
  | 'Education & Research'
  | 'Logistics & Fleet'
  | 'Retail & E-commerce'
  | 'Construction & Engineering';

export const INDUSTRIES: IndustryType[] = [
  'All',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Manufacturing & Supply Chain',
  'Education & Research',
  'Logistics & Fleet',
  'Retail & E-commerce',
  'Construction & Engineering',
];

export type ServiceType =
  | 'All'
  | 'Cloud Modernization'
  | 'Cybersecurity & Zero Trust'
  | 'AI & Autonomous Agents'
  | 'Managed IT & Disaster Recovery'
  | 'High-Throughput Data & DevOps';

export const SERVICES: ServiceType[] = [
  'All',
  'Cloud Modernization',
  'Cybersecurity & Zero Trust',
  'AI & Autonomous Agents',
  'Managed IT & Disaster Recovery',
  'High-Throughput Data & DevOps',
];

export interface ImpactMetric {
  value: string;
  label: string;
  detail?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ClientProfile {
  name: string;
  industry: string;
  companySize: string;
  location: string;
  timeframe: string;
}

export interface PhaseStep {
  phaseNumber: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface ArchitectureFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface TechStackCategory {
  category: string;
  tools: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  clientProfile: ClientProfile;
  industry: IndustryType;
  service: ServiceType;
  tagline: string;
  summary: string;
  heroStats: ImpactMetric[];
  challenge: {
    headline: string;
    description: string;
    bulletPoints: string[];
  };
  solution: {
    headline: string;
    description: string;
    phases: PhaseStep[];
    architecturalFeatures: ArchitectureFeature[];
  };
  results: {
    headline: string;
    description: string;
    metrics: ImpactMetric[];
    businessOutcomes: string[];
  };
  testimonial: Testimonial;
  techStack: TechStackCategory[];
  relatedSlugs: string[];
  accentColor: 'blue' | 'emerald' | 'cyan' | 'indigo' | 'violet' | 'amber' | 'rose';
  abstractGraphicType: 'network' | 'cloud' | 'shield' | 'pipeline' | 'chip' | 'telemetry' | 'server';
}

export interface CaseStudyFilterState {
  searchQuery: string;
  selectedIndustry: IndustryType;
  selectedService: ServiceType;
  viewMode: 'grid' | 'list';
}
