import React from 'react';
import { ShoppingCart, Search, TrendingUp, Tags } from 'lucide-react';

interface ECommerceAgentsProps {
  onNavigate?: (view: string) => void;
}

export const ECommerceAgents: React.FC<ECommerceAgentsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-blue-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-blue-600 transition-colors">eCommerce Agents</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Intelligent agents focused on conversion rate optimization, inventory syncing, and customer service.
      </p>
      
      <div className="space-y-3">
        <button 
          onClick={() => onNavigate && onNavigate('ecommerce-agent')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Conversion Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Checkout flow optimization & A/B testing</div>
            </div>
          </div>
        </button>
        
        <button 
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed text-left"
        >
          <div className="flex items-center gap-3">
            <Tags className="w-5 h-5 text-slate-400" />
            <div>
              <div className="font-semibold text-sm text-slate-600">Pricing Engine Agent</div>
              <div className="text-[11px] text-slate-400 font-medium">Dynamic competitor matching (Coming soon)</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
