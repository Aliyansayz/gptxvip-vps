import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router";
import Catalog from "./Catalog";

const SunshineManual = lazy(() => import("./sunshine_distribution_manual/App"));

const manualPages = {
  ai_data_analyst_agent: lazy(() => import("./ai_data_analyst_agent/App")),
  competitive_intelligence_agent: lazy(() => import("./competitive_intelligence_agent/App")),
  market_intelligence_agent: lazy(() => import("./market_intelligence_agent/App")),
  vulnerability_remediation_agent: lazy(() => import("./vulnerability_remediation_agent/App")),
  insurance_claims_agent: lazy(() => import("./insurance_claims_agent/App")),
  coldchain_erp: lazy(() => import("./coldchain_erp/App")),
  customer_support_agent: lazy(() => import("./customer_support_agent/App")),
};

export default function SoftwareManualApp() {
  return <Suspense fallback={<div role="status" className="min-h-screen bg-zinc-950 p-8 text-zinc-100">Loading manual…</div>}>
    <Routes>
      <Route index element={<Catalog />} />
      <Route path="sunshine_distribution_manual" element={<SunshineManual />} />
      {Object.entries(manualPages).map(([path, Page]) => <Route key={path} path={path} element={<Page />} />)}
      <Route path="*" element={<div className="min-h-screen bg-zinc-950 p-8 text-zinc-100"><h1>Manual not found</h1><Link to="/">← Return to catalog</Link></div>} />
    </Routes>
  </Suspense>;
}
