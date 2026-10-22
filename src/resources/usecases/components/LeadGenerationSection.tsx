import React from 'react';
import { ShieldCheck, CloudLightning, Award } from 'lucide-react';
import { ContactForm } from '../../../shared/components/ContactForm';
import { Reveal } from '../../../shared/components/Reveal';

interface LeadGenerationSectionProps {
  className?: string;
}

export const LeadGenerationSection: React.FC<LeadGenerationSectionProps> = ({
  className = '',
}) => {
  return (
    <section className={`rounded-3xl border border-slate-200/90 bg-white text-slate-900 p-8 sm:p-12 shadow-sm relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Offer positioning & credibility */}
        <div className="lg:col-span-6 space-y-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1.5 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Enterprise Architecture &amp; Prototype Consultation
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Transform Complex Architecture Into High-Performance Software.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Facing multi-cloud security fragmentation, legacy data silos, or seeking custom interactive bento dashboards? Our lead engineers conduct architecture deep-dives and deliver scoped production prototypes.
            </p>
          </Reveal>

          {/* Value pillars */}
          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 flex-shrink-0 border border-teal-100">
                <CloudLightning className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Interactive Bento &amp; Telemetry UIs</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Responsive multi-panel bento interfaces tailored to executive governance, live telemetry, and rapid triage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 flex-shrink-0 border border-sky-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Zero-Trust Security &amp; MXDR Integration</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time SIEM, ITDR, EDR, and immutable disaster recovery backups guaranteeing RTO &lt; 4 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 flex-shrink-0 border border-emerald-100">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Guaranteed Compliance &amp; Audit Readiness</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full control mapping against NIST CSF 2.0, SOC 2 Type II, CMMC 2.0, and financial regulatory standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lg:col-span-6 bg-slate-50/70 text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <ContactForm
            variant="full"
            tone="light"
            accent="warm"
            title="Request an Architecture Consultation"
            description="Speak directly with an enterprise systems architect. Confidential and non-binding."
            subject="Case Studies Lead: Architecture Consultation Request"
          />
        </div>
      </div>
    </section>
  );
};

export default LeadGenerationSection;
