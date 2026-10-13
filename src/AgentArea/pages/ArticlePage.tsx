import React from 'react';
import { ArticlePage } from '../components/ArticlePage';
import { safeHavenMirrorArticle } from '../data/articles';

export const AgentAreaArticlePage: React.FC = () => {
  return (
    <ArticlePage article={safeHavenMirrorArticle} isDark={false} />
  );
};

export default AgentAreaArticlePage;