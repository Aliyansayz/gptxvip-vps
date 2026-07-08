import React, { useState, useEffect } from 'react';
export interface MorphologyExercise {
  title: string;
  prompt: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  theory?: any;
  theory_explanation?: string;
  real_world_analogy?: string;
}
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { LabSettings } from '../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../devLushTopicsView/DevLushLayout';
import { DevLushTheoryBridge } from '../devLushTopicsView/DevLushTheoryBridge';
import SaveTheoryButton from '../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { renderTopology } from './DevLushSVGLibrary';

interface ChapterProps {
  step: number;
  exercises: MorphologyExercise[] | any[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const DevLushMorphologyChallenge: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercise = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    const correct = answer === exercise.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct selection! Excellent observation.");
    } else {
      toast.error("Incorrect morphology identified.");
    }
  };

  if (!exercise) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-xl flex items-center justify-center border-red-500 border-2">
        <p className="text-xl text-red-500 font-bold">Error: Visual Challenge Data is missing.</p>
      </div>
    );
  }

  // Map natural language string options to SVG type IDs
  const getTopologyType = (option: string) => {
    const lower = option.toLowerCase();
    // System Design
    if (lower.includes('monolith')) return 'arch-monolith';
    if (lower.includes('microservice')) return 'arch-microservices';
    if (lower.includes('event')) return 'arch-event-driven';
    if (lower.includes('serverless')) return 'arch-serverless';

    // Cybersecurity
    if (lower.includes('ddos')) return 'attack-ddos';
    if (lower.includes('man') && lower.includes('middle')) return 'attack-mitm';
    if (lower.includes('dmz')) return 'defense-dmz';
    if (lower.includes('zero') && lower.includes('trust')) return 'defense-zero-trust';

    // Agent Types
    if (lower.includes('sequential') || lower.includes('chain')) return 'agent-sequential';
    if (lower.includes('hierarchical')) return 'agent-hierarchical';
    if (lower.includes('evaluator') || lower.includes('loop')) return 'agent-evaluator';
    if (lower.includes('swarm')) return 'agent-swarm';

    return 'unknown';
  };

  const renderOptionVisual = (optionName: string) => {
    const topologyType = getTopologyType(optionName);
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-2 drop-shadow-md">
        {renderTopology({ id: optionName, type: topologyType })}
      </svg>
    );
  };

  const VisualContent = (
    <div className="w-full space-y-4">
      <div className="text-center p-6 bg-muted/30 rounded-xl border border-dashed border-border mb-4">
        <p className="text-muted-foreground italic text-lg">
          Examine the architectural / topology blueprints below and select the correct visual model corresponding to the requested engineering paradigm.
        </p>
      </div>
    </div>
  );

  const InteractionContent = (
    <div className="space-y-4">
      <p className="font-semibold text-lg">{exercise.question}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {exercise.options?.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={showResult}
            className={`w-full flex flex-col items-center justify-center text-center p-4 rounded-xl border-2 transition-all min-h-[140px] ${
              selectedAnswer === option
                ? showResult
                  ? isCorrect
                    ? 'bg-green-500/10 border-green-500 shadow-md'
                    : 'bg-red-500/10 border-red-500 shadow-md'
                  : 'bg-indigo-500/10 border-indigo-500 shadow-md scale-[1.02]'
                : 'bg-card border-border hover:border-indigo-500/50'
            } ${showResult && option === exercise.answer ? 'border-green-500 bg-green-500/10' : ''} ${
              showResult ? 'cursor-not-allowed opacity-90' : ''
            }`}
          >
            {renderOptionVisual(option)}
            <span className="font-medium text-xs mt-2 block px-2 leading-snug">{option}</span>
          </button>
        ))}
      </div>

      {showResult && (
        <div className={`p-4 mt-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}
          <div>
            <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
              {isCorrect ? 'Architecture Verified!' : 'Incorrect Topology Identified'}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );

  const theoryData = exercise.theory || (exercise.theory_explanation ? {
    title: exercise.title || "Topology Concept",
    content: exercise.theory_explanation,
    analogy: exercise.real_world_analogy
  } : null);

  const TheoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'morphology-challenge', exerciseTitle: exercise.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  return (
    <DevLushLayout
      title={exercise.title}
      prompt={exercise.prompt}
      visualContent={VisualContent}
      interactionContent={InteractionContent}
      theoryContent={TheoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default DevLushMorphologyChallenge;
