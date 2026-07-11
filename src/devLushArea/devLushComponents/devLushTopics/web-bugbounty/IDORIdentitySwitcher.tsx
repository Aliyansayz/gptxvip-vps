import React, { useState } from 'react';
import { Database, User, ShieldAlert, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Exercise } from '../../devLushTypes';

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


const IDORIdentitySwitcherContent = () => {
  const [requestedId, setRequestedId] = useState('1001');
  const [defense, setDefense] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'success' | 'blocked'>('idle');

  const handleFetch = () => {
    setStatus('fetching');
    setTimeout(() => {
      if (defense === 'secure' && requestedId !== '1001') {
        setStatus('blocked');
      } else {
        setStatus('success');
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">API Request Builder</h3>
          <div className="bg-gray-950 p-3 rounded border border-gray-800 mb-3 font-mono text-sm flex items-center">
            <span className="text-blue-400 mr-2">GET</span>
            <span className="text-gray-400">/api/user/</span>
            <input
              type="text"
              value={requestedId}
              onChange={(e) => { setRequestedId(e.target.value); setStatus('idle'); }}
              className="bg-transparent border-b border-gray-600 text-amber-400 w-16 focus:outline-none focus:border-amber-400 px-1"
            />
            <span className="text-gray-400">/receipts</span>
          </div>
          <button
            onClick={handleFetch}
            disabled={status === 'fetching'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50"
          >
            Send Request
          </button>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Authorization Layer</h3>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'vulnerable' ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'vulnerable'} onChange={() => { setDefense('vulnerable'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">No Object-Level Auth (IDOR)</div>
                <div className="text-xs text-gray-500">Trusts the requested ID implicitly.</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'secure' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'secure'} onChange={() => { setDefense('secure'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">Object-Level Authorization</div>
                <div className="text-xs text-gray-500">Verifies owner ID matches Session ID.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 relative overflow-hidden min-h-[300px] flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex flex-col items-center justify-center">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-gray-300">User Session</span>
          <span className="text-[10px] text-gray-500 px-2 py-1 bg-gray-900 rounded border border-gray-800">ID: 1001</span>
        </div>

        <div className="flex-1 h-px bg-gray-800 relative z-0 mx-4">
          {status === 'fetching' && (
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: defense === 'secure' && requestedId !== '1001' ? "50%" : "100%" }}
              transition={{ duration: defense === 'secure' && requestedId !== '1001' ? 0.75 : 1.5, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
            />
          )}
          {status === 'success' && (
            <motion.div
              initial={{ left: "100%" }}
              animate={{ left: 0 }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"
            />
          )}
        </div>

        {defense === 'secure' && (
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${status === 'blocked' ? 'bg-red-900 border-red-500 text-red-500' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-950 px-1">Auth Gate</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-16 h-16 bg-indigo-950 border border-indigo-800 rounded-lg flex items-center justify-center">
            <Database className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-indigo-300">Database</span>
          <span className="text-[10px] text-gray-500">Receipts</span>
        </div>

        <AnimatePresence>
          {status === 'blocked' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-red-950 border border-red-800 text-red-400 p-3 rounded shadow-lg text-sm font-medium z-20 flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Access Denied (403)</div>
              <div className="text-xs opacity-80 font-mono">Session (1001) !== Resource ({requestedId})</div>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/4 bg-emerald-950 border border-emerald-800 text-emerald-400 p-3 rounded shadow-lg text-sm font-medium z-20 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Data Retrieved
              </div>
              <div className="text-xs opacity-80">
                {requestedId === '1001' ? 'Your receipts fetched successfully.' : `Victim's (${requestedId}) private receipts exposed!`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


export default function IDORIdentitySwitcher(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <IDORIdentitySwitcherContent />;

  const question = props.exercises[props.step];
  if (!question) return <IDORIdentitySwitcherContent />;

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
      exerciseContent={<IDORIdentitySwitcherContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}
