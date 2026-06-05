export type LeverageType = 'CROSS_MARGIN' | 'ISOLATED_MARGIN';

export const DEFAULT_LEVERAGE_TYPE: LeverageType = 'CROSS_MARGIN';

export interface LeverageArchitectureInfo {
  type: LeverageType;
  title: string;
  description: string;
}

export const LEVERAGE_ARCHITECTURE_INFO: Record<LeverageType, LeverageArchitectureInfo> = {
  'CROSS_MARGIN': {
    type: 'CROSS_MARGIN',
    title: 'Cross Margin',
    description: 'Cross margin systems pool all equity together. This means unrealized gains contribute to available equity, profits can finance new positions, and broker may permit additional margin usage.'
  },
  'ISOLATED_MARGIN': {
    type: 'ISOLATED_MARGIN',
    title: 'Isolated Margin',
    description: 'Isolated margin assigns a fixed or specified amount of margin to a single position, restricting potential losses to the isolated amount.'
  }
};
