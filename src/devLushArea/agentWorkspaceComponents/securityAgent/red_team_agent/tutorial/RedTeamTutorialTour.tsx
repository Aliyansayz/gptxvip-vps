import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import tutorialData from './tutorialSteps.json';

interface TutorialStep {
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface RedTeamTutorialTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function RedTeamTutorialTour({ run, onFinish }: RedTeamTutorialTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps: TutorialStep[] = tutorialData.steps as TutorialStep[];

  useEffect(() => {
    if (!run) {
      setCurrentStep(0);
    }
  }, [run]);

  if (!run) return null;

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-red-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5" />
            <h3 className="font-bold font-heading">Red Team Agent Tutorial</h3>
          </div>
          <button 
            onClick={onFinish}
            className="text-white/80 hover:text-white hover:bg-red-700 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-2 text-xs font-bold tracking-wider uppercase text-red-600">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h4>
          <p className="text-slate-600 leading-relaxed text-sm">
            {step.content}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-4 bg-red-600' : 'w-1.5 bg-slate-300'
                }`} 
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
