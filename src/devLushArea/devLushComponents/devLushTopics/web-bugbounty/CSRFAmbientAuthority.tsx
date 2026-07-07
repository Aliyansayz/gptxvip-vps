import React, { useState } from 'react';
import { Globe, User, Server, ShieldBan, ShieldCheck, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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


const CSRFAmbientAuthorityContent = () => {
  const [defense, setDefense] = useState<'vulnerable' | 'samesite' | 'token'>('vulnerable');
  const [status, setStatus] = useState<'idle' | 'attacking' | 'success' | 'blocked'>('idle');

  const handleAttack = () => {
    setStatus('attacking');
    setTimeout(() => {
      if (defense !== 'vulnerable') {
        setStatus('blocked');
      } else {
        setStatus('success');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Attacker Control (evil.com)</h3>
          <button
            onClick={handleAttack}
            disabled={status === 'attacking'}
            className="w-full px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 border border-red-700 rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" /> Trigger Hidden Form Submit
          </button>
          <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-950 p-2 rounded border border-gray-800">
            &lt;form action="https://bank.com/transfer" method="POST"&gt;<br/>
            &nbsp;&nbsp;&lt;input type="hidden" name="amount" value="1000" /&gt;<br/>
            &lt;/form&gt;
          </div>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Bank.com Defenses</h3>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'vulnerable' ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'vulnerable'} onChange={() => { setDefense('vulnerable'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">None (Cookies implicitly sent)</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'samesite' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'samesite'} onChange={() => { setDefense('samesite'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">SameSite: Lax/Strict</div>
                <div className="text-xs text-gray-500">Browser drops cookie on cross-origin POST.</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'token' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'token'} onChange={() => { setDefense('token'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">Anti-CSRF Tokens</div>
                <div className="text-xs text-gray-500">Server rejects request without valid token.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 relative overflow-hidden min-h-[300px] flex items-center justify-between">
        
        {/* Attacker */}
        <div className="flex flex-col items-center gap-2 relative z-10 w-1/4">
          <div className="w-14 h-14 bg-red-950 border border-red-800 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-xs font-semibold text-red-400">Evil.com</span>
        </div>

        {/* Victim Browser */}
        <div className="flex flex-col items-center gap-2 relative z-10 w-1/4">
          <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center relative">
            <User className="w-6 h-6 text-blue-400" />
            <div className="absolute -bottom-2 -right-2 bg-amber-900 p-1 rounded-full border border-amber-700">
              <Cookie className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-300">Victim Browser</span>
          <span className="text-[10px] text-gray-500">Logged into Bank</span>
        </div>

        {/* Bank Server */}
        <div className="flex flex-col items-center gap-2 relative z-10 w-1/4">
          <div className="w-16 h-16 bg-blue-950 border border-blue-800 rounded-lg flex items-center justify-center">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-blue-300">Bank.com</span>
        </div>

        {/* Connection Lines */}
        <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-gray-800 -z-10" />

        {/* Attack Animation */}
        <AnimatePresence>
          {status === 'attacking' && (
            <>
              {/* Step 1: Evil.com to Browser */}
              <motion.div 
                initial={{ left: "12.5%" }}
                animate={{ left: "37.5%" }}
                transition={{ duration: 0.5, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] z-0"
              />
              
              {/* Step 2: Browser to Bank */}
              <motion.div 
                initial={{ left: "37.5%", opacity: 0 }}
                animate={{ left: defense === 'samesite' ? "45%" : "87.5%", opacity: 1 }}
                transition={{ delay: 0.5, duration: defense === 'samesite' ? 0.3 : 1.5, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b] z-0 flex items-center justify-center"
              >
                {defense !== 'samesite' && <Cookie className="w-2 h-2 text-white" />}
              </motion.div>
            </>
          )}

          {status === 'blocked' && defense === 'samesite' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-800 text-emerald-400 p-2 rounded text-xs font-medium z-20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Cookie Dropped! (SameSite)
            </motion.div>
          )}

          {status === 'blocked' && defense === 'token' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/3 right-[10%] bg-emerald-950 border border-emerald-800 text-emerald-400 p-2 rounded text-xs font-medium z-20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Rejected: Missing CSRF Token
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/3 right-[10%] bg-red-950 border border-red-800 text-red-400 p-2 rounded text-xs font-medium z-20 flex items-center gap-2"
            >
              <ShieldBan className="w-4 h-4" /> Unauthorized Transfer Complete!
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}


export default function CSRFAmbientAuthority(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <CSRFAmbientAuthorityContent />;
  
  const question = props.exercises[props.step];
  if (!question) return <CSRFAmbientAuthorityContent />;

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
      exerciseContent={<CSRFAmbientAuthorityContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}
