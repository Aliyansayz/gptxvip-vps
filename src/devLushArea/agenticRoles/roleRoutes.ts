import { agenticRoleDefinitions } from './data';
import type { AgenticRoleDefinition } from './agenticRoleTypes';

/** Role domains are short, unique, stable URL segments. */
export const getAgenticRoleBySlug = (slug?: string | null): AgenticRoleDefinition | undefined =>
  agenticRoleDefinitions.find((role) => role.roleDomain === slug);

export const getAgenticRoleHref = (roleId: string): string => {
  const role = agenticRoleDefinitions.find((item) => item.id === roleId);
  return role ? `/agents/lab/${role.roleDomain}` : '/agents/lab';
};
