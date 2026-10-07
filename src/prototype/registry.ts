import { lazy } from "react";

/** One lazy import per prototype; catalog cards never load dashboard bundles. */
export const prototypes = {
  logistics: {
    title: "AI Logistics Dispatcher",
    screenshot: "/prototype-previews/logistics.png",
    component: lazy(() => import("./ai-logistics-dispatcher-prototype/App")),
  },
  "project-management": {
    title: "Project Management",
    screenshot: "/prototype-previews/project-management.png",
    component: lazy(() => import("./project-management/App")),
  },
  "pulse-analytics": {
    title: "Pulse Analytics",
    screenshot: "/prototype-previews/pulse-analytics.png",
    component: lazy(() => import("./pulse-analytics/App")),
  },
  "storefront-pro": {
    title: "Storefront Pro",
    screenshot: "/prototype-previews/storefront-pro.png",
    component: lazy(() => import("./storefront-pro/App")),
  },
  ledgerline: {
    title: "Ledgerline",
    screenshot: "/prototype-previews/ledgerline.png",
    component: lazy(() => import("./ledgerline/App")),
  },
  "orbit-crm": {
    title: "Orbit CRM",
    screenshot: "/prototype-previews/orbit-crm.png",
    component: lazy(() => import("./orbit-crm/App")),
  },
  "saas-metrics-kit": {
    title: "SaaS Metrics Kit",
    screenshot: "/prototype-previews/saas-metrics-kit.png",
    component: lazy(() => import("./saas-metrics-kit/App")),
  },
  adsphere: {
    title: "AdSphere",
    screenshot: "/prototype-previews/adsphere.png",
    component: lazy(() => import("./adsphere/App")),
  },
  clinicare: {
    title: "CliniCare",
    screenshot: "/prototype-previews/clinicare.png",
    component: lazy(() => import("./clinicare/App")),
  },
  chainpulse: {
    title: "ChainPulse",
    screenshot: "/prototype-previews/chainpulse.png",
    component: lazy(() => import("./chainpulse/App")),
  },
  "hq-admin": {
    title: "HQ Admin",
    screenshot: "/prototype-previews/hq-admin.png",
    component: lazy(() => import("./hq-admin/App")),
  },
  "insight-boards": {
    title: "Insight Boards",
    screenshot: "/prototype-previews/insight-boards.png",
    component: lazy(() => import("./insight-boards/App")),
  },
  fundview: {
    title: "Fundview",
    screenshot: "/prototype-previews/fundview.png",
    component: lazy(() => import("./fundview/App")),
  },
};
export type PrototypeId = keyof typeof prototypes;
export const getPrototypePath = (id: PrototypeId) => `/prototypes/${id}`;
export const getPrototypeUrl = (id: PrototypeId) =>
  `/agents${getPrototypePath(id)}`;
export function isPrototypeId(value: string | undefined): value is PrototypeId {
  return !!value && Object.prototype.hasOwnProperty.call(prototypes, value);
}
