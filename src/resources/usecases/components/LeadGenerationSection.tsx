import React from 'react';
import { ShieldCheck, CloudLightning, Award, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '../../../shared/components/ContactForm';
import { Reveal } from '../../../shared/components/Reveal';

interface LeadGenerationSectionProps {
  className?: string;
}

export const LeadGenerationSection: React.FC<LeadGenerationSectionProps> = ({
  className = '',
}) => {
  return (
    <section className={`rounded-3xl border border-slate-900/10 bg-slate-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Offer positioning & credibility */}
        <div className="lg:col-span-6 space-y-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              Enterprise Architecture & Modernization Review
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white leading-tight">
              Turn Complex Technical Debt Into Quantifiable ROI.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Facing cloud cost runaway, legacy infrastructure downtime, or demanding SOC 2 / HIPAA compliance audits? Our senior solutions architects conduct deep-dive technical reviews and deliver actionable, fixed-scope engineering roadmaps.
            </p>
          </Reveal>

          {/* Value pillars */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-cyan-400 flex-shrink-0">
                <CloudLightning className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Full-Stack Cloud & Cost Review</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pinpoint idle compute, memory leaks, and bandwidth egress bloat before spending on costly hardware.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-400 flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Zero-Disruption Migration Blueprints</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Phased cutover strategies designed for 99.999% uptime and verified sub-second disaster recovery failover.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-violet-400 flex-shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Guaranteed Compliance Sign-Off</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated security telemetry that guarantees 100% first-pass audits for HIPAA, SOC 2, CMMC, and PCI-DSS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <ContactForm
            variant="full"
            tone="light"
            accent="warm"
            title="Request an Architecture Consultation"
            description="Speak directly with an enterprise solutions architect. Confidential and non-binding."
            subject="Case Studies Lead: Architecture Consultation Request"
          />
        </div>
      </div>
    </section>
  );
};

export default LeadGenerationSection;
