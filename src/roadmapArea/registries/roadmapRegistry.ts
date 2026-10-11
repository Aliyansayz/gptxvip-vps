import React from 'react';
import { cppTradingHFTRegistry } from './cppTradingHFTRegistry';

export const roadmapRegistry: Record<string, React.ComponentType<any>> = {
  ...cppTradingHFTRegistry,
};

export default roadmapRegistry;

