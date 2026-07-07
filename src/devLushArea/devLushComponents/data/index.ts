import offensiveAiData from './offensiveAi.json';
import ecommerceData from './ecommerce.json';
import accountingData from './accounting.json';
import financeData from './finance.json';
import agentTypesData from './agentTypes.json';
import webBugBountyData from './web-bugbounty.json';
import systemDesignData from './system-design.json';
import reinforcementLearningData from './reinforcement-learning.json';
import devtoolsData from './devtools.json';
import healthcareData from './healthcare.json';
import legalData from './legal.json';
import supplychainData from './supplychain.json';
import helpdeskData from './helpdesk.json';
import recommendationData from './recommendation.json';
import agentMemoriesData from './agentMemories.json';
import marketingData from './marketing.json';

const devLushChaptersRaw = [
  ...reinforcementLearningData,
  ...offensiveAiData,
  ...ecommerceData,
  ...accountingData,
  ...financeData,
  ...agentTypesData,
  ...agentMemoriesData,
  ...webBugBountyData,
  ...systemDesignData,
  ...devtoolsData,
  ...healthcareData,
  ...legalData,
  ...supplychainData,
  ...marketingData,
  ...helpdeskData,
  ...recommendationData
];

export default devLushChaptersRaw;
