import React from 'react';
import { 
  PythonInterpretedVisual, 
  PythonTypingVisual, 
  PythonThreadingVisual,
  PythonQueueVisual,
  PythonDictVisual,
  PythonSqliteVisual,
  PythonMemoryVisual,
  PythonDescriptorsVisual,
  PythonSlotsVisual
} from '../codeConceptsTopics/python/visual';

export const pythonRegistry: Record<string, React.FC<any>> = {
  'python_interpreted_visual': PythonInterpretedVisual,
  'python_typing_visual': PythonTypingVisual,
  'python_threading_explainer': PythonThreadingVisual,
  'python_queue_visual': PythonQueueVisual,
  'python_dict_visual': PythonDictVisual,
  'python_sqlite_visual': PythonSqliteVisual,
  'python_memory_visual': PythonMemoryVisual,
  'python_descriptors_visual': PythonDescriptorsVisual,
  'python_slots_visual': PythonSlotsVisual,
};
