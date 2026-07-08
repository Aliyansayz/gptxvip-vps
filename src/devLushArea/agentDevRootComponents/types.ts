
import type React from 'react';

export interface CriticalConcept {
    concept: string;
    elaboration?: string;
    definition?: string;
}

export interface WrongAnswerFeedback {
    option: string;
    feedback: string;
}

export interface Theory {
    title: string;
    content: string;
    analogy?: string;
    application?: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
    id?: string;
    componentId: string;
    concept_tested: string;
    title: string;
    prompt: string;
    question: string;
    answer: string;
    tags?: string[];
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    wrong_answer_feedback?: WrongAnswerFeedback[];
    generic_wrong_answer_feedback?: string;
    theory?: Theory;
    type?: 'simulation' | 'pyramid' | 'build' | 'punnett' | 'identify' | 'select' | 'drag-and-drop-sequence' | 'interactive-visual' | 'dose-response' | 'path' | 'slider' | 'drug-sim' | 'graph-analysis' | 'process-visual' | 'diagnosis' | 'visual-toggle' | 'analysis' | 'overview' | 'drag-drop' | 'gram-stain' | 'crispr' | 'walkthrough' | 'interactive';
    items?: string[];
    correctOrder?: string[];
    correctPath?: string[];
    targetStage?: string;
    difficulty?: Difficulty;
    // Specific props for certain exercise types
    minTherapeutic?: number;
    maxTherapeutic?: number;
    toxicThreshold?: number;
    patient?: any;
    vitals?: any;
    tests?: any;
    results?: any;
    pattern?: string;
    rate?: number;
    // devLush specific fields
    logs?: Array<{ timestamp: string; level: 'info' | 'warn' | 'error' | 'success'; message: string }>;
    nature?: 'feature' | 'pain_point' | 'weakness';
    perspective?: 'developer_perspective' | 'business_perspective' | 'security_perspective';
    theory_explanation?: string;
    real_world_analogy?: string;
}

export interface LabData {
    course: string;
    roadmap?: number;
    chapter_title: string;
    labComponentId: string;
    levelId?: string;
    critical_concepts: CriticalConcept[];
    interactive_questions: Exercise[];
    difficulty?: Difficulty;
    tags?: string[];
    theory_content?: {
        title: string;
        content: string;
    };
}

export interface ConceptCourse {
    id: string;
    roadmap?: number;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    longDescription: string;
}
