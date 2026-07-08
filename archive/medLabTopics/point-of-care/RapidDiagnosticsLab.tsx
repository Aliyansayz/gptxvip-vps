import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { TestTubeIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { toast } from 'sonner';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { ChapterProps, TheoryPane } from './POCTShared';
import { RiverAnalogy } from './POCTVisuals';

type TestResult = {
  testName: string;
  result: 'positive' | 'negative' | 'invalid';
  controlLine: boolean;
  testLine: boolean;
};

// Extends Exercise to include specific fields for this lab
interface RapidTestExercise extends Exercise {
    testResult: TestResult;
    clinicalContext: string;
}

const TestStrip: React.FC<{ test: TestResult }> = ({ test }) => {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-4 max-w-xs mx-auto shadow-sm">
        <div className="text-xs text-center mb-3 font-bold text-slate-600 uppercase tracking-wider">{test.testName}</div>
        
        {/* Test strip visualization */}
        <div className="bg-gradient-to-b from-slate-100 to-white rounded-lg border border-slate-300 p-3 shadow-inner">
          {/* Result window */}
          <div className="bg-white border-2 border-slate-300 rounded-md h-24 relative overflow-hidden shadow-sm">
            {/* Sample well indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-200 rounded-t-full border-t border-slate-300" />
            
            {/* Test line position */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400">T</span>
              <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${test.testLine ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-slate-100'}`} />
            </div>
            
            {/* Control line position */}
            <div className="absolute top-14 left-0 right-0 flex items-center justify-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400">C</span>
              <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${test.controlLine ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-slate-100'}`} />
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-3 text-[10px] text-center text-slate-500 font-mono">
          <div className="flex justify-center gap-4">
            <span>T = Test Line</span>
            <span>C = Control Line</span>
          </div>
        </div>
      </div>
    );
};

export const RapidDiagnosticsLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step] as RapidTestExercise;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Reset when exercise changes
    useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [currentExercise]);

    const handleSelectAnswer = (answer: string) => {
        if (showResult) return;
        const correct = answer === currentExercise.answer;
        setSelectedAnswer(answer);
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Correct Interpretation!");
        else toast.error("Incorrect Interpretation");
    };

    if (!currentExercise) return null;

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Clinical Context</p>
                    <p className="text-sm text-muted-foreground">{currentExercise.clinicalContext}</p>
                </div>
            </div>

            <div className="flex justify-center p-4">
                <TestStrip test={currentExercise.testResult} />
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{currentExercise.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentExercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === option
                                ? (showResult 
                                    ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                                    : 'bg-teal-500 text-white border-teal-600 shadow-md')
                                : 'bg-card hover:bg-muted'
                        } ${showResult ? 'opacity-90 cursor-not-allowed' : ''}`}
                    >
                        <span className="font-medium">{option}</span>
                    </button>
                ))}
            </div>

            {showResult && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <div>
                        <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Correct interpretation!' : 'Not quite right'}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{currentExercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} visual={<RiverAnalogy />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
