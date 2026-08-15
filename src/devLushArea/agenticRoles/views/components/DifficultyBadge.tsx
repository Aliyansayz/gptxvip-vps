import React from 'react';
import { Difficulty } from '../../agenticRoleTypes';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const badge = getDifficultyBadge(difficulty);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-200 ${badge.badgeClass} ${sizeClasses[size]} ${className}`}
      title={`Difficulty: ${badge.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
      {showLabel && <span>{badge.label}</span>}
    </span>
  );
};

export default DifficultyBadge;
