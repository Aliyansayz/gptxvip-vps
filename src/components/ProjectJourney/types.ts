export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export interface JourneyNode {
  id: string;
  phase: number;
  progress: number;
  position: {
    x_percent: number;
    y_percent: number;
  };
  title: string;
  description: string;
  type: string;
  details?: PhaseDetail[];
}

export interface JourneyStatusMap {
  max: number;
  text: string;
}

export interface PhaseDetailContent {
  type: string;
  sentences?: string[];
  items?: string[];
}

export interface PhaseDetail {
  id: string;
  title: string;
  icon: string;
  content: PhaseDetailContent[];
}

export interface ProjectJourneyData {
  app: {
    title: string;
    subtitle: string;
  };
  canvas: {
    width: number;
    height: number;
    camera_scale: number;
  };
  path: {
    svg_path: string;
    track_width: number;
  };
  nodes: JourneyNode[];
  status_mapping: JourneyStatusMap[];
}

