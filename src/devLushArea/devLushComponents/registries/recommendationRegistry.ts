import React from 'react';
import RecommendationActivity from '../devLushTopics/recommendation/RecommendationActivity';
import ExpenseTrackingActivity from '../devLushTopics/recommendation/ExpenseTrackingActivity';
import ExpenseTrackingTSActivity from '../devLushTopics/recommendation/ExpenseTrackingTSActivity';
import RecommendationSemanticMemoryActivity from '../devLushTopics/recommendation/RecommendationSemanticMemoryActivity';

export const recommendationRegistry: Record<string, React.ComponentType<any>> = {
  'recommendation-agents': RecommendationActivity,
  'recommendation-expense-tracking': ExpenseTrackingActivity,
  'recommendation-expense-typescript-1': ExpenseTrackingTSActivity,
  'recommendation-semantic-memory-activity': RecommendationSemanticMemoryActivity,
};
