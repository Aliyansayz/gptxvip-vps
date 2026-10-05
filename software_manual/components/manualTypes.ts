export interface ManualSection {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  outcome: string;
}
export interface ManualIllustration {
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  panels?: number;
  panel?: number;
}
export interface ManualDefinition {
  title: string;
  category: string;
  subtitle: string;
  introduction: string;
  highlights: string[];
  sections: ManualSection[];
  illustrations: ManualIllustration[];
}
