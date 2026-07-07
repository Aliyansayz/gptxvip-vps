import React, { useState, useEffect } from "react";
import { Bot, User, CheckCircle, XCircle, ShieldAlert, Check, X, AlertTriangle } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentHumanInTheLoopActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [workflowState, setWorkflowState] = useState<'idle' | 'proposing' | 'waiting' | 'approved' | 'rejected'>('idle');

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setWorkflowState('idle');
    setSelected(null);
    setIsChecked(false);
  }, [step]);

  const handleCheck = () => {
      if (!selected) return;
      const correct = selected === question.answer;
      setIsChecked(true);
      if(correct) toast.success("Correct Answer!");
      else toast.error("Incorrect Answer.");
  };

  const startWorkflow = () => {
    setWorkflowState('proposing');
    setTimeout(() => {
      setWorkflowState('waiting');
    }, 2000);
  };

  const handleApprove = () => {
    setWorkflowState('approved');
    toast.success("Action Approved and Executed.");
  };

  const handleReject = () => {
    setWorkflowState('rejected');
    toast.error("Action Rejected. Agent halted.");
  };

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
        <DevLushTheoryBridge item={{ labId: 'agentTypes', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  const InteractionContent = (
      <div className="space-y-6">
          {question.question && (
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {question.question}
              </h4>
          )}
          <div className="grid grid-cols-1 gap-3">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`text-left p-3 rounded-lg border text-sm font-medium transition-colors ${selected === opt ? 'bg-amber-500 text-slate-900 border-amber-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-end">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                  Verify Architecture
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${selected === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/30 text-rose-700 dark:text-rose-400'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Correct Analysis' : 'Review Concept'}
                  </div>
                  <p>{question.explanation}</p>
              </div>
          )}
      </div>
  );

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
           
           <div className="absolute top-4 left-4 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-amber-500" />
             <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">HITL GATEWAY</span>
           </div>

           <div className="w-full max-w-lg z-10 flex flex-col gap-6">
                 
                 {/* Initial state */}
                 {workflowState === 'idle' && (
                    <div className="text-center">
                       <button 
                         onClick={startWorkflow}
                         className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
                       >
                         <Bot className="w-5 h-5" /> Start Agent Task (Process Refund)
                       </button>
                    </div>
                 )}

                 {/* Processing */}
                 {workflowState === 'proposing' && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col items-center justify-center gap-3 animate-in fade-in">
                       <Bot className="w-8 h-8 text-indigo-500 animate-pulse" />
                       <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">Agent analyzing account & drafting refund...</div>
                    </div>
                 )}

                 {/* Waiting for approval */}
                 {(workflowState === 'waiting' || workflowState === 'approved' || workflowState === 'rejected') && (
                    <div className="bg-white dark:bg-slate-800 border border-amber-500/50 p-5 rounded-xl shadow-lg animate-in zoom-in-95">
                       <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-4">
                         <AlertTriangle className="w-5 h-5" /> HUMAN AUTHORIZATION REQUIRED
                       </div>
                       
                       <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-6 border border-slate-200 dark:border-slate-700">
                          <div className="text-slate-500 text-[10px] uppercase">Proposed Action</div>
                          <div><span className="text-indigo-600 dark:text-indigo-400">Function:</span> execute_stripe_refund</div>
                          <div><span className="text-indigo-600 dark:text-indigo-400">Amount:</span> $1,250.00</div>
                          <div><span className="text-indigo-600 dark:text-indigo-400">Account:</span> usr_89231</div>
                          <div><span className="text-indigo-600 dark:text-indigo-400">Reason:</span> "Customer requested full cancellation"</div>
                       </div>

                       {workflowState === 'waiting' ? (
                          <div className="flex gap-3">
                            <button 
                              onClick={handleApprove}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button 
                              onClick={handleReject}
                              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          </div>
                       ) : workflowState === 'approved' ? (
                          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center gap-2">
                             <CheckCircle className="w-5 h-5" /> Action Executed Successfully
                          </div>
                       ) : (
                          <div className="text-center p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold rounded-lg border border-rose-200 dark:border-rose-500/30 flex items-center justify-center gap-2">
                             <XCircle className="w-5 h-5" /> Action Cancelled by Human
                          </div>
                       )}
                    </div>
                 )}
                 
                 {workflowState !== 'idle' && (
                    <div className="flex justify-center mt-2">
                       <button onClick={() => setWorkflowState('idle')} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline transition-colors">Reset Scenario</button>
                    </div>
                 )}

           </div>
        </div>
      }
      interactionContent={InteractionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default AgentHumanInTheLoopActivity;
