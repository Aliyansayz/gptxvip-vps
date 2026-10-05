/** Paths are relative to the Agent Labs router basename, /agents. */
export const labViewPaths = {
  landing: '/lab',
  'devlush-search': '/lab/search',
  reading: '/lab/reading',
  articles: '/lab/articles',
  blogs: '/lab/blogs',
  favorites: '/lab/favorites',
  'topic-theory': '/lab/theory',
  devlush: '/lab/topics',
  'agent-workspace': '/lab/workspace',
} as const;

export type LabView = keyof typeof labViewPaths;
export const getLabViewPath = (view: LabView): string => labViewPaths[view];
