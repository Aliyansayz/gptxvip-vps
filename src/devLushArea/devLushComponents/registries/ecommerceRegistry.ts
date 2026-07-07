import React from 'react';
import MultiAgentCheckoutFlow from '../devLushTopics/ecommerce/MultiAgentCheckoutFlow';
import AgentSyncPythonActivity from '../devLushTopics/ecommerce/AgentSyncPythonActivity';
import AgentSyncTypescriptActivity from '../devLushTopics/ecommerce/AgentSyncTypescriptActivity';
import GenericAgentActivity from '../devLushTopics/ecommerce/GenericAgentActivity';
import BusinessLensActivity from '../devLushTopics/ecommerce/BusinessLensActivity';
import DeveloperLensActivity from '../devLushTopics/ecommerce/DeveloperLensActivity';
import SecurityLensActivity from '../devLushTopics/ecommerce/SecurityLensActivity';
import SimilarProductsOnDiscountActivity from '../devLushTopics/ecommerce/SimilarProductsOnDiscountActivity';

export const ecommerceRegistry: Record<string, React.ComponentType<any>> = {
  'ecommerce-agents': MultiAgentCheckoutFlow,
  'ecommerce-agents-revenue': GenericAgentActivity,
  'ecommerce-agents-forecasting': GenericAgentActivity,
  'ecommerce-agents-localization': GenericAgentActivity,
  'ecommerce-agents-sync': MultiAgentCheckoutFlow,
  'ecommerce-agents-python': AgentSyncPythonActivity,
  'ecommerce-agents-typescript': AgentSyncTypescriptActivity,
  'ecommerce-agents-business-lens': BusinessLensActivity,
  'ecommerce-agents-developer-lens': DeveloperLensActivity,
  'ecommerce-agents-security-lens': SecurityLensActivity,
  'ecommerce-agents-similar-discount': SimilarProductsOnDiscountActivity,
};
