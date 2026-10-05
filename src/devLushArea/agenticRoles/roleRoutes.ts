import { agenticRoleDefinitions } from './data';
import type { AgenticRoleDefinition } from './agenticRoleTypes';

/** Role domains are short, unique, stable URL segments. */
export const getAgenticRoleBySlug = (slug?: string | null): AgenticRoleDefinition | undefined =>
  agenticRoleDefinitions.find((role) => role.roleDomain === slug);

/** Path within the React Router whose basename is /agents. */
export const getAgenticRolePath = (roleId: string): string => {
  const role = agenticRoleDefinitions.find((item) => item.id === roleId);
  return role ? `/lab/${role.roleDomain}` : '/lab';
};

/** Full URL path for links opened outside the Agent Labs router. */
export const getAgenticRoleHref = (roleId: string): string =>
  `/agents${getAgenticRolePath(roleId)}`;

export const getAgenticRoleSearchPath = (roleId: string): string =>
  `${getAgenticRolePath(roleId)}/search`;

export const getAgenticRoleChapterPath = (roleId: string, chapterId: string): string =>
  `${getAgenticRolePath(roleId)}/cases/${encodeURIComponent(chapterId)}`;
