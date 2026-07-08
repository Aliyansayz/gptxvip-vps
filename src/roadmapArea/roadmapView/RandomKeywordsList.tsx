import React, { useState, useEffect } from 'react';
import { LabData } from '../../devLushArea/agentDevRootComponents/types';
import { Tag } from 'lucide-react';

interface RandomKeywordsListProps {
  chapters: LabData[];
}

export const RandomKeywordsList: React.FC<RandomKeywordsListProps> = ({ chapters }) => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    // Extract tags from chapters
    const allTags = new Set<string>();
    
    chapters.forEach(chapter => {
      if (chapter.tags) {
        chapter.tags.forEach(tag => allTags.add(tag));
      }
      if (chapter.interactive_questions) {
        chapter.interactive_questions.forEach(q => {
          if (q.tags) {
            q.tags.forEach(tag => allTags.add(tag));
          }
        });
      }
    });

    const tagsArray = Array.from(allTags).filter(Boolean);
    
    // Shuffle and pick a random subset (e.g., up to 10)
    const shuffled = tagsArray.sort(() => 0.5 - Math.random());
    setKeywords(shuffled.slice(0, 10));

  }, [chapters]);

  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-4 mb-8 bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase mb-1 flex items-center gap-1">
        <Tag size={12} />
        Random Keywords
      </span>
      <div className="flex flex-wrap gap-2">
        {keywords.map(keyword => (
          <span key={keyword} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono rounded-full border border-slate-200 dark:border-slate-700">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RandomKeywordsList;
