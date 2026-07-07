import React, { useState } from 'react';
import { Database, ShieldAlert, Code, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Exercise } from '../../../../types';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';

interface ChapterProps {
  step?: number;
  exercises?: Exercise[];
  infoVisible?: boolean;
  infoPlacement?: 'side' | 'bottom';
  settings?: LabSettings;
}


const SQLiQueryBuilderContent = () => {
  const [username, setUsername] = useState("admin' OR 1=1 --");
  const [defense, setDefense] = useState<'concatenation' | 'parameterized'>('concatenation');
  const [isExecuted, setIsExecuted] = useState(false);

  const handleExecute = () => {
    setIsExecuted(true);
  };

  const isBypassed = defense === 'concatenation' && username.includes("' OR 1=1");

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Top Pane - The Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            Authentication Portal
          </h3>
          <div className="flex flex-col gap-3 max-w-sm">
            <input 
              type="text" 
              value={username}
              onChange={(e) => { setUsername(e.target.value); setIsExecuted(false); }}
              className="bg-gray-950 border border-gray-800 rounded p-2 text-sm text-gray-300 font-mono"
              placeholder="Username"
            />
            <input 
              type="password" 
              disabled
              className="bg-gray-950/50 border border-gray-800/50 rounded p-2 text-sm text-gray-500 font-mono cursor-not-allowed"
              placeholder="Password (ignored by payload)"
            />
            <button 
              onClick={handleExecute}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Login
            </button>
          </div>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-4">
           <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Backend Architecture</h4>
           <div className="flex flex-col gap-2">
              <button
                onClick={() => { setDefense('concatenation'); setIsExecuted(false); }}
                className={`text-left p-3 rounded border text-sm transition-colors ${defense === 'concatenation' ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
              >
                <div className="font-semibold mb-1 text-red-400">Legacy Concatenation</div>
                <div className="text-xs opacity-70">Directly joins user input into SQL string.</div>
              </button>
              <button
                onClick={() => { setDefense('parameterized'); setIsExecuted(false); }}
                className={`text-left p-3 rounded border text-sm transition-colors ${defense === 'parameterized' ? 'bg-emerald-900/20 border-emerald-800 text-emerald-200' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
              >
                <div className="font-semibold mb-1 text-emerald-400">Parameterized Queries</div>
                <div className="text-xs opacity-70">Pre-compiles query structure, treats input as literal data.</div>
              </button>
           </div>
        </div>
      </div>

      {/* Middle Pane - Query Engine */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Code className="w-4 h-4 text-purple-400" />
          Live Query Constructor
        </h3>
        <div className="font-mono text-sm bg-black p-4 rounded border border-gray-900 break-all leading-relaxed">
          {defense === 'concatenation' ? (
            <>
              <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> users <span className="text-blue-400">WHERE</span> username = '<span className={username.includes("'") ? "text-red-400 bg-red-900/30" : "text-amber-300"}>{username}</span>' <span className="text-gray-600 opacity-50">AND password = '...'</span>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-gray-500">// 1. Structure Defined</span><br/>
                <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> users <span className="text-blue-400">WHERE</span> username = <span className="text-purple-400 font-bold">?</span> AND password = <span className="text-purple-400 font-bold">?</span>
              </div>
              <div className="border-t border-gray-800 pt-2 mt-1">
                <span className="text-gray-500">// 2. Data Bound Safely</span><br/>
                <span className="text-gray-400">Parameters: [</span> <span className="text-emerald-400">"{username}"</span> <span className="text-gray-400">, "***" ]</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pane - Database */}
      <div className={`border rounded-lg p-4 transition-colors duration-500 ${isExecuted && isBypassed ? 'bg-red-900/10 border-red-900/50' : 'bg-gray-900 border-gray-800'}`}>
         <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Database Execution Result
        </h3>
        
        {!isExecuted ? (
           <div className="text-gray-500 text-sm text-center py-6">Awaiting query execution...</div>
        ) : isBypassed ? (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col gap-2"
           >
             <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded text-sm font-medium flex items-center gap-2">
               <ShieldAlert className="w-4 h-4" /> Authentication Bypassed! All rows returned due to OR 1=1.
             </div>
             <div className="bg-gray-950 border border-gray-800 rounded overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                   <tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Username</th><th className="px-4 py-2">Role</th></tr>
                 </thead>
                 <tbody className="text-gray-300 font-mono">
                   <tr className="border-b border-gray-800 bg-red-900/20"><td className="px-4 py-2">1</td><td className="px-4 py-2 text-amber-400">admin</td><td className="px-4 py-2 text-red-400">Superadmin</td></tr>
                   <tr className="border-b border-gray-800 bg-red-900/10"><td className="px-4 py-2">2</td><td className="px-4 py-2 text-amber-400">alice</td><td className="px-4 py-2">User</td></tr>
                 </tbody>
               </table>
             </div>
           </motion.div>
        ) : (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 p-3 rounded text-sm font-medium flex items-center gap-2"
           >
             <CheckCircle2 className="w-4 h-4" /> Secure Failure: No user found with literal username "{username}"
           </motion.div>
        )}
      </div>
    </div>
  );
}


export default function SQLiQueryBuilder(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <SQLiQueryBuilderContent />;
  
  const question = props.exercises[props.step];
  if (!question) return <SQLiQueryBuilderContent />;

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
        <DevLushTheoryBridge item={{ labId: 'cybersecurity', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      exerciseContent={<SQLiQueryBuilderContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}
