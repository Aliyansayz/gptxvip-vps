import React from 'react';
import { Tag, Package, Users, TrendingUp, Settings } from 'lucide-react';
import { EcommerceSidebarView } from '../components/EcommerceAgentSidebar';

interface EcommerceDataViewProps {
  viewType: EcommerceSidebarView;
}

export default function EcommerceDataView({ viewType }: EcommerceDataViewProps) {
  const content = {
    pricing: {
      title: "Dynamic Pricing Engine",
      icon: Tag,
      description: "Automated price adjustments based on competitor analysis and demand.",
      items: [
        { label: "Premium Noise Cancelling Headphones", value: "Price increased +$15.00 (Competitor stockout detected)" },
        { label: "Wireless Ergonomic Mouse", value: "Price decreased -$2.50 (Match Amazon Buy Box)" },
        { label: "Mechanical Keyboard (Blue Switch)", value: "Price held steady at $129.99 (Optimal margin reached)" }
      ]
    },
    inventory: {
      title: "Inventory Synchronization",
      icon: Package,
      description: "Multi-channel inventory tracking and low-stock alerts.",
      items: [
        { label: "Warehouse A (East Coast)", value: "SKU: MAC-M2-16GB (Low Stock: 4 remaining)" },
        { label: "Shopify Storefront", value: "Sync Status: Healthy. Last sync 2 minutes ago." },
        { label: "Amazon FBA", value: "Inbound shipment receiving. +200 units added to pool." }
      ]
    },
    customer_segmentation: {
      title: "Customer Segmentation",
      icon: Users,
      description: "AI-driven grouping of customers based on purchasing behavior.",
      items: [
        { label: "High-LTV 'Whales'", value: "Segment Size: 245. Average Order Value: $450. Action: VIP Early Access." },
        { label: "Discount Chasers", value: "Segment Size: 1,420. Action: Target with clearance sale email." },
        { label: "Cart Abandoners (72hr)", value: "Segment Size: 89. Action: Trigger 10% recovery discount." }
      ]
    },
    forecasting: {
      title: "Demand Forecasting",
      icon: TrendingUp,
      description: "Predictive analytics for upcoming sales velocity and stock requirements.",
      items: [
        { label: "Q4 Holiday Spike", value: "Predicted +45% YoY growth in Consumer Electronics." },
        { label: "Stockout Risk", value: "SKU: 4K-MON-27. Projected to stock out in 14 days based on current run rate." },
        { label: "Procurement Recommendation", value: "Generate PO for 500 units of SKU: 4K-MON-27 from Supplier B." }
      ]
    },
    settings: {
      title: "Store Connections",
      icon: Settings,
      description: "Manage API keys and integration settings for various storefronts.",
      items: [
        { label: "Shopify Integration", value: "Connected (Store: acme-electronics.myshopify.com)" },
        { label: "Amazon Seller Central", value: "Connected (Marketplace: US)" },
        { label: "Pricing Rules", value: "Max margin sacrifice: 15%. Minimum allowed price floor: Cost + 5%." }
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
            <Icon className="w-6 h-6 text-amber-600" />
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
