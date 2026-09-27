import React, { useState, useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!run) {
      setCurrentStep(0);
      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.querySelector<HTMLElement>('[data-agent-workspace-back]')?.focus();
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onFinish();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [run, onFinish]);

  if (!run) return null;
  if (steps.length === 0) {
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/20 p-4">
        <div role="dialog" aria-modal="true" aria-label="Red Team Agent Tutorial" className="bg-white rounded-xl p-6 shadow-xl">
          <p role="status" className="mb-4 text-sm text-slate-700">Tutorial content is unavailable.</p>
          <button type="button" onClick={onFinish} className="min-h-11 rounded-lg bg-red-600 px-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Close tutorial</button>
        </div>
      </div>
    );
  }

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
    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px] p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="red-team-tutorial-title" className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-red-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5" />
            <h3 id="red-team-tutorial-title" className="font-bold font-heading">Red Team Training Preview</h3>
          </div>
          <button 
            ref={closeButtonRef}
            type="button"
            aria-label="Close tutorial"
            onClick={onFinish}
            className="min-h-11 min-w-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-red-700 p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-2 text-xs font-bold tracking-wider uppercase text-red-600">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h4 aria-live="polite" className="text-xl font-bold text-slate-800 mb-3">{step.title}</h4>
          <p className="text-slate-600 leading-relaxed text-sm">
            {step.content}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-4 bg-red-600' : 'w-1.5 bg-slate-300'
                }`} 
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous step"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`min-h-11 min-w-11 flex items-center justify-center p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                currentStep === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="min-h-11 flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
