import React from 'react';
import { Edit3, ShieldAlert, Globe, Settings, Book } from 'lucide-react';
import { LegalContractSidebarView } from '../components/LegalContractAgentSidebar';
import AgentPreviewNotice from '../../components/AgentPreviewNotice';

interface LegalContractDataViewProps {
  viewType: LegalContractSidebarView;
}

export default function LegalContractDataView({ viewType }: LegalContractDataViewProps) {
  const content = {
    redlining: {
      title: "Automated Redlining Engine",
      icon: Edit3,
      description: "Example redline-review steps. No contract or organization playbook is connected.",
      items: [
        { label: "Vendor MSA · example", source: "Source clause text not attached.", finding: "The example indemnification clause may lack mutual protection.", proposal: "Suggested next step: compare the clause with the approved playbook.", status: "Example only · not reviewed" },
        { label: "SaaS Terms · example", source: "Source clause text not attached.", finding: "The example record indicates a data privacy addendum may be missing.", proposal: "Suggested next step: confirm whether a DPA is required and attach the approved language.", status: "Example only · no edit applied" },
        { label: "NDA · example", source: "Source clause text not attached.", finding: "The example record names a jurisdiction mismatch for review.", proposal: "Suggested next step: confirm the governing-law requirement with counsel.", status: "Example only · not reviewed" }
      ]
    },
    liabilities: {
      title: "Liability Review Examples",
      icon: ShieldAlert,
      description: "Illustrative liability and term issues for analyst review; no contract scan runs here.",
      items: [
        { label: "Uncapped liability · example", source: "Limitation of Liability clause not attached.", finding: "An uncapped liability provision is shown as a sample issue.", proposal: "Suggested next step: inspect the surrounding clause and compare it with the applicable playbook.", status: "Example severity · not validated" },
        { label: "Auto-renewal · example", source: "Renewal clause text not attached.", finding: "The example describes a renewal term without a notice window.", proposal: "Suggested next step: confirm the term and notice requirements in the source agreement.", status: "Example only · not reviewed" },
        { label: "Intellectual property · example", source: "Statement of Work clause not attached.", finding: "The example describes unclear ownership of developed work.", proposal: "Suggested next step: review the full clause with counsel before proposing wording.", status: "Example only · no change applied" }
      ]
    },
    compliance: {
      title: "Compliance Review Examples",
      icon: Globe,
      description: "Illustrative jurisdiction prompts; no regulatory source or agreement is monitored.",
      items: [
        { label: "GDPR (EU) · example", source: "Vendor clauses and jurisdiction evidence not attached.", finding: "The example references a possible need to review transfer terms.", proposal: "Suggested next step: check the current agreement and applicable requirements.", status: "Example only · not validated" },
        { label: "CCPA (California) · example", source: "Terms of service text not attached.", finding: "The example references a possible opt-out disclosure gap.", proposal: "Suggested next step: review the exact consumer-facing language with counsel.", status: "Example only · not reviewed" },
        { label: "HIPAA (Healthcare) · example", source: "Business Associate Agreement not attached.", finding: "The example names a hosting relationship for verification.", proposal: "Suggested next step: confirm the executed agreement and covered-service scope.", status: "Example only · not verified" }
      ]
    },
    settings: {
      title: "Rules & Policies",
      icon: Settings,
      description: "Example policy fields; no organization playbook is connected or configured.",
      items: [
        { label: "Standard jurisdiction", source: "No organization policy is connected.", finding: "No verified policy setting is available in this preview.", proposal: "An authorized owner would need to provide the governing requirement.", status: "Example policy · not configured" },
        { label: "Liability cap", source: "No organization policy is connected.", finding: "No verified cap or approval rule is available in this preview.", proposal: "An authorized owner would need to supply the approved threshold.", status: "Example policy · not configured" },
        { label: "Payment terms", source: "No organization policy is connected.", finding: "No verified payment standard is available in this preview.", proposal: "An authorized owner would need to supply the approved terms.", status: "Example policy · not configured" }
    ]
  },
    dashboard: { title: "", icon: Settings, description: "", items: [] },
    theory: { title: "Legal Reference", icon: Book, description: "Reference content is not attached to this preview.", items: [] }
  };

  const data = content[viewType];
  const Icon = data?.icon;

  if (!Icon) return null;

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-indigo-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>The entries below are example summaries. Source text is not attached and no proposed edit has been applied. Verify the full clause and require qualified human approval before using a change.</AgentPreviewNotice>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {data.items.length > 0 ? <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <article key={idx} className="p-5 space-y-3">
                <div className="md:w-1/3">
                  <h3 className="text-sm font-bold text-slate-700">{item.label}</h3>
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <p><span className="font-semibold text-slate-700">Source / evidence:</span> <span className="text-slate-600">{item.source}</span></p>
                  <p><span className="font-semibold text-slate-700">Example finding:</span> <span className="text-slate-600">{item.finding}</span></p>
                  <p><span className="font-semibold text-slate-700">Suggested next step:</span> <span className="text-slate-600">{item.proposal}</span></p>
                  <p><span className="font-semibold text-slate-700">Review status:</span> <span className="text-slate-600">{item.status}</span></p>
                </div>
              </article>
            ))}
          </div> : <div role="status" className="p-6 text-sm text-slate-600">No legal reference content is available in this preview.</div>}
        </div>
      </div>
    </div>
  );
}
