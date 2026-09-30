import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Activity, AlertCircle, Zap, Target } from 'lucide-react';
import type { EcommerceSidebarView } from '../components/EcommerceAgentSidebar';
import SourceStatus from '../../components/SourceStatus';

export default function EcommerceDashboardView({ onOpenData }: { onOpenData: (view: EcommerceSidebarView) => void }) {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
      {/* Global Header */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-mono text-slate-700">Target: store.example.com</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Conversion Agent: Preview</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Example revenue impact: +$12,450</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <ShoppingCart className="w-4 h-4 text-blue-500" />
            <span>Example cart abandonment change: -4.2%</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:p-6 max-w-7xl mx-auto w-full space-y-8">
        <aside className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
          <strong>Illustrative store preview.</strong> Metrics, alerts, activity entries, and connection names below are example content; no live store source or measurement window is shown.
        </aside>
        <div className="grid gap-3 rounded-xl border border-blue-100 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div><h2 className="font-bold text-slate-900">Start with a sample business question</h2><p className="mt-1 text-sm leading-6 text-slate-600">Which change might reduce checkout drop-off without an unverified price or inventory action?</p><SourceStatus source="Built-in commerce scenario" freshness="Measurement period unavailable" /></div>
          <button type="button" onClick={() => onOpenData('customer_segmentation')} className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Inspect customer examples</button>
        </div>
        
        {/* Actionable Alerts & Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Optimization Opportunities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                   <AlertCircle className="w-4 h-4" /> Checkout Flow Friction
                 </div>
                 <p className="text-xs text-blue-600/80">High drop-off rate detected at shipping address step. Recommend one-click address population.</p>
                 <SourceStatus source="Example funnel note" freshness="No store or test period connected" />
                 <button type="button" onClick={() => onOpenData('customer_segmentation')} className="mt-2 min-h-10 self-start rounded-lg border border-blue-300 px-3 text-xs font-semibold text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Inspect related examples</button>
               </div>
               <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                   <TrendingUp className="w-4 h-4" /> Upsell Opportunity
                 </div>
                 <p className="text-xs text-emerald-600/80">Frequently bought together items are not surfaced during checkout for premium electronics.</p>
                 <SourceStatus source="Example merchandising note" freshness="No catalog data connected" />
                 <button type="button" onClick={() => onOpenData('pricing')} className="mt-2 min-h-10 self-start rounded-lg border border-emerald-300 px-3 text-xs font-semibold text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Inspect pricing examples</button>
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Sample activity log
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-mono text-xs text-slate-600 space-y-2 h-[104px] overflow-y-auto">
              <div className="text-blue-600">[14:22:01] ConversionAgent: Analyzing A/B test results for hero CTA...</div>
              <div className="text-slate-500">[14:22:15] ConversionAgent: Variant B showing 12% lift.</div>
              <div className="text-slate-500">[14:23:42] PricingAgent: Monitoring competitor price changes for SKU-1042.</div>
              <div className="text-blue-600">Example log complete</div>
            </div>
          </div>
        </div>

        {/* Example workflows */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Optimization Workflows
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Checkout Funnel Analysis</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Identify drop-off points and automatically generate A/B test variants to reduce friction.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Dynamic Pricing Strategy</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Adjust pricing based on real-time competitor analysis and current inventory levels.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Personalized Upselling</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Generate targeted product recommendations based on user browsing history and cart contents.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
           </div>
        </div>

      </div>
    </div>
  );
}
