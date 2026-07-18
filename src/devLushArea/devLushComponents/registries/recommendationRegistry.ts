import React from 'react';
import RecommendationActivity from '../devLushTopics/recommendation/RecommendationActivity';
import ExpenseTrackingActivity from '../devLushTopics/recommendation/ExpenseTrackingActivity';
import ExpenseTrackingTSActivity from '../devLushTopics/recommendation/ExpenseTrackingTSActivity';
import RecommendationSemanticMemoryActivity from '../devLushTopics/recommendation/RecommendationSemanticMemoryActivity';
import RecommendationReadingActivity from '../devLushTopics/recommendation/RecommendationReadingActivity';

export const recommendationRegistry: Record<string, React.ComponentType<any>> = {
  'recommendation-agents': RecommendationActivity,
  'recommendation-expense-tracking': ExpenseTrackingActivity,
  'recommendation-expense-typescript-1': ExpenseTrackingTSActivity,
  'recommendation-semantic-memory-activity': RecommendationSemanticMemoryActivity,
  'recommendation-reading-activity': RecommendationReadingActivity,
};
