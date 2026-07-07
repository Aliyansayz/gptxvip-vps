import React from 'react';
import DevToolsActivity from '../devLushTopics/devtools/DevToolsActivity';

export const devtoolsRegistry: Record<string, React.ComponentType<any>> = {
  'devtools-agents': DevToolsActivity,
};
