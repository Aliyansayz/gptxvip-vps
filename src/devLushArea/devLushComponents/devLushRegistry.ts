import React from 'react';
import { cybersecurityRegistry } from './registries/cybersecurityRegistry';
import { ecommerceRegistry } from './registries/ecommerceRegistry';
import { accountingRegistry } from './registries/accountingRegistry';
import { financeRegistry } from './registries/financeRegistry';
import { agentTypesRegistry } from './registries/agentTypesRegistry';
import { agentMemoriesRegistry } from './registries/agentMemoriesRegistry';
import { systemDesignRegistry } from './registries/systemDesignRegistry';
import { reinforcementLearningRegistry } from './registries/reinforcementLearningRegistry';
import { devtoolsRegistry } from './registries/devtoolsRegistry';
import { healthcareRegistry } from './registries/healthcareRegistry';
import { legalRegistry } from './registries/legalRegistry';
import { supplychainRegistry } from './registries/supplychainRegistry';
import { helpdeskRegistry } from './registries/helpdeskRegistry';
import { recommendationRegistry } from './registries/recommendationRegistry';
import { marketingRegistry } from './registries/marketingRegistry';
import { voiceAgentsRegistry } from './registries/voiceAgentsRegistry';

export const devLushRegistry: Record<string, React.ComponentType<any>> = {
  ...reinforcementLearningRegistry,
  ...cybersecurityRegistry,
  ...ecommerceRegistry,
  ...accountingRegistry,
  ...financeRegistry,
  ...agentTypesRegistry,
  ...agentMemoriesRegistry,
  ...systemDesignRegistry,
  ...devtoolsRegistry,
  ...healthcareRegistry,
  ...legalRegistry,
  ...supplychainRegistry,
  ...marketingRegistry,
  ...helpdeskRegistry,
  ...recommendationRegistry,
  ...voiceAgentsRegistry,
};

export default devLushRegistry;

