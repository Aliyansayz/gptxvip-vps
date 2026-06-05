import React from 'react';
import { 
  OrderBookVisual, StructPaddingVisual, PointerArithmeticVisual, VolatilityResponseVisual, HFTStackHierarchyVisual
} from '../codeConceptsTopics/cpp_engine_design/visual';

export const cppEngineDesignRegistry: Record<string, React.FC<any>> = {
  'cpp_adv_order_book': OrderBookVisual,
  'cpp_struct_padding': StructPaddingVisual,
  'cpp_ptr_arithmetic': PointerArithmeticVisual,
  'cpp_volatility_response': VolatilityResponseVisual,
  'cpp_hft_hierarchy': HFTStackHierarchyVisual,
};
