import React from 'react';
import SupplyChainInventoryActivity from '../devLushTopics/supplychain/SupplyChainInventoryActivity';
import SupplyChainRoutePlanningActivity from '../devLushTopics/supplychain/SupplyChainRoutePlanningActivity';
import SupplyChainSupplierRiskActivity from '../devLushTopics/supplychain/SupplyChainSupplierRiskActivity';
import SupplyChainWarehouseOrchestrationActivity from '../devLushTopics/supplychain/SupplyChainWarehouseOrchestrationActivity';

export const supplychainRegistry: Record<string, React.ComponentType<any>> = {
  'supplychain-inventory': SupplyChainInventoryActivity,
  'supplychain-route-planning': SupplyChainRoutePlanningActivity,
  'supplychain-supplier-risk': SupplyChainSupplierRiskActivity,
  'supplychain-warehouse-orchestration': SupplyChainWarehouseOrchestrationActivity,
};
