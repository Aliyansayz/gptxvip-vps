import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Server, Activity, Users, ArrowRight } from 'lucide-react';
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

export const LoadBalancingActivity: React.FC<ChapterProps> = ({
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
  const [servers, setServers] = useState([
    { id: 1, connections: 0, capacity: 10 },
    { id: 2, connections: 0, capacity: 10 },
    { id: 3, connections: 0, capacity: 10 },
  ]);
  const [algorithm, setAlgorithm] = useState<'round-robin' | 'least-connections'>('round-robin');
  const [rrIndex, setRrIndex] = useState(0);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setServers([
      { id: 1, connections: 0, capacity: 10 },
      { id: 2, connections: 0, capacity: 10 },
      { id: 3, connections: 0, capacity: 10 },
    ]);
    setRrIndex(0);
  }, [step]);

  // Simulate connections closing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(s => ({
        ...s,
        connections: Math.max(0, s.connections - (Math.random() > 0.5 ? 1 : 0))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRouteRequest = () => {
    let targetIndex = 0;

    if (algorithm === 'round-robin') {
      targetIndex = rrIndex;
      setRrIndex((prev) => (prev + 1) % servers.length);
    } else {
      // least-connections
      let minConns = Infinity;
      servers.forEach((s, idx) => {
        if (s.connections < minConns) {
          minConns = s.connections;
          targetIndex = idx;
        }
      });
    }

    setServers(prev => {
      const newServers = [...prev];
      if (newServers[targetIndex].connections < newServers[targetIndex].capacity) {
        newServers[targetIndex].connections += 1;
      } else {
        toast.error(`Server ${targetIndex + 1} is overloaded!`);
      }
      return newServers;
    });
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct! Least Connections is best for varying loads.");
    } else {
      toast.error("Incorrect. Try again.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <span className="font-mono text-xs font-bold tracking-widest text-sky-400">LOAD_BALANCER</span>
        </div>
        <div className="flex gap-2">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2 py-1 outline-none"
          >
            <option value="round-robin">Round Robin</option>
            <option value="least-connections">Least Connections</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-950 text-slate-200 border-x border-b border-slate-800 rounded-b-xl p-5 flex-1 flex flex-col items-center justify-center relative">

        <div className="flex items-center justify-between w-full max-w-lg mb-8">
          {/* Client */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 mb-2">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <button
              onClick={handleRouteRequest}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded shadow-lg active:scale-95 transition-all"
            >
              Send Request
            </button>
          </div>

          <ArrowRight className="w-8 h-8 text-slate-600" />

          {/* Load Balancer */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-sky-900/40 rounded-xl flex items-center justify-center border-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Activity className="w-10 h-10 text-sky-400" />
            </div>
            <div className="text-[10px] font-mono text-sky-400 mt-2 uppercase">{algorithm}</div>
          </div>

          <ArrowRight className="w-8 h-8 text-slate-600" />

          {/* Servers */}
          <div className="flex flex-col gap-4">
            {servers.map(server => {
              const loadPercent = (server.connections / server.capacity) * 100;
              let colorClass = 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
              let barColor = 'bg-emerald-500';
              if (loadPercent > 80) {
                colorClass = 'text-rose-400 border-rose-500/50 bg-rose-500/10';
                barColor = 'bg-rose-500';
              } else if (loadPercent > 50) {
                colorClass = 'text-amber-400 border-amber-500/50 bg-amber-500/10';
                barColor = 'bg-amber-500';
              }

              return (
                <div key={server.id} className={`flex items-center gap-3 p-2 rounded-lg border ${colorClass} transition-all duration-300`}>
                  <Server className="w-6 h-6" />
                  <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span>SRV_{server.id}</span>
                      <span>{server.connections}/{server.capacity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${barColor}`} style={{ width: `${loadPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );

  const interactionContent = (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          {question.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {question.question}
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-900">
        <div className="space-y-3">
          {question.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.answer;

            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";

            if (!showResult) {
              btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300";
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

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    summary: question.real_world_analogy || undefined,
    visual_element: 'grocery-checkout'
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

export default LoadBalancingActivity;
