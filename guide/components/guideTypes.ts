export interface GuideSection {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  outcome: string;
}
export interface GuideIllustration {
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  panels?: number;
  panel?: number;
}
export interface GuideDefinition {
  title: string;
  category: string;
  subtitle: string;
  introduction: string;
  highlights: string[];
  sections: GuideSection[];
  illustrations: GuideIllustration[];
}

export type ManualSection = GuideSection;
export type ManualIllustration = GuideIllustration;
export type ManualDefinition = GuideDefinition;
