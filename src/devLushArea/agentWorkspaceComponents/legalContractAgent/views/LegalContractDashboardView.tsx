import React from 'react';
import { FileText, ShieldAlert, Edit3, Globe, Activity, CheckCircle, Clock } from 'lucide-react';

export default function LegalContractDashboardView() {
  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-heading">Legal Operations Dashboard</h1>
            <p className="text-slate-500 mt-2">Real-time contract analysis and compliance monitoring.</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm">
            <Activity className="w-4 h-4 animate-pulse" />
            AI Ingestion Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Contracts Reviewed (30d)", value: "1,248", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Critical Liabilities Found", value: "34", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-50" },
            { label: "Auto-Redlined Clauses", value: "8,921", icon: Edit3, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Compliance Score", value: "98.5%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Recent Contract Ingestions
            </h2>
            <div className="space-y-4">
              {[
                { title: "Enterprise Service Agreement - TechCorp", time: "10 mins ago", status: "Review Complete", issues: 2 },
                { title: "NDA - Project Phoenix", time: "45 mins ago", status: "Auto-Approved", issues: 0 },
                { title: "SaaS Subscription Terms - Cloudify", time: "2 hours ago", status: "Pending Human Review", issues: 5 },
                { title: "Vendor Master Agreement - SupplyCo", time: "5 hours ago", status: "Redlines Generated", issues: 1 }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${activity.issues > 0 ? (activity.issues > 3 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`} />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{activity.title}</h4>
                      <p className="text-xs text-slate-500">{activity.status} • {activity.time}</p>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {activity.issues} flag{activity.issues !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" />
              Compliance Alerts Map
            </h2>
            <div className="h-64 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center relative overflow-hidden">
               {/* Decorative dots to simulate a map */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
               <div className="text-center relative z-10">
                 <Globe className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                 <p className="text-sm text-slate-500 font-medium">Monitoring 42 Jurisdictions</p>
                 <div className="mt-4 flex gap-2 justify-center">
                   <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">EU: GDPR OK</span>
                   <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">US: CCPA OK</span>
                   <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">UK: Reviewing Updates</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
