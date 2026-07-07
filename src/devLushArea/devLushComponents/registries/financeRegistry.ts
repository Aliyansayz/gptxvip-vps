import { lazy } from 'react';

export const financeRegistry = {
  "finance-agents-algo": lazy(() => import('../devLushTopics/finance/AlgoTradingActivity')),
};
