import React from 'react';
import DatabaseShardingActivity from '../devLushTopics/system-design/DatabaseShardingActivity';
import EventDrivenArchitectureActivity from '../devLushTopics/system-design/EventDrivenArchitectureActivity';
import { SystemDesignOverviewActivity } from '../devLushTopics/system-design/SystemDesignOverviewActivity';
import RateLimitingActivity from '../devLushTopics/system-design/RateLimitingActivity';
import LoadBalancingActivity from '../devLushTopics/system-design/LoadBalancingActivity';
import SystemDesignMorphologyActivity from '../devLushTopics/system-design/SystemDesignMorphologyActivity';
import ApiGatewayDesignActivity from '../devLushTopics/system-design/ApiGatewayDesignActivity';
import SystemDesignReadingActivity from '../devLushTopics/system-design/SystemDesignReadingActivity';

export const systemDesignRegistry: Record<string, React.ComponentType<any>> = {
  'database-sharding-replication': DatabaseShardingActivity,
  'event-driven-architecture': EventDrivenArchitectureActivity,
  'mp_system_design_overview': SystemDesignOverviewActivity,
  'rate-limiting-strategies': RateLimitingActivity,
  'load-balancing-algorithms': LoadBalancingActivity,
  'system-design-morphology': SystemDesignMorphologyActivity,
  'api-gateway-design': ApiGatewayDesignActivity,
  'system-design-reading-activity': SystemDesignReadingActivity,
};
