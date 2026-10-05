import { lazy } from 'react';

/** One lazy import per prototype; catalog cards never load dashboard bundles. */
export const prototypes = {
  logistics: {
    title: 'AI Logistics Dispatcher',
    component: lazy(() => import('./ai-logistics-dispatcher-prototype/App')),
  },
  'project-management': {
    title: 'Project Management',
    component: lazy(() => import('./project-management/App')),
  },
};
export type PrototypeId = keyof typeof prototypes;
export const getPrototypePath = (id: PrototypeId) => `/prototypes/${id}`;
export const getPrototypeUrl = (id: PrototypeId) => `/agents${getPrototypePath(id)}`;
export function isPrototypeId(value: string | undefined): value is PrototypeId {
  return !!value && Object.prototype.hasOwnProperty.call(prototypes, value);
}
