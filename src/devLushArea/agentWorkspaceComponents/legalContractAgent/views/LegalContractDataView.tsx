import React from 'react';
import { Edit3, ShieldAlert, Globe, Settings, FileSearch } from 'lucide-react';
import { LegalContractSidebarView } from '../components/LegalContractAgentSidebar';

interface LegalContractDataViewProps {
  viewType: LegalContractSidebarView;
}

export default function LegalContractDataView({ viewType }: LegalContractDataViewProps) {
  const content = {
    redlining: {
      title: "Automated Redlining Engine",
      icon: Edit3,
      description: "AI-powered markup of vendor agreements comparing against corporate playbooks.",
      items: [
        { label: "Vendor MSA - Acme Corp", value: "Flagged 'Indemnification' clause. Missing mutual protection. Suggested redline generated." },
        { label: "SaaS Terms - CloudStream", value: "Data privacy addendum missing. Auto-inserted standard DPA appendix." },
        { label: "NDA - Stealth Startup", value: "Unfavorable jurisdiction (Delaware specified, California required). Redlined." }
      ]
    },
    liabilities: {
      title: "Liability & Risk Detection",
      icon: ShieldAlert,
      description: "Extracting hidden liabilities, uncapped risks, and non-standard terms.",
      items: [
        { label: "Uncapped Liability", value: "Found in 'Limitation of Liability' section of Supplier Agreement #442. Risk level: CRITICAL." },
        { label: "Auto-Renewal Trap", value: "Contract auto-renews for 3 years without 90-day prior written notice. Flagged for review." },
        { label: "Intellectual Property", value: "Ambiguous ownership of developed IP in SOW #2. Required update to 'Work Made for Hire' doctrine." }
      ]
    },
    compliance: {
      title: "Global Compliance Monitor",
      icon: Globe,
      description: "Continuous monitoring of regulatory requirements across jurisdictions.",
      items: [
        { label: "GDPR (EU)", value: "SCCs (Standard Contractual Clauses) validated across all European vendor agreements." },
        { label: "CCPA (California)", value: "Opt-out requirements flagged as missing in 3 consumer-facing terms of service drafts." },
        { label: "HIPAA (Healthcare)", value: "BAA (Business Associate Agreement) executed and verified for AWS hosting." }
      ]
    },
    settings: {
      title: "Rules & Policies",
      icon: Settings,
      description: "Configure corporate legal playbooks and risk tolerance levels.",
      items: [
        { label: "Standard Jurisdiction", value: "Set to: California, USA. (Will flag any other jurisdiction)." },
        { label: "Liability Cap", value: "Maximum acceptable liability: $1,000,000 or 12 months fees (whichever is greater)." },
        { label: "Payment Terms", value: "Standard: Net 60. (Net 30 requires Director approval)." }
      ]
    },
    dashboard: { title: "", icon: Settings, description: "", items: [] },
    theory: { title: "", icon: Settings, description: "", items: [] }
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-sm text-slate-600 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
