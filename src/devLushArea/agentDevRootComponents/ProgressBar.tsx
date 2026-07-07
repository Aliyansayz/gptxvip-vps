
import React from 'react';
import { TrophyIcon } from './icons/index';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <TrophyIcon className="w-6 h-6 text-primary" />
      <div className="w-full bg-muted rounded-full h-3">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground">{current}/{total} Completed</span>
    </div>
  );
};

export default ProgressBar;