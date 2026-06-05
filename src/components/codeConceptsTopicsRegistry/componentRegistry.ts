import React from 'react';
import { hftRegistry } from './hftRegistry';
import { cppHelloWorldRegistry } from './cppHelloWorldRegistry';
import { cppEngineDesignRegistry } from './cppEngineDesignRegistry';
import { pythonRegistry } from './pythonRegistry';

export const componentRegistry: Record<string, React.FC<any>> = {
  ...hftRegistry,
  ...cppHelloWorldRegistry,
  ...cppEngineDesignRegistry,
  ...pythonRegistry,
};
