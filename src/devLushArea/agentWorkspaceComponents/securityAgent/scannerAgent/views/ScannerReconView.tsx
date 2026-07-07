import React from 'react';
import { Search, Globe, Network } from 'lucide-react';

export default function ScannerReconView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Search className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Reconnaissance Workspace</h2>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Globe className="w-4 h-4" /> Asset Inventory</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 font-medium">Domain / Asset</th>
              <th className="p-3 font-medium">IP Address</th>
              <th className="p-3 font-medium">Open Ports</th>
              <th className="p-3 font-medium">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium text-slate-800">api.internal-sandbox.com</td>
              <td className="p-3 text-slate-600 font-mono">10.0.4.12</td>
              <td className="p-3 text-slate-600">80, 443</td>
              <td className="p-3 text-slate-500">2 mins ago</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium text-slate-800">staging.internal-api.com</td>
              <td className="p-3 text-slate-600 font-mono">10.0.5.55</td>
              <td className="p-3 text-slate-600">80, 443, 8080</td>
              <td className="p-3 text-slate-500">1 hour ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
