import type { AgenticRoleDefinition, RoleDomain } from '../agenticRoles/agenticRoleTypes';

export interface AgenticRoleUseCase {
  situation: string;
  decision: string;
  evidence: string;
}

// Cover every registered role domain; adding a domain requires its use-case copy.
const useCases: Record<RoleDomain, AgenticRoleUseCase> = {
  seo: {
    situation: 'A page loses search visibility as intent and technical signals change.',
    decision: 'Inspect intent, structured data, internal links, and performance before choosing a fix.',
    evidence: 'Explain which signal supports the next optimization step.',
  },
  accountant: {
    situation: 'A sample ledger has transactions that need reconciliation and review.',
    decision: 'Check double-entry balance, trace anomalies, and keep the original records visible.',
    evidence: 'Document the exception and the reason for a human review.',
  },
  commerce: {
    situation: 'A simulated commerce flow must respond to price and inventory pressure.',
    decision: 'Compare margin limits, stock state, and customer impact before an action.',
    evidence: 'Show why the chosen path stays within the scenario rules.',
  },
  recommendation: {
    situation: 'A new customer needs relevant suggestions with little prior history.',
    decision: 'Trace candidate retrieval and ranking while checking diversity trade-offs.',
    evidence: 'Compare the recommendation with the signals that produced it.',
  },
  preprocessing: {
    situation: 'An incoming data feed contains missing values or a changed schema.',
    decision: 'Identify the drift, choose an imputation path, and preserve data contracts.',
    evidence: 'Record the quality check before the data reaches a model.',
  },
  visualization: {
    situation: 'Complex data needs a view that a wider audience can interpret.',
    decision: 'Choose accessible visual encodings and inspect the explanation behind the chart.',
    evidence: 'Make the key pattern and its uncertainty easy to see.',
  },
  mobility: {
    situation: 'Ride requests may exceed available drivers in specific zones and hours.',
    decision: 'Validate trip coverage, compare demand and supply, and recommend feasible driver moves.',
    evidence: 'Check zone-level forecasts, travel times, and remaining coverage before dispatch review.',
  },
  retail: {
    situation: 'A store may run out of a product while other locations hold excess stock.',
    decision: 'Account for stockouts, supplier lead times, and transfers before proposing a replenishment order.',
    evidence: 'Check stock coverage, pack sizes, budget, and the buyer approval trail.',
  },
  procurement: {
    situation: 'Supplier quotations and invoices use different terms or contain purchasing exceptions.',
    decision: 'Normalize offers, assess supplier reliability, and match purchase orders, invoices, and receipts.',
    evidence: 'Trace unit costs and document lines before a buyer reviews the recommendation.',
  },
  contracts: {
    situation: 'An agreement has duties and deadlines that change when an amendment is executed.',
    decision: 'Extract source-cited obligations and calculate action windows from the operative agreement.',
    evidence: 'Check executed clauses, amendment precedence, and owner review before updating the register.',
  },
  uiux: {
    situation: 'A flow works for most people but blocks others, and the interface itself is slowing them down.',
    decision: 'Audit accessibility barriers, navigation depth, funnel drop-off, layout hierarchy, and interaction latency.',
    evidence: 'Cite the contrast ratio, event, timing, or DOM detail behind each proposed interface change.',
  },
};

export function getAgenticRoleUseCase(role: Pick<AgenticRoleDefinition, 'roleDomain' | 'description'>): AgenticRoleUseCase {
  return useCases[role.roleDomain] ?? {
    situation: role.description,
    decision: 'Inspect the case inputs and constraints before choosing the next action.',
    evidence: 'Trace the recommendation to source evidence and review its assumptions.',
  };
}
