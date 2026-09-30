import React from 'react';
import { Code, GitPullRequest, Search, Zap, CheckCircle, AlertCircle, ArrowRight, Activity, HelpCircle, Shield } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';
import ResponsiveDataFrame from '../../../components/ResponsiveDataFrame';

interface SastDashboardViewProps {
  onRunTutorial: () => void;
}

export default function SastDashboardView({ onRunTutorial }: SastDashboardViewProps) {
  return (
    <div className="px-4 py-6 sm:p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar sast-dashboard-header">
      <AgentPreviewNotice>This is an example finding. The excerpt has no verified line number or confidence score, and no suggested fix has been applied. A reviewer must confirm the surrounding code and analyzer evidence.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Source Code Auditor (SAST)</h1>
          <p className="text-slate-500 mt-1">Automated Code Review & Shifting Security Left</p>
          <button 
            onClick={onRunTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 shadow-sm transition-colors text-xs font-medium mt-3 tutorial-recap-button"
          >
            <HelpCircle className="w-4 h-4" />
            Tutorial Recap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div id="tutorial-pr-scan" className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Example PR finding · source context incomplete</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" /> Example SQL injection pattern
              </div>
              <p className="text-sm text-red-600">
                The built-in excerpt concatenates input into a SQL string. The file label is illustrative; inspect the real repository before calling this a finding.
              </p>
              <SourceStatus source="Built-in code example" freshness="No repository scan or verified line number" confidence="Unverified" />
              <ResponsiveDataFrame label="Example unsafe SQL excerpt" className="bg-white rounded border border-red-100 p-2 mt-2 font-mono text-xs text-slate-800">
                <span className="text-red-500">- </span>
                <span>{`const query = "SELECT * FROM users WHERE username = '" + req.body.username + "';"`}</span>
              </ResponsiveDataFrame>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <p className="rounded-lg bg-white p-3 text-xs leading-5 text-slate-700"><strong>Severity basis:</strong> Input is concatenated into SQL in this example. Impact depends on the real query path and database permissions.</p>
                <p className="rounded-lg bg-white p-3 text-xs leading-5 text-slate-700"><strong>Safe next step:</strong> Use a parameterized query, then verify behavior with a test against the actual repository and review the surrounding code.</p>
              </div>
            </div>
          </div>
        </div>

        <div id="tutorial-tools" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Tools Used</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <Search className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Automated Code Review</h4>
                <p className="text-xs text-slate-500">Reviews PRs for logic flaws & vulnerabilities.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <Zap className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Secret Scanning</h4>
                <p className="text-xs text-slate-500">Detects hardcoded secrets, API keys, and passwords.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Dependency Analysis</h4>
                <p className="text-xs text-slate-500">Identifies vulnerable third-party dependencies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
