import React from 'react';
import { ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { ContactForm } from '../../../shared/components/ContactForm';

interface LeadGenerationSectionProps {
  className?: string;
}

export const LeadGenerationSection: React.FC<LeadGenerationSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      className={`rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(ellipse at 78% 25%, #6f78ff 0, transparent 38%), radial-gradient(ellipse at 63% 76%, #1528b7 0, transparent 42%), linear-gradient(115deg, #11121c 5%, #272bc3 58%, #7f8cff 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Plain-English Value Proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-[#d8ff38]">
            <span>✳</span>
            Custom AI Agents &amp; Interactive Workspaces
          </div>

          <h2
            className="text-3xl sm:text-4xl font-normal tracking-[-0.05em] text-white leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to <span className="hl-circle-sketch">save hours</span> on contracts, security, or <span className="hl-brutalist">daily operations?</span>
          </h2>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Whether you want an AI legal assistant that checks vendor agreements in minutes or a live dashboard that brings your business numbers into one clear view, our team builds and launches it with you.
          </p>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Easy for Anyone on Your Team to Use
                </h3>
                <p className="text-xs text-white/75 mt-0.5">
                  Clean, visual workspaces designed in plain English — no technical training required.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Fast Rollout in Weeks, Not Quarters
                </h3>
                <p className="text-xs text-white/75 mt-0.5">
                  Start with a working interactive prototype tailored to your company rules and tools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  100% Private &amp; Audit-Ready
                </h3>
                <p className="text-xs text-white/75 mt-0.5">
                  Your company documents stay private and every approval is logged for GDPR, SOC 2, and HIPAA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lg:col-span-6 bg-white text-[#101014] rounded-2xl p-6 sm:p-8 shadow-xl">
          <ContactForm
            variant="full"
            tone="light"
            accent="warm"
            title="Book a Friendly Walkthrough"
            description="Tell us what you’d like to simplify, or email us directly at hello@gptx.vip."
            subject="Use Cases Inquiry: Custom Walkthrough Request"
          />
        </div>
      </div>
    </section>
  );
};

export default LeadGenerationSection;
