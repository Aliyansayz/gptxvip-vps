import React, { useState } from 'react';
import { WebVulnCandidate } from '../utility/schema';
import { ArrowLeft, CheckCircle2, Circle, Terminal, Code, ShieldAlert, Cpu } from 'lucide-react';

interface RemediationPlanViewProps {
  candidate: WebVulnCandidate;
  onBack: () => void;
}

export default function RemediationPlanView({ candidate, onBack }: RemediationPlanViewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const getRemediationSteps = (vulnClass: string) => {
    switch (vulnClass) {
      case 'XSS':
        return [
          { title: 'Analyze Source Context', desc: 'Identify where the unescaped input is being rendered in the DOM.' },
          { title: 'Implement Context-Aware Encoding', desc: 'Use a library like DOMPurify or React\'s built-in escaping to sanitize the input before rendering.' },
          { title: 'Apply Content Security Policy (CSP)', desc: 'Restrict executable scripts to trusted domains using the Content-Security-Policy header.' }
        ];
      case 'SQLi':
        return [
          { title: 'Identify Vulnerable Query', desc: 'Locate the raw SQL query concatenating user input.' },
          { title: 'Implement Parameterized Queries', desc: 'Refactor the query to use prepared statements or an ORM (e.g., Prisma, Drizzle).' },
          { title: 'Enforce Least Privilege', desc: 'Ensure the database user has only the permissions necessary for the application.' }
        ];
      case 'SSRF':
        return [
          { title: 'Review URL Fetch Logic', desc: 'Identify where the application fetches URLs based on user input.' },
          { title: 'Implement Allowlist', desc: 'Restrict fetches to a strict allowlist of domains or IP addresses.' },
          { title: 'Disable Internal Routing', desc: 'Block access to internal IP ranges (e.g., 169.254.169.254, 10.0.0.0/8) at the network level.' }
        ];
      case 'Command Injection':
        return [
          { title: 'Audit System Calls', desc: 'Identify usage of functions like exec(), spawn(), or system() with user input.' },
          { title: 'Use Safe APIs', desc: 'Replace shell executions with native language APIs or libraries when possible.' },
          { title: 'Sanitize Input', desc: 'If shell execution is unavoidable, strictly validate and sanitize the input against an allowlist of characters.' }
        ];
      default:
        return [
          { title: 'Analyze Vulnerability', desc: 'Investigate the root cause of the vulnerability.' },
          { title: 'Develop Patch', desc: 'Implement a fix to address the root cause.' },
          { title: 'Deploy and Verify', desc: 'Deploy the patch and run automated tests to confirm the vulnerability is resolved.' }
        ];
    }
  };

  const steps = getRemediationSteps(candidate.vulnClass);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Return to findings" onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Suggested remediation preview
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Resolving: <span className="text-slate-700">{candidate.vulnClass}</span> at <span className="font-mono text-slate-700">{candidate.endpoint}</span></p>
          </div>
        </div>
      </div>

      <p className="px-5 py-2 text-xs text-amber-950 bg-amber-50 border-b border-amber-200">Example guidance only. This walkthrough does not edit source code, deploy a patch, or verify a fix.</p>

      <div className="flex-1 flex overflow-hidden">
        {/* Progress Sidebar */}
        <div className="w-80 border-r border-slate-200 p-6 bg-white overflow-y-auto flex flex-col">
          <div className="flex-1 mb-8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">Execution Plan</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div 
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors ${
                      idx < currentStep ? 'border-indigo-600 bg-indigo-600 text-white' : 
                      idx === currentStep ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50' : 'border-slate-300 text-slate-300'
                    }`}
                  >
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3 fill-current" />}
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border ${idx === currentStep ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white'}`}>
                    <h4 className={`text-xs font-bold leading-tight ${idx === currentStep ? 'text-indigo-700' : 'text-slate-600'}`}>{step.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div className="flex-1 p-10 overflow-y-auto bg-slate-50/50">
          {currentStep < steps.length ? (
            <div className="max-w-3xl mx-auto space-y-8 mt-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200">
                  Step {currentStep + 1} of {steps.length}
                </div>
                <h1 className="text-3xl font-heading font-bold text-slate-800">{steps[currentStep].title}</h1>
                <p className="text-lg text-slate-600 mt-2">{steps[currentStep].desc}</p>
              </div>
              
              {/* Simulated Code/Action Area */}
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-lg mt-8">
                <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-3">
                  <Terminal className="w-4 h-4" />
                  <span>Sample review context</span>
                </div>
                <div className="font-mono text-sm text-emerald-400 space-y-2.5 pt-2">
                  <p className="text-slate-300">&gt; Analyzing context for <span className="text-indigo-400 font-bold">{candidate.vulnClass}</span>...</p>
                  <p className="text-slate-300">&gt; Target parameter: <span className="text-amber-400">{candidate.parameter}</span></p>
                  {currentStep === 1 && <p className="text-emerald-400">&gt; Example patch approach shown; no patch generated.</p>}
                  {currentStep === 2 && <p className="text-emerald-400">&gt; Verification is not available in this preview.</p>}
                  <p className="animate-pulse text-emerald-500 font-bold">_</p>
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
                >
                  {currentStep === steps.length - 1 ? 'Finish reviewing plan' : 'Review next step'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-6 bg-emerald-50 text-emerald-600 rounded-full border-8 border-emerald-50/50 shadow-sm">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold mb-3 text-slate-800">Plan review complete</h1>
                <p className="text-slate-600 text-lg max-w-md mx-auto">This preview has not changed or tested the <span className="font-bold text-slate-800">{candidate.vulnClass}</span> finding. Apply and verify any fix through your normal review process.</p>
              </div>
              <button 
                onClick={onBack}
                className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all mt-4"
              >
                Return to findings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
