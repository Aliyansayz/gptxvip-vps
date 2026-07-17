import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Route, Shield, Network, Server, ArrowRight } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

type ServiceType = 'Users' | 'Products' | 'Orders';

export const ApiGatewayDesignActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Interactive visual state
  const [activeRequests, setActiveRequests] = useState<{ id: number; target: ServiceType; status: 'routing' | 'success' | 'auth-failed' }[]>([]);
  const [authEnabled, setAuthEnabled] = useState(true);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setActiveRequests([]);
  }, [step]);

  const handleSendRequest = (target: ServiceType) => {
    const newReqId = Date.now();
    setActiveRequests(prev => [...prev.slice(-4), { id: newReqId, target, status: 'routing' }]);

    setTimeout(() => {
      setActiveRequests(prev => prev.map(req => {
        if (req.id === newReqId) {
          if (authEnabled && Math.random() > 0.8) { // 20% chance auth fails if enabled
            return { ...req, status: 'auth-failed' };
          }
          return { ...req, status: 'success' };
        }
        return req;
      }));
    }, 1000);

    setTimeout(() => {
      setActiveRequests(prev => prev.filter(req => req.id !== newReqId));
    }, 3000);
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct! Primary database storage is not an API Gateway responsibility.");
    } else {
      toast.error("Incorrect. Try again.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <span className="font-mono text-xs font-bold tracking-widest text-purple-400">API_GATEWAY_ROUTER</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400 font-mono">AUTH:</span>
          <button
            onClick={() => setAuthEnabled(!authEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${authEnabled ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {authEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="bg-slate-950 text-slate-200 border-x border-b border-slate-800 rounded-b-xl p-5 flex-1 flex items-center justify-between relative overflow-hidden">

        {/* Clients */}
        <div className="flex flex-col gap-4 z-10 w-1/4">
          <div className="text-xs font-mono text-slate-400 text-center mb-2">CLIENTS</div>
          {(['Users', 'Products', 'Orders'] as ServiceType[]).map((svc) => (
            <button
              key={svc}
              onClick={() => handleSendRequest(svc)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm active:scale-95 transition-all text-sm font-medium flex items-center justify-between"
            >
              <span>Get {svc}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>

        {/* API Gateway */}
        <div className="flex flex-col items-center justify-center z-10 w-1/3">
          <div className="w-full bg-purple-900/30 border-2 border-purple-500/50 rounded-xl p-4 flex flex-col items-center relative">
            <Route className="w-8 h-8 text-purple-400 mb-2" />
            <div className="font-bold text-purple-200 tracking-wide text-sm mb-4">API GATEWAY</div>

            {/* Active Requests inside gateway */}
            <div className="flex flex-col gap-2 w-full h-24">
              {activeRequests.map(req => (
                <div key={req.id} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] font-mono flex items-center justify-between">
                  <span className="text-slate-400 truncate">Req-{req.id.toString().slice(-4)}</span>
                  {req.status === 'routing' ? (
                    <span className="text-amber-400 animate-pulse">Routing...</span>
                  ) : req.status === 'auth-failed' ? (
                    <span className="text-rose-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Denied</span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> OK</span>
                  )}
                </div>
              ))}
              {activeRequests.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 italic">
                  Idle...
                </div>
              )}
            </div>

            {/* Connection lines (css magic) */}
            <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-slate-700"></div>
            <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-slate-700"></div>
          </div>
        </div>

        {/* Microservices */}
        <div className="flex flex-col gap-4 z-10 w-1/4">
          <div className="text-xs font-mono text-slate-400 text-center mb-2">MICROSERVICES</div>
          {(['Users', 'Products', 'Orders'] as ServiceType[]).map((svc) => {
            const hasActive = activeRequests.some(r => r.target === svc && r.status === 'success');
            return (
              <div
                key={svc}
                className={`px-4 py-3 rounded-lg border flex items-center gap-3 transition-all ${hasActive ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-900 border-slate-800'
                  }`}
              >
                <Server className={`w-5 h-5 ${hasActive ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
                <span className={`text-sm font-medium ${hasActive ? 'text-indigo-200' : 'text-slate-400'}`}>{svc} API</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );

  const interactionContent = (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          {question?.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {question?.question}
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-900">
        <div className="space-y-3">
          {question?.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.answer;

            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";

            if (!showResult) {
              btnClass += "border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-slate-300";
            } else {
              if (isCorrectOption) {
                btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
              } else if (isSelected) {
                btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
              } else {
                btnClass += "border-slate-200 dark:border-slate-700 opacity-50 text-slate-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`p-4 border-t ${isCorrect
            ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30'
            : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30'
          }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
            )}
            <div>
              <h4 className={`font-bold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400/80' : 'text-rose-700 dark:text-rose-400/80'}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const theoryData = question?.theory || (question?.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    summary: question.real_world_analogy || undefined,
    visual_element: 'hotel-concierge'
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'system-design', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  if (!question) return null;

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default ApiGatewayDesignActivity;
