import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CheckCircle2 } from 'lucide-react';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { getAgenticRoleUseCase } from './agenticRoleUseCases';
import { getAgenticRoleIcon } from '../agenticRoles/views/components/roleIcons';

interface AgenticRoleUseCasesProps {
  onOpenRole: (roleId: string) => void;
  /**
   * `warm` matches the landing page's orange-red accent ramp.
   * Defaults to `cyan` so the Agent Labs landing keeps its existing palette.
   */
  accent?: 'cyan' | 'warm';
  className?: string;
}

export function AgenticRoleUseCases({ onOpenRole, accent = 'cyan', className = '' }: AgenticRoleUseCasesProps) {
  const [activeRoleId, setActiveRoleId] = useState(agenticRoleDefinitions[0]?.id || '');
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const activeRole = agenticRoleDefinitions.find((role) => role.id === activeRoleId) || agenticRoleDefinitions[0];
  const activeIndex = agenticRoleDefinitions.findIndex((role) => role.id === activeRole?.id);

  // Bright display stops clear 3:1 on the #0d1824 panel; body-level copy on
  // the light band needs the deep AA step instead.
  const warm = accent === 'warm';
  const accentOnDark = warm ? 'text-[#d8ff38]' : 'text-cyan-300';
  const accentOnLight = warm ? 'text-[#343edb]' : 'text-cyan-700 dark:text-cyan-300';
  const accentRing = warm ? 'focus-visible:ring-[#343edb]' : 'focus-visible:ring-cyan-300';
  const accentCta = warm ? 'bg-[#d8ff38] text-[#101014] hover:bg-[#c6f028]' : 'bg-cyan-300 hover:bg-cyan-200 text-slate-950';
  const accentGlow = warm ? 'rgba(52,62,219,0.25)' : 'rgba(34,211,238,0.15)';
  const accentRail = warm ? 'border-[#343edb] bg-[#343edb]/20' : 'border-cyan-400/50 bg-cyan-300/10';
  const accentRailIcon = warm ? 'bg-[#d8ff38] text-[#101014]' : 'bg-cyan-300 text-slate-950';

  useEffect(() => {
    const element = revealRef.current;
    if (!element || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.16 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!activeRole) return null;
  const currentUseCase = getAgenticRoleUseCase(activeRole);

  return (
    <section aria-labelledby="agentic-role-use-cases-heading" className={`border-b border-ink/10 bg-paper py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#343edb] mb-2">
            02 / APPLIED AGENT ROLES
          </span>
          <h2 id="agentic-role-use-cases-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-display">
            See where an agent role earns its place.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Move through {agenticRoleDefinitions.length} role-based use cases. Each opens a real case path with sample inputs, a decision to make, and evidence to inspect.
          </p>
        </div>

        <div ref={revealRef} className={`relative overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-[#0d1824] text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[0.98] opacity-0'}`}>
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,${accentGlow},transparent_38%),linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px]`} />
          <div className="relative border-b border-white/10 px-5 py-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] ${accentOnDark}`}><BriefcaseBusiness className="h-4 w-4" /> Use case explorer</span>
              <span className="text-xs font-medium text-slate-300">{agenticRoleDefinitions.length} roles · {agenticRoleDefinitions.reduce((total, role) => total + role.chapters.length, 0)} case exercises</span>
            </div>
          </div>

          <div className="relative grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(15rem,0.76fr)_minmax(0,1.24fr)]">
            <div className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r lg:p-4" aria-label="Choose an Agentic Role use case">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
                {agenticRoleDefinitions.map((role, index) => {
                  const RoleIcon = getAgenticRoleIcon(role.iconName);
                  const selected = role.id === activeRole.id;
                  return <button key={role.id} type="button" onClick={() => setActiveRoleId(role.id)} aria-pressed={selected} className={`group flex min-h-14 min-w-[12rem] items-center gap-3 rounded-xl border px-3 py-2 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 ${accentRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] lg:min-w-0 ${selected ? `${accentRail} text-white` : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? accentRailIcon : 'bg-white/10 text-slate-200'}`}><RoleIcon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Role {String(index + 1).padStart(2, '0')}</span><span className="block truncate text-sm font-semibold">{role.shortTitle}</span></span>
                    {selected && <ArrowRight aria-hidden="true" className={`hidden h-4 w-4 shrink-0 ${accentOnDark} lg:block`} />}
                  </button>;
                })}
              </div>
            </div>

            <div className="min-w-0 p-4 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]"><span className={accentOnDark}>Case path {String(activeIndex + 1).padStart(2, '0')} / {String(agenticRoleDefinitions.length).padStart(2, '0')}</span><span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">{activeRole.chapters.length} exercises</span></div>
              <div aria-live="polite" aria-atomic="true">
                <h3 className="mt-4 max-w-xl text-xl sm:text-2xl font-medium tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{activeRole.title}</h3>
                <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">{activeRole.tagline}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[['The situation', currentUseCase.situation], ['The decision', currentUseCase.decision], ['What to check', currentUseCase.evidence]].map(([label, body]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5"><p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accentOnDark}`}>{label}</p><p className="mt-1.5 text-xs leading-5 text-slate-200">{body}</p></div>)}
                </div>
                <div className="mt-5 flex items-start gap-2.5 border-t border-white/10 pt-4 text-xs text-slate-300"><CheckCircle2 aria-hidden="true" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accentOnDark}`} /><span>First case: <strong className="font-semibold text-white">{activeRole.chapters[0]?.chapter_title || 'Choose a case from this role'}</strong></span></div>
              </div>
              <button type="button" onClick={() => onOpenRole(activeRole.id)} className={`mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-[30px] px-4 py-2 text-xs font-bold transition-[background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${accentRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] motion-reduce:transform-none ${accentCta}`}>Explore this role <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
