import React from 'react';
import { CompiledLanguageVisual, MemoryManagementVisual, OOPVisual, InteractiveQuestionVisual } from './visual';

export const cppHelloWorldRegistry: Record<string, React.FC<any>> = {
  'cpp_compiled_visual': CompiledLanguageVisual,
  'cpp_memory_visual': MemoryManagementVisual,
  'cpp_oop_visual': OOPVisual,
  'cpp_basic_q1': InteractiveQuestionVisual,
  'cpp_basic_q2': InteractiveQuestionVisual,
  'cpp_basic_q3': InteractiveQuestionVisual,
  'cpp_basic_q4': InteractiveQuestionVisual,
  'cpp_basic_q5': InteractiveQuestionVisual,
};
