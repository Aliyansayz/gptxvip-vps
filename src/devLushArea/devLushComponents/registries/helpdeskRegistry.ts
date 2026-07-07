import React from 'react';
import HelpdeskActivity from '../devLushTopics/helpdesk/HelpdeskActivity';

export const helpdeskRegistry: Record<string, React.ComponentType<any>> = {
  'helpdesk-agents': HelpdeskActivity,
};
