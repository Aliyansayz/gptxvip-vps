import React from 'react';
import { Scale, FileText, Globe } from 'lucide-react';

interface LegalComplianceAgentsProps {
  onNavigate: (view: string) => void;
}

export const LegalComplianceAgents: React.FC<LegalComplianceAgentsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-indigo-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
          <Scale className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-indigo-600 transition-colors">Legal & Compliance Agents</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Review example contract analysis and compliance patterns; proposed wording always needs human review.
      </p>
      
      <div className="space-y-3">
        <button 
          type="button"
          onClick={() => onNavigate('legal-contract-agent')}
          className="w-full min-h-11 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Contract Analysis Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Inspect example clause flags and review states</div>
            </div>
          </div>
        </button>
        
        <button 
          type="button"
          disabled
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed text-left"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-400" />
            <div>
              <div className="font-semibold text-sm text-slate-600">Global Compliance Monitor</div>
              <div className="text-[11px] text-slate-400 font-medium">Regulatory tracking (Coming soon)</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
