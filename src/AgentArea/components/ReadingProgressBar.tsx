import React, { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  isDark?: boolean;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ isDark = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const roundedPct = Math.min(Math.max(Math.round(scrolled), 0), 100);
      setProgress(roundedPct);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial calculation
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const accentColor = isDark ? '#ef4444' : '#b91c1c';
  const trackColor = isDark ? 'rgba(38, 38, 38, 0.6)' : 'rgba(229, 226, 218, 0.4)';

  return (
    <div
      id="reading-progress-container"
      style={{ background: trackColor }}
      aria-hidden="true"
    >
      <div
        id="reading-progress-bar"
        style={{
          width: `${progress}%`,
          background: accentColor,
        }}
      />
    </div>
  );
};