import React from 'react';
import AnatomyExplorer from '../medLabTopics/anatomy/AnatomyExplorer';

export const anatomyRegistry: Record<string, React.ComponentType<any>> = {
  'anatomy-explorer': AnatomyExplorer,
};
