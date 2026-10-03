import type { ComponentType } from 'react';
import {
  BarChart3,
  CarTaxiFront,
  Calculator,
  ClipboardList,
  Compass,
  Database,
  FileText,
  Layers,
  PackageSearch,
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
  CarTaxiFront,
  PackageSearch,
  ClipboardList,
  FileText,
};

export const getAgenticRoleIcon = (iconName: string) => agenticRoleIconMap[iconName] || Layers;
