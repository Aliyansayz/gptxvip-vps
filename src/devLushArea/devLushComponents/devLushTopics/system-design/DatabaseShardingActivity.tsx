import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Database, Server, Zap, ArrowRight, ServerCrash } from 'lucide-react';
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

export const DatabaseShardingActivity: React.FC<ChapterProps> = ({ 
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
  const [keyInput, setKeyInput] = useState("");
  const [shards, setShards] = useState([
    { id: 0, status: 'leader', leaderOf: null, data: [] as string[] },
    { id: 1, status: 'leader', leaderOf: null, data: [] as string[] },
    { id: 2, status: 'leader', leaderOf: null, data: [] as string[] },
    { id: 3, status: 'follower', leaderOf: 0, data: [] as string[] },
  ]);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setKeyInput("");
    setShards([
      { id: 0, status: 'leader', leaderOf: null, data: [] },
      { id: 1, status: 'leader', leaderOf: null, data: [] },
      { id: 2, status: 'leader', leaderOf: null, data: [] },
      { id: 3, status: 'follower', leaderOf: 0, data: [] },
    ]);
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
      toast.success("Correct! Hash-based sharding is ideal for uniform distribution.");
    } else {
      toast.error("Incorrect. Try reviewing the theory section again.");
    }
  };

  const hashKey = (key: string) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const insertData = () => {
    if (!keyInput.trim()) return;
    
    // Determine active shards (leaders only)
    const activeLeaders = shards.filter(s => s.status === 'leader');
    if (activeLeaders.length === 0) return;

    // Hash to find shard index
    const shardIndex = hashKey(keyInput) % 3; // Modulo 3 since there are originally 3 leaders
    
    // Find the current leader responsible for this partition (0, 1, or 2)
    // If a leader fails, its follower takes over
    let targetShard = shards.find(s => s.id === shardIndex && s.status === 'leader');
    if (!targetShard) {
      targetShard = shards.find(s => s.leaderOf === shardIndex && s.status === 'leader');
    }

    if (targetShard) {
      setShards(prev => prev.map(s => {
        if (s.id === targetShard?.id) {
          return { ...s, data: [...s.data, keyInput].slice(-3) };
        }
        // Also replicate to followers of this shard
        if (s.status === 'follower' && s.leaderOf === (targetShard?.leaderOf !== null ? targetShard?.leaderOf : targetShard?.id)) {
           return { ...s, data: [...s.data, keyInput].slice(-3) };
        }
        return s;
      }));
    }
    setKeyInput("");
  };

  const toggleNodeStatus = (id: number) => {
    setShards(prev => {
      const node = prev.find(s => s.id === id);
      if (!node) return prev;
      
      let newShards = [...prev];
      
      if (node.status === 'leader') {
         // Fail the leader
         newShards = newShards.map(s => s.id === id ? { ...s, status: 'failed' } : s);
         // Promote follower if exists
         newShards = newShards.map(s => (s.status === 'follower' && s.leaderOf === id) ? { ...s, status: 'leader' } : s);
      } else if (node.status === 'failed') {
         // Recover the node
         // If a follower had taken over, this recovered node becomes a follower
         const currentLeader = newShards.find(s => s.status === 'leader' && s.leaderOf === id);
         if (currentLeader) {
            newShards = newShards.map(s => s.id === id ? { ...s, status: 'follower', leaderOf: id, data: currentLeader.data } : s);
         } else {
            newShards = newShards.map(s => s.id === id ? { ...s, status: 'leader' } : s);
         }
      }
      return newShards;
    });
  };

  const visualContent = (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col z-10 mt-8">
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
           <Database className="w-4 h-4 text-emerald-400" />
           <span className="text-xs font-mono text-slate-300 font-bold tracking-widest">SHARDING VISUALIZER</span>
        </div>
        
        <div className="p-6">
          <div className="flex gap-3 mb-8 items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">DATA ENTRY:</span>
            <input 
              type="text" 
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && insertData()}
              placeholder="e.g. user_123"
              className="flex-1 bg-slate-800 border border-slate-600 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 text-sm font-mono"
            />
            <button 
              onClick={insertData}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Insert <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Shard 0 (With Follower) */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Partition 0</div>
              <div className="flex flex-col gap-3 items-center">
                 {shards.filter(s => s.id === 0 || s.leaderOf === 0).map(shard => (
                   <button 
                     key={shard.id}
                     onClick={() => toggleNodeStatus(shard.id)}
                     className={`w-full max-w-[200px] p-3 rounded-xl border transition-all ${shard.status === 'leader' ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : shard.status === 'follower' ? 'bg-slate-800 border-slate-600 border-dashed' : 'bg-rose-950/30 border-rose-500/50 grayscale opacity-60'}`}
                   >
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold text-white flex items-center gap-1.5">
                         {shard.status === 'failed' ? <ServerCrash className="w-3.5 h-3.5 text-rose-400"/> : <Server className={`w-3.5 h-3.5 ${shard.status === 'leader' ? 'text-indigo-400' : 'text-slate-400'}`}/>}
                         Node {shard.id}
                       </span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${shard.status === 'leader' ? 'bg-indigo-500 text-white' : shard.status === 'follower' ? 'bg-slate-700 text-slate-300' : 'bg-rose-500 text-white'}`}>
                         {shard.status}
                       </span>
                     </div>
                     <div className="h-16 bg-slate-950 rounded flex flex-col items-center justify-center gap-1 overflow-hidden p-1 border border-slate-800">
                       {shard.data.map((d, i) => (
                         <div key={i} className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 rounded-sm border border-emerald-900/50">{d}</div>
                       ))}
                       {shard.data.length === 0 && <span className="text-[10px] text-slate-600 italic">Empty</span>}
                     </div>
                   </button>
                 ))}
              </div>
            </div>

            {/* Shard 1 & 2 */}
            <div className="grid grid-rows-2 gap-6">
              {[1, 2].map(id => {
                const shard = shards.find(s => s.id === id)!;
                return (
                  <div key={id} className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Partition {id}</div>
                    <button 
                       onClick={() => toggleNodeStatus(shard.id)}
                       className={`w-full mx-auto max-w-[200px] p-3 rounded-xl border transition-all block ${shard.status === 'leader' ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-rose-950/30 border-rose-500/50 grayscale opacity-60'}`}
                     >
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-white flex items-center gap-1.5">
                           {shard.status === 'failed' ? <ServerCrash className="w-3.5 h-3.5 text-rose-400"/> : <Server className="w-3.5 h-3.5 text-indigo-400"/>}
                           Node {shard.id}
                         </span>
                         <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${shard.status === 'leader' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white'}`}>
                           {shard.status}
                         </span>
                       </div>
                       <div className="h-16 bg-slate-950 rounded flex flex-col items-center justify-center gap-1 overflow-hidden p-1 border border-slate-800">
                         {shard.data.map((d, i) => (
                           <div key={i} className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 rounded-sm border border-emerald-900/50">{d}</div>
                         ))}
                         {shard.data.length === 0 && <span className="text-[10px] text-slate-600 italic">Empty</span>}
                       </div>
                     </button>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-center mt-4">
             <span className="text-[10px] text-slate-500 uppercase tracking-wider"><Zap className="w-3 h-3 inline text-amber-500"/> Click a node to simulate failure/recovery</span>
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
            Verify Architecture
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

export default DatabaseShardingActivity;
