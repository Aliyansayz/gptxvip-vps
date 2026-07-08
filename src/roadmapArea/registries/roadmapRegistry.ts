import React from 'react';
import { IntroductionToHFTLab } from '../roadmapTopics/C++_Trading_HFT/IntroductionToHFTLab';
import { OrderBookMicrostructureLab } from '../roadmapTopics/C++_Trading_HFT/OrderBookMicrostructureLab';
import { ExchangeColocationLab } from '../roadmapTopics/C++_Trading_HFT/ExchangeColocationLab';
import { RoadmapReadingActivity } from '../roadmapTopics/C++_Trading_HFT/readingGuide/RoadmapReadingActivity';

export const roadmapRegistry: Record<string, React.ComponentType<any>> = {
  'IntroductionToHFTReading': RoadmapReadingActivity,
  'OrderBookMicrostructureReading': RoadmapReadingActivity,
  'ExchangeColocationReading': RoadmapReadingActivity,
  'IntroductionToHFTLab': IntroductionToHFTLab,
  'OrderBookMicrostructureLab': OrderBookMicrostructureLab,
  'ExchangeColocationLab': ExchangeColocationLab,
};
