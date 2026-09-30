import React, { useEffect, useState } from 'react';
import { Edit3, ShieldAlert, Globe, Settings, Book } from 'lucide-react';
import { LegalContractSidebarView } from '../components/LegalContractAgentSidebar';
import AgentPreviewNotice from '../../components/AgentPreviewNotice';

interface LegalContractDataViewProps {
  viewType: LegalContractSidebarView;
}

export default function LegalContractDataView({ viewType }: LegalContractDataViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => setSelectedIndex(0), [viewType]);
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
  const selectedItem = data?.items[selectedIndex] || data?.items[0];

  if (!Icon) return null;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 px-4 py-6 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-indigo-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>The entries below are example summaries. Source text is not attached and no proposed edit has been applied. Verify the full clause and require qualified human approval before using a change.</AgentPreviewNotice>
        {selectedItem ? <div className="grid gap-4 md:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)]">
          <nav aria-label="Example clause review queue" className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Review queue · {data.items.length} examples</p>
            <div className="space-y-1">{data.items.map((item, index) => <button key={item.label} type="button" onClick={() => setSelectedIndex(index)} aria-current={selectedIndex === index ? 'true' : undefined} className={`flex min-h-11 w-full flex-col items-start rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${selectedIndex === index ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}><span className="font-semibold">{item.label}</span><span className="mt-1 text-xs text-slate-500">{item.status}</span></button>)}</div>
          </nav>
          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-label={`${selectedItem.label} review detail`}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">Selected example</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{selectedItem.label}</h3>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><dt className="font-bold text-slate-900">Source wording and evidence</dt><dd className="mt-2 leading-6 text-slate-600">{selectedItem.source}</dd></div>
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4"><dt className="font-bold text-slate-900">Example finding</dt><dd className="mt-2 leading-6 text-slate-700">{selectedItem.finding}</dd></div>
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-4"><dt className="font-bold text-slate-900">Proposed review step</dt><dd className="mt-2 leading-6 text-slate-700">{selectedItem.proposal}</dd></div>
              <div className="rounded-lg border border-slate-200 p-4"><dt className="font-bold text-slate-900">Human review status</dt><dd className="mt-2 leading-6 text-slate-600">{selectedItem.status}</dd></div>
            </dl>
            <div role="status" className="mt-5 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm leading-6 text-slate-600">A source-to-proposal diff is unavailable because no contract clause or approved replacement wording is attached. Attach both before comparing changes.</div>
          </article>
        </div> : <div role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">No legal reference content is available in this preview.</div>}
      </div>
    </div>
  );
}
