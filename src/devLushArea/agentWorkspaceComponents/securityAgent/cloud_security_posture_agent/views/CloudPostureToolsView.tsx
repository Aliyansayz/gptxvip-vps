import React from 'react';
import { Wrench, Search, Shield, Zap, CloudCog, FileText, Activity } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface ToolInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  whatItIs: string;
  whatItDoes: string;
  category: string;
  capabilities: string[];
}

const cloudPostureTools: ToolInfo[] = [
  {
    id: 'compliance-scanner',
    name: 'Benchmark Auditor',
    icon: FileText,
    category: 'Auditing',
    whatItIs: 'A continuous assessment engine that evaluates cloud accounts against industry frameworks.',
    whatItDoes: 'Scans AWS, Azure, or GCP configurations comparing them against CIS Foundations, HIPAA, or SOC2 standards to identify non-compliant settings.',
    capabilities: ['Multi-cloud API polling', 'Framework mapping', 'Automated reporting']
  },
  {
    id: 'drift-detector',
    name: 'IaC Drift Detector',
    icon: Activity,
    category: 'Monitoring',
    whatItIs: 'A synchronization monitor comparing deployed infrastructure against source code.',
    whatItDoes: 'Alerts when a manual change is made via the cloud console (e.g., opening a security group port) that deviates from the approved Terraform or CloudFormation state.',
    capabilities: ['State file comparison', 'Alert routing', 'Diff generation']
  },
  {
    id: 'iam-analyzer',
    name: 'IAM Privilege Analyzer',
    icon: Search,
    category: 'Access Control',
    whatItIs: 'An automated policy evaluation tool for cloud identity and access management.',
    whatItDoes: 'Identifies overly permissive roles (e.g., AdministratorAccess), cross-account trust issues, and unused credentials by analyzing access patterns over time.',
    capabilities: ['Policy parsing', 'Access pattern graph', 'Least-privilege recommendations']
  },
  {
    id: 'auto-remediator',
    name: 'Auto-Remediation Engine',
    icon: Zap,
    category: 'Response',
    whatItIs: 'An autonomous script execution engine triggered by specific security violations.',
    whatItDoes: 'Automatically fixes critical misconfigurations, such as disabling public access to an S3 bucket or rotating compromised access keys, without waiting for human intervention.',
    capabilities: ['Serverless execution (Lambda/CloudFunctions)', 'Rollback support', 'Audit logging']
  },
  {
    id: 'asset-inventory',
    name: 'Dynamic Asset Graph',
    icon: CloudCog,
    category: 'Visibility',
    whatItIs: 'A centralized, real-time map of all cloud resources across all accounts and regions.',
    whatItDoes: 'Provides full visibility into the cloud footprint, tracking compute instances, databases, serverless functions, and their network relationships and security groups.',
    capabilities: ['Tag enforcement', 'Orphaned resource detection', 'Topology visualization']
  }
];

export default function CloudPostureToolsView() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">CSPM Toolkit</h1>
          <p className="text-slate-500 mt-1">
            Understanding the automated auditing, monitoring, and remediation tools deployed by the Cloud Security Posture Agent.
          </p>
        </div>
      </div>

      <AgentPreviewNotice>Tool descriptions are examples; no cloud account is connected and no remediation is run here. Review and approve any change through your normal change process.</AgentPreviewNotice>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cloudPostureTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">{tool.category}</div>
                <h3 className="text-xl font-bold text-slate-800">{tool.name}</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  What it is
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {tool.whatItIs}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  What it does
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {tool.whatItDoes}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Key Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.capabilities.map((cap, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
