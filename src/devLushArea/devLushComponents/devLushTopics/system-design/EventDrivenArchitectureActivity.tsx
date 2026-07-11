import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Activity, Send, Users, ArrowRightLeft } from 'lucide-react';
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

export const EventDrivenArchitectureActivity: React.FC<ChapterProps> = ({
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
  const [messages, setMessages] = useState<{ id: number, key: string, partition: number }[]>([]);
  const [consumers, setConsumers] = useState([
    { id: 1, active: true, partitionAssigned: [0, 1] },
    { id: 2, active: true, partitionAssigned: [2] },
  ]);
  const [messageCount, setMessageCount] = useState(0);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setMessages([]);
    setConsumers([
      { id: 1, active: true, partitionAssigned: [0, 1] },
      { id: 2, active: true, partitionAssigned: [2] },
    ]);
    setMessageCount(0);
  }, [step]);

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before continuing.");
      return;
    }
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct! Routing keys ensure ordered processing per entity.");
    } else {
      toast.error("Incorrect. Try reviewing the theory section again.");
    }
  };

  const publishMessage = (routingKey: string) => {
    // Hash routing key to find partition (0, 1, or 2)
    let hash = 0;
    for (let i = 0; i < routingKey.length; i++) {
      hash = routingKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    const partition = Math.abs(hash) % 3;

    const newMessage = { id: messageCount, key: routingKey, partition };

    setMessages(prev => {
      const next = [...prev, newMessage];
      // keep only last 9 messages to fit in UI
      if (next.length > 9) return next.slice(next.length - 9);
      return next;
    });
    setMessageCount(c => c + 1);
  };

  const toggleConsumer = (id: number) => {
    setConsumers(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, active: !c.active } : c);

      // Rebalance partitions (0, 1, 2)
      const activeCount = updated.filter(c => c.active).length;
      if (activeCount === 0) {
        return updated.map(c => ({ ...c, partitionAssigned: [] }));
      }

      let pIdx = 0;
      return updated.map(c => {
        if (!c.active) return { ...c, partitionAssigned: [] };
        const assigned = [];
        // Simple round-robin assignment simulation for 3 partitions
        // Just a basic mock for visual representation
        if (activeCount === 1) {
          assigned.push(0, 1, 2);
        } else if (activeCount === 2) {
          if (pIdx === 0) assigned.push(0, 1);
          else assigned.push(2);
          pIdx++;
        } else if (activeCount === 3) {
          assigned.push(pIdx);
          pIdx++;
        }
        return { ...c, partitionAssigned: assigned };
      });
    });
  };

  const addConsumer = () => {
    if (consumers.length >= 3) return;
    const newId = consumers.length + 1;
    setConsumers(prev => {
      const updated = [...prev, { id: newId, active: true, partitionAssigned: [] }];
      // Rebalance manually here for demo simplicity
      const activeCount = updated.filter(c => c.active).length;
      let pIdx = 0;
      return updated.map(c => {
        if (!c.active) return { ...c, partitionAssigned: [] };
        const assigned = [];
        if (activeCount === 1) assigned.push(0, 1, 2);
        else if (activeCount === 2) {
          if (pIdx === 0) assigned.push(0, 1);
          else assigned.push(2);
          pIdx++;
        } else if (activeCount === 3) {
          assigned.push(pIdx);
          pIdx++;
        }
        return { ...c, partitionAssigned: assigned };
      });
    });
  }

  const visualContent = (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col z-10 mt-8">
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300 font-bold tracking-widest">MESSAGE BROKER</span>
          </div>
          <button onClick={addConsumer} disabled={consumers.length >= 3} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded disabled:opacity-50">Add Consumer</button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Publish (Producer)</div>
              <div className="flex gap-2">
                <button onClick={() => publishMessage("User_A")} className="flex-1 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 text-blue-400 text-xs py-1.5 rounded flex items-center justify-center gap-1">User A <Send className="w-3 h-3" /></button>
                <button onClick={() => publishMessage("User_B")} className="flex-1 bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-400 text-xs py-1.5 rounded flex items-center justify-center gap-1">User B <Send className="w-3 h-3" /></button>
                <button onClick={() => publishMessage("User_C")} className="flex-1 bg-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-600/40 text-emerald-400 text-xs py-1.5 rounded flex items-center justify-center gap-1">User C <Send className="w-3 h-3" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 relative">
            {/* Partitions */}
            {[0, 1, 2].map(partition => (
              <div key={partition} className="bg-slate-950 border border-slate-800 rounded-lg p-2 h-32 flex flex-col">
                <div className="text-[10px] text-slate-500 text-center border-b border-slate-800 pb-1 mb-2">Partition {partition}</div>
                <div className="flex-1 overflow-hidden flex flex-col gap-1">
                  {messages.filter(m => m.partition === partition).map(m => (
                    <div key={m.id} className={`text-[10px] px-2 py-1 rounded text-center truncate ${m.key === 'User_A' ? 'bg-blue-900/50 text-blue-400' : m.key === 'User_B' ? 'bg-amber-900/50 text-amber-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                      Msg: {m.key}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Consumer Group</div>
            <div className="flex gap-4 justify-center">
              {consumers.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleConsumer(c.id)}
                  className={`flex-1 max-w-[120px] p-3 rounded-xl border transition-all ${c.active ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-900 border-slate-700 opacity-50 grayscale'}`}
                >
                  <div className="text-xs font-bold text-slate-200 text-center mb-2">Consumer {c.id}</div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {c.partitionAssigned.map(p => (
                      <span key={p} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 rounded">P{p}</span>
                    ))}
                    {c.partitionAssigned.length === 0 && <span className="text-[10px] text-rose-400 italic">Idle</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
      {question.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {question.question}
        </h4>
      )}
      <div className="grid grid-cols-1 gap-3">
        {question.options?.map((opt: string, i: number) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => {
                if (showResult) return;
                setSelectedAnswer(opt);
              }}
              disabled={showResult}
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : isSelected ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65') : isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.01]' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end items-center gap-4 pt-2">
        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                <CheckCircle className="w-4 h-4" /> Correct Analysis
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
                <XCircle className="w-4 h-4" /> Try Reviewing Theory
              </span>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Interactive Review:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy
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

export default EventDrivenArchitectureActivity;
