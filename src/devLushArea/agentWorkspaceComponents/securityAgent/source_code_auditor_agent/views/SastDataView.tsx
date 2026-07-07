import React from 'react';
import { GitPullRequest, Key, PackageSearch, Settings } from 'lucide-react';
import { SastSidebarView } from '../components/SastAgentSidebar';

interface SastDataViewProps {
  viewType: SastSidebarView;
}

export default function SastDataView({ viewType }: SastDataViewProps) {
  const content = {
    pr_reviews: {
      title: "Automated Pull Request Reviews",
      icon: GitPullRequest,
      description: "Code logic flaws and vulnerabilities identified in active Pull Requests.",
      items: [
        { label: "PR #1042 (Authentication)", value: "Found hardcoded JWT secret in auth.ts. Status: Blocked." },
        { label: "PR #1045 (User Input)", value: "Potential XSS detected in React dangerouslySetInnerHTML. Suggested fix provided." },
        { label: "PR #1048 (Database)", value: "Raw SQL query used instead of ORM. Flagged for manual review." }
      ]
    },
    secrets: {
      title: "Secret Scanning Engine",
      icon: Key,
      description: "Detects exposed API keys, passwords, and tokens before they reach the main branch.",
      items: [
        { label: "AWS Access Key", value: "Detected in test/mocks/aws_config.json. Revocation recommended." },
        { label: "Stripe API Key", value: "Found in commit history. Re-writing git history required." },
        { label: "Database Password", value: "Found in docker-compose.yml. Move to .env file." }
      ]
    },
    dependencies: {
      title: "Dependency & SCA Analysis",
      icon: PackageSearch,
      description: "Vulnerable third-party packages and libraries in the project manifest.",
      items: [
        { label: "Critical: log4j (2.14.0)", value: "CVE-2021-44228 (Log4Shell). Upgrade to 2.17.1 immediately." },
        { label: "High: lodash (< 4.17.21)", value: "Prototype Pollution vulnerability. Auto-fix PR generated." },
        { label: "Medium: axios (0.21.0)", value: "SSRF vulnerability. Upgrade to 0.21.1." }
      ]
    },
    settings: {
      title: "SAST Integrations",
      icon: Settings,
      description: "Configure CI/CD hooks and repository access for the agent.",
      items: [
        { label: "GitHub App", value: "Connected. Agent has 'Read & Write' access to PRs." },
        { label: "Blocking Policy", value: "Strict (Block merge if Critical or High vulnerabilities found)." },
        { label: "Language Support", value: "TypeScript, Python, Go, Java." }
      ]
    },
    dashboard: { title: "", icon: Settings, description: "", items: [] }, // Should not hit this
    theory: { title: "", icon: Settings, description: "", items: [] } // Should not hit this
  };

  const data = content[viewType];
  const Icon = data?.icon;

  if (!Icon) return null;

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-purple-600" />
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
