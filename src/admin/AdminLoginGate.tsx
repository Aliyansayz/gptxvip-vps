import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import type { AdminSessionUser } from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';

interface AdminLoginGateProps {
  onAuthenticated: (user: AdminSessionUser) => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await cmsApiClient.loginAdmin(email.trim(), accessKey);
      if (!result.ok || !result.user) {
        setError(result.error || 'Authentication failed.');
        return;
      }
      setAccessKey('');
      onAuthenticated(result.user);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="premium-surface flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md space-y-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Return to GPTX.VIP</span>
        </a>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7 shadow-2xl sm:p-8">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ff38]/25 bg-[#d8ff38]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#d8ff38]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin Security Gate</span>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              GPTX.VIP Admin Studio
            </h1>
            <p className="text-sm leading-relaxed text-zinc-400">
              Sign in with your authorized admin email and the environment-configured{' '}
              <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
                ADMIN_ACCESS_KEY
              </code>{' '}
              passkey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gptx.vip"
                  disabled={busy}
                  className="min-h-[44px] w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-[#d8ff38] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-passkey"
                className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400"
              >
                Environment Passkey
              </label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  id="admin-passkey"
                  type={showKey ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter ADMIN_ACCESS_KEY"
                  disabled={busy}
                  className="min-h-[44px] w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-11 text-sm text-white placeholder:text-zinc-500 focus:border-[#d8ff38] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  aria-label={showKey ? 'Hide passkey' : 'Show passkey'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-rose-200"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#d8ff38] px-4 py-2.5 text-sm font-bold text-[#101014] transition-[transform,background-color] duration-150 hover:bg-[#c6f028] active:scale-[0.96] disabled:opacity-60 cursor-pointer"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Verifying credentials…</span>
                </>
              ) : (
                <span>Unlock Admin Studio</span>
              )}
            </button>
          </form>

          <p className="mt-5 border-t border-zinc-800/80 pt-4 text-[11px] leading-relaxed text-zinc-500">
            Session is stored in an <code className="text-zinc-400">HttpOnly; SameSite=Lax</code> cookie backed by Cloudflare D1.
          </p>
        </div>
      </div>
    </div>
  );
};
