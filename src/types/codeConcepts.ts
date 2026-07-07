export interface CriticalConcept {
  concept: string;
  elaboration: string;
  visual_prompt?: string;
  visual_interactive_prompt?: string;
  componentId?: string;
}

export interface BaseInteractiveQuestion {
  componentId: string;
  type: "mcq" | "drag_and_drop" | "custom" | string;
  difficulty?: "basic" | "intermediate" | "advanced";
  concept_tested: string;
  title: string;
  question: string;
  prompt?: string;
  visual_prompt?: string;
  visual_interactive_prompt?: string;
  explanation: string;
  theory?: any;
  wrong_answer_feedback?: any[];
}

export interface MCQOption {
  text: string;
  isSnippet?: boolean;
  isCorrect?: boolean;
  reasoning?: string;
}

export interface MCQQuestion extends BaseInteractiveQuestion {
  type: "mcq";
  answer: string;
  options: (string | MCQOption)[];
}

export interface DragAndDropPair {
  type?: string;
  operator?: string;
  example?: string;
  meaning?: string;
  [key: string]: string | undefined;
}

export interface DragAndDropQuestion extends BaseInteractiveQuestion {
  type: "drag_and_drop";
  draggable_items?: string[];
  correct_order?: string[];
  pairs?: DragAndDropPair[];
}

export interface CodeCompletionQuestion extends BaseInteractiveQuestion {
  type: "code_completion";
  code_template: string;
  correct_mappings: Record<string, string>;
  draggable_items: string[];
}

export interface OverviewQuestion extends BaseInteractiveQuestion {
  type: "overview";
}

export interface CustomQuestion extends BaseInteractiveQuestion {
  type: "custom";
}

export interface WalkthroughMCQOption {
  text: string;
  isCorrect: boolean;
  reasoning: string;
}

export interface WalkthroughStepMCQ {
  question: string;
  options: WalkthroughMCQOption[];
}

export interface WalkthroughStep {
  range: number[];
  title: string;
  description: string;
  mcq?: WalkthroughStepMCQ;
}

export interface ScrollCodeWalkthroughQuestion extends BaseInteractiveQuestion {
  type: "scroll_code_walkthrough";
  codeSnippet: string;
  steps: WalkthroughStep[];
}

export interface SimulationRunnerQuestion extends BaseInteractiveQuestion {
  type: "simulation_runner";
  simulation_config?: any;
}

export interface CircuitNode {
  id: string;
  label: string;
  description: string;
  expectedBlock: string;
  x: number;
  y: number;
}

export interface CircuitBlock {
  id: string;
  label: string;
  code: string;
  type: string;
}

export interface CircuitBoardQuestion extends BaseInteractiveQuestion {
  type: "circuit_board";
  nodes: CircuitNode[];
  blocks: CircuitBlock[];
}

export interface VisualPoweredQuestion extends BaseInteractiveQuestion {
  type: "visual_powered_activity";
  options?: string[];
  answer?: string;
  wrong_answer_feedback?: { option: string; feedback: string }[];
}

export interface SubQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  wrong_answer_feedback?: { option: string; feedback: string }[];
}

export interface CodeExplainerPlusVisualizerQuestion extends BaseInteractiveQuestion {
  type: "code_explainer_plus_visualizer";
  questions?: SubQuestion[];
  options?: string[];
  answer?: string;
  wrong_answer_feedback?: { option: string; feedback: string }[];
  codeBlocks?: { [action: string]: { id: number; text: string }[] };
  visualType?: "ring_buffer" | string;
}

export interface HFTJourneyExplainerClass {
  name: string;
  snippet?: string;
  desc?: string;
}

export interface HFTJourneyExplainerNode {
  id: number;
  title: string;
  desc: string;
  phase?: string;
  x: number;
  y: number;
  isStart?: boolean;
  isFinish?: boolean;
  classes?: HFTJourneyExplainerClass[];
}

export interface HFTJourneyExplainerQuestion extends BaseInteractiveQuestion {
  type: "hft_journey_explainer";
  nodes: HFTJourneyExplainerNode[];
}

export interface DragDropCodeSnippet {
  id: string;
  title: string;
  template: string; // e.g., "template <[[SLOT1]] T> \n T add(T a, T b) { return [[SLOT2]]; }"
  correct_mappings: Record<string, string>; // { "SLOT1": "typename", "SLOT2": "a + b" }
  draggable_items: string[];
  explanation?: string;
  code_reasoning?: string;
  correct_code?: string;
}

export interface CodeExplainerDragDropQuestion extends BaseInteractiveQuestion {
  type: "code_explainer_drag_drop";
  explanation_steps: {
    code: string;
    description: string;
  }[];
  snippets: DragDropCodeSnippet[];
}

export interface CodeRewriterTypingSnippet {
  id: string;
  title: string;
  code: string; // The complete correct code that needs to be typed
  explanation?: string;
  code_reasoning?: string;
  line_explanations?: {
    line_number: number;
    explanation: string;
  }[];
}

export interface CodeRewriterByTypingQuestion extends BaseInteractiveQuestion {
  type: "code_rewriter_by_typing";
  explanation_steps?: {
    code: string;
    description: string;
  }[];
  snippets: CodeRewriterTypingSnippet[];
}

export interface AnalogySplit {
  description: string;
  analogy_title?: string;
  analogy_description?: string;
}

export interface AnalogyStep {
  code: string;
  description: string;
  analogy_title?: string;
  analogy_description?: string;
  splits?: AnalogySplit[];
}

export interface ProductionUsecaseMCQ {
  id: string;
  question: string;
  prompt?: string;
  options: MCQOption[];
  answer: string;
  explanation?: string;
}

export interface CodeExplainerProductionAnalogyQuestion extends BaseInteractiveQuestion {
  type: "code_explainer_production_analogy";
  production_usecase: {
    title: string;
    description: string;
    system_architecture_note?: string;
  };
  explanation_steps: AnalogyStep[];
  mcqs: ProductionUsecaseMCQ[];
  code_snippet_complete?: string;
  glossary?: { term: string; definition: string }[];
}

export type InteractiveQuestion = MCQQuestion | DragAndDropQuestion | CodeCompletionQuestion | OverviewQuestion | CustomQuestion | ScrollCodeWalkthroughQuestion | SimulationRunnerQuestion | CircuitBoardQuestion | VisualPoweredQuestion | CodeExplainerPlusVisualizerQuestion | HFTJourneyExplainerQuestion | CodeExplainerDragDropQuestion | CodeRewriterByTypingQuestion | CodeExplainerProductionAnalogyQuestion;

export interface CodeConceptsPayload {
  course: string;
  chapter_title: string;
  critical_concepts: CriticalConcept[];
  interactive_questions: InteractiveQuestion[];
}
