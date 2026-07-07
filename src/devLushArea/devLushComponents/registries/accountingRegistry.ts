import React from 'react';
import AutomatedReconciliation from '../devLushTopics/accounting/AutomatedReconciliation';
import AutomatedTaxComplianceActivity from '../devLushTopics/accounting/AutomatedTaxComplianceActivity';
import ExpenseReconciliationActivity from '../devLushTopics/accounting/ExpenseReconciliationActivity';

export const accountingRegistry: Record<string, React.ComponentType<any>> = {
  'accounting-agents': AutomatedReconciliation,
  'accounting-tax-compliance': AutomatedTaxComplianceActivity,
  'accounting-expense-reconciliation': ExpenseReconciliationActivity,
};
