import React, { useState } from 'react';
import { Inbox } from 'lucide-react';

const queueItems = [
  {
    id: 'blind-sqli',
    title: 'Verify Blind SQLi on Staging',
    description: 'ExploitAgent requested human verification for an anomalous response.',
    details: 'Read-only sample request. Review the anomalous response evidence before taking action in an authorized test environment.',
  },
  {
    id: 'nmap-production',
    title: 'Approve Aggressive Nmap Scan',
    description: 'ReconAgent wants to run a full port scan on production range. Requires authorization.',
    details: 'This sample request targets a production range. The workspace has no authorization service connected, so this request cannot be approved here.',
  },
];

export default function ScannerQueueView() {
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const reviewingItem = queueItems.find((item) => item.id === reviewingId);

  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Inbox className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Task Queue</h2>
      </div>
      {reviewingItem && (
        <section aria-label="Request details" className="mb-4 rounded-xl border border-indigo-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Read-only sample request</p>
              <h3 className="mt-1 font-semibold text-slate-800">{reviewingItem.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{reviewingItem.details}</p>
            </div>
            <button
              type="button"
              onClick={() => setReviewingId(null)}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              Back to queue
            </button>
          </div>
        </section>
      )}
      <div className="space-y-4">
        {queueItems.map((item) => (
          <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-slate-800">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {item.id === 'blind-sqli' ? (
                <button
                  type="button"
                  onClick={() => setReviewingId(item.id)}
                  className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                >
                  Review
                </button>
              ) : (
                <>
                  <button type="button" disabled aria-describedby="scanner-authorization-unavailable" className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 disabled:cursor-not-allowed">
                    Authorization unavailable
                  </button>
                  <p id="scanner-authorization-unavailable" className="max-w-48 text-right text-xs text-slate-500">
                    No authorization service is connected.
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
