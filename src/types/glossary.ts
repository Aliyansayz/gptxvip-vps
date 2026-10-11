export interface VisualContext {
  type: string;
  prompt: string;
  description: string;
}

export interface TermDefinition {
  id: string;
  term: string;
  subheading?: string;
  definition: string;
  points?: string[];
  example?: string;
  visualContext?: VisualContext;
}
