import type { ComponentType } from 'react';
import {
  BarChart3,
  Calculator,
  Compass,
  Database,
  Layers,
  Search,
  ShoppingBag,
} from 'lucide-react';

export const agenticRoleIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Search,
  Calculator,
  ShoppingBag,
  Compass,
  Database,
  BarChart2: BarChart3,
  BarChart3,
};

export const getAgenticRoleIcon = (iconName: string) => agenticRoleIconMap[iconName] || Layers;
