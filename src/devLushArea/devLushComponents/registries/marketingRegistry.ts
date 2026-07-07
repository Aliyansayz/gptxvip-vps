import React from 'react';
import MarketingCampaignAgentActivity from '../devLushTopics/marketing/MarketingCampaignAgentActivity';
import MarketingPersonaAgentActivity from '../devLushTopics/marketing/MarketingPersonaAgentActivity';
import MarketingContentAgentActivity from '../devLushTopics/marketing/MarketingContentAgentActivity';

export const marketingRegistry: Record<string, React.ComponentType<any>> = {
  'marketing-campaign-agent': MarketingCampaignAgentActivity,
  'marketing-persona-agent': MarketingPersonaAgentActivity,
  'marketing-content-agent': MarketingContentAgentActivity,
};
