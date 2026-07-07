import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Activity, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';

export default function EcommerceDashboardView() {
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
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Conversion Agent: Active</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Revenue Impact: +$12,450</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <ShoppingCart className="w-4 h-4 text-blue-500" />
            <span>Cart Abandonment: -4.2%</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-8">
        
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
               </div>
               <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                   <TrendingUp className="w-4 h-4" /> Upsell Opportunity
                 </div>
                 <p className="text-xs text-emerald-600/80">Frequently bought together items are not surfaced during checkout for premium electronics.</p>
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Live Agent Activity
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-mono text-xs text-slate-600 space-y-2 h-[104px] overflow-y-auto">
              <div className="text-blue-600">[14:22:01] ConversionAgent: Analyzing A/B test results for hero CTA...</div>
              <div className="text-slate-500">[14:22:15] ConversionAgent: Variant B showing 12% lift.</div>
              <div className="text-slate-500">[14:23:42] PricingAgent: Monitoring competitor price changes for SKU-1042.</div>
              <div className="animate-pulse text-blue-600">_</div>
            </div>
          </div>
        </div>

        {/* Live Use Cases Examples */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Optimization Workflows
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Checkout Funnel Analysis</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Identify drop-off points and automatically generate A/B test variants to reduce friction.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Dynamic Pricing Strategy</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Adjust pricing based on real-time competitor analysis and current inventory levels.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">Personalized Upselling</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Generate targeted product recommendations based on user browsing history and cart contents.</p>
                <div className="text-xs font-mono text-blue-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
