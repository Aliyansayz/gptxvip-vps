import React from 'react';
import { Tag, Package, Users, TrendingUp, Settings } from 'lucide-react';
import { EcommerceSidebarView } from '../components/EcommerceAgentSidebar';
import AgentPreviewNotice from '../../components/AgentPreviewNotice';
import SourceStatus from '../../components/SourceStatus';

interface EcommerceDataViewProps {
  viewType: EcommerceSidebarView;
}

export default function EcommerceDataView({ viewType }: EcommerceDataViewProps) {
  const content = {
    pricing: {
      title: "Dynamic Pricing Engine",
      icon: Tag,
      description: "Illustrative pricing decisions; no price was changed.",
      items: [
        { label: "Premium Noise Cancelling Headphones", value: "Example proposal: raise price $15 if a competitor stockout is verified." },
        { label: "Wireless Ergonomic Mouse", value: "Example proposal: review a $2.50 decrease after margin and competitor checks." },
        { label: "Mechanical Keyboard (Blue Switch)", value: "Example proposal: hold a $129.99 price while validating margin assumptions." }
      ]
    },
    inventory: {
      title: "Inventory Synchronization",
      icon: Package,
      description: "Illustrative inventory records; no channel is connected.",
      items: [
        { label: "Warehouse A (East Coast)", value: "SKU: MAC-M2-16GB (Low Stock: 4 remaining)" },
        { label: "Shopify Storefront", value: "Example storefront record. Connection and last sync are unavailable." },
        { label: "Amazon FBA", value: "Example inbound shipment of 200 units; receipt is unverified." }
      ]
    },
    customer_segmentation: {
      title: "Customer Segmentation",
      icon: Users,
      description: "Illustrative customer groups for exploring possible actions.",
      items: [
        { label: "High-value repeat buyers", value: "Example group size: 245 and average order value: $450. Possible action: review early-access eligibility." },
        { label: "Discount-focused buyers", value: "Example group size: 1,420. Possible action: review clearance eligibility before a campaign." },
        { label: "Cart abandoners (72 hr)", value: "Example group size: 89. Possible action: test a recovery offer after consent and margin review." }
      ]
    },
    forecasting: {
      title: "Demand Forecasting",
      icon: TrendingUp,
      description: "Illustrative demand scenarios without a connected forecast model.",
      items: [
        { label: "Q4 Holiday Spike", value: "Example assumption: 45% year-over-year growth in consumer electronics." },
        { label: "Stockout Risk", value: "Example projection: SKU 4K-MON-27 could stock out in 14 days if the assumed run rate holds." },
        { label: "Procurement Review", value: "Example next step: verify demand and supplier terms before considering an order for SKU 4K-MON-27." }
      ]
    },
    settings: {
      title: "Store Connections",
      icon: Settings,
      description: "Example connection and pricing-rule labels; this preview cannot configure integrations.",
      items: [
        { label: "Shopify Integration", value: "Example store label: acme-electronics.myshopify.com (connection not verified)" },
        { label: "Amazon Seller Central", value: "Example marketplace label: US (connection not verified)" },
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
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 px-4 py-6 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-amber-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>Values and recommendations are illustrative records; a source, measurement window, and connected storefront are not provided here.</AgentPreviewNotice>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-sm text-slate-600 font-medium">{item.value}</p>
                  <SourceStatus source="Built-in commerce record" freshness="No connected storefront or measurement window" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
