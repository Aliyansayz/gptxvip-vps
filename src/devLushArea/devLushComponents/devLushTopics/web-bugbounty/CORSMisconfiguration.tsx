import React, { useState } from 'react';
import { Globe, Server, ShieldAlert, ShieldCheck } from 'lucide-react';
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


const CORSMisconfigurationContent = () => {
  const [defense, setDefense] = useState<'wildcard' | 'strict'>('wildcard');
  const [status, setStatus] = useState<'idle' | 'preflight' | 'request' | 'success' | 'blocked'>('idle');

  const handleFetch = () => {
    if (defense === 'strict') {
      setStatus('preflight');
      setTimeout(() => {
        setStatus('blocked');
      }, 1500);
    } else {
      setStatus('request');
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Attacker Script (evil.com)</h3>
          <div className="bg-gray-950 p-3 rounded border border-gray-800 mb-3 font-mono text-xs text-gray-400">
            fetch('https://api.bank.com/userData', {'{'} <br />
            &nbsp;&nbsp;credentials: 'include' <br />
            {'}'}).then(res =&gt; res.json())
          </div>
          <button
            onClick={handleFetch}
            disabled={status !== 'idle' && status !== 'success' && status !== 'blocked'}
            className="w-full px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 border border-red-700 rounded text-sm font-medium disabled:opacity-50"
          >
            Execute Cross-Origin Fetch
          </button>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">API Server CORS Policy</h3>
          <div className="flex flex-col gap-2">
            <label className={`flex flex-col gap-1 p-2 rounded cursor-pointer border ${defense === 'wildcard' ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" checked={defense === 'wildcard'} onChange={() => { setDefense('wildcard'); setStatus('idle'); }} />
                <div className="text-sm font-medium text-gray-200">Misconfigured (Wildcard/Echo)</div>
              </div>
              <div className="text-xs text-red-400 font-mono ml-6">Access-Control-Allow-Origin: *</div>
            </label>
            <label className={`flex flex-col gap-1 p-2 rounded cursor-pointer border ${defense === 'strict' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" checked={defense === 'strict'} onChange={() => { setDefense('strict'); setStatus('idle'); }} />
                <div className="text-sm font-medium text-gray-200">Strict Allowlist</div>
              </div>
              <div className="text-xs text-emerald-400 font-mono ml-6">Access-Control-Allow-Origin: https://trusted.com</div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 relative overflow-hidden min-h-[250px] flex items-center justify-between">

        {/* Attacker Context */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-16 h-16 bg-red-950 border border-red-800 rounded-lg flex items-center justify-center">
            <Globe className="w-8 h-8 text-red-400" />
          </div>
          <span className="text-xs font-semibold text-gray-300">Attacker Site</span>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-24 w-48 bg-gray-900 border border-gray-700 p-2 rounded text-xs font-mono text-emerald-400 shadow-lg"
              >
                // Data Stolen<br />
                {'{'} "balance": "$5M", "account": "1234" {'}'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Network Area */}
        <div className="flex-1 flex flex-col justify-center relative h-32 mx-4">
          {/* Browser boundary visual */}
          <div className="absolute left-1/4 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-700 flex items-start justify-center">
            <span className="bg-gray-950 text-gray-500 text-[10px] px-1 mt-2">Browser Sandbox</span>
          </div>

          <AnimatePresence>
            {status === 'preflight' && (
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 0.7, repeat: 1, repeatType: "reverse" }}
                className="absolute top-1/3 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded shadow-[0_0_10px_#a855f7] flex items-center justify-center text-[8px] text-white font-bold"
              >
                OPT
              </motion.div>
            )}
            {status === 'request' && (
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 0.7 }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
              />
            )}
            {status === 'success' && (
              <motion.div
                initial={{ left: "100%" }}
                animate={{ left: "0%" }}
                transition={{ duration: 0.7 }}
                className="absolute top-2/3 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded shadow-[0_0_10px_#10b981]"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status === 'blocked' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-950 border border-red-800 text-red-400 p-2 rounded text-xs font-medium z-20 flex items-center gap-1 shadow-lg whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4" /> Browser Blocked Read
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* API Server Context */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-16 h-16 bg-blue-950 border border-blue-800 rounded-lg flex items-center justify-center">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-gray-300">API Server</span>
        </div>

      </div>
    </div>
  );
}


export default function CORSMisconfiguration(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <CORSMisconfigurationContent />;

  const question = props.exercises[props.step];
  if (!question) return <CORSMisconfigurationContent />;

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
      exerciseContent={<CORSMisconfigurationContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}
