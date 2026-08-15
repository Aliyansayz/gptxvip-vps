import React from 'react';

const KEY_TERMS = [
  'latency', 'lock-free', 'unordered_map', 'cache misses', 'padding', 'atomic',
  'order book', 'NIC', 'kernel bypass', 'ring buffer', 'price-time priority',
  'struct padding', 'hazard pointers', 'memory alignment', 'volatility', 'expectancy',
  'pipeline', 'compare_exchange_weak', 'head pointer', 'tail pointer',
  'memory visibility', 'compare-and-swap', 'cache line'
];

export const HighlightedText: React.FC<{ text: string; themeColor?: string }> = ({ text, themeColor = 'indigo' }) => {
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const termRegex = new RegExp(`\\b(${KEY_TERMS.map(escapeRegExp).join('|')})\\b`, 'gi');
  
  const bgColors: any = {
    emerald: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-700 font-bold px-1.5 py-0.5 rounded shadow-sm',
    blue: 'bg-blue-100 dark:bg-blue-800/40 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700 font-bold px-1.5 py-0.5 rounded shadow-sm',
    indigo: 'bg-indigo-100 dark:bg-indigo-800/40 text-indigo-900 dark:text-indigo-100 border-indigo-200 dark:border-indigo-700 font-bold px-1.5 py-0.5 rounded shadow-sm'
  };

  const highlightClass = bgColors[themeColor] || bgColors.indigo;

  // First process snippets
  if (!text) return null;
  const partsWithSnippets = text.split(/(\$snippet.*?snippet\$)/gs);

  return (
    <span>
      {partsWithSnippets.map((part, index) => {
        if (part.startsWith('$snippet') && part.endsWith('snippet$')) {
          const code = part.replace(/^\$snippet/g, '').replace(/snippet\$$/g, '').trim();
          return (
            <span 
              key={`snippet-${index}`} 
              className={`font-mono text-[0.85em] px-1.5 py-0.5 rounded-md inline-block whitespace-pre align-middle bg-zinc-100 dark:bg-[#0f172a] text-indigo-700 dark:text-indigo-300 border border-zinc-200 dark:border-indigo-500/20 shadow-sm dark:shadow-inner mx-1`}
              style={{ lineHeight: '1.2' }}
            >
              {code}
            </span>
          );
        }

        // Then process key terms for the actual text
        const textParts = part.split(termRegex);
        return (
          <span key={`text-${index}`}>
            {textParts.map((tPart, i) => {
              if (KEY_TERMS.some(t => t.toLowerCase() === tPart.toLowerCase())) {
                return (
                  <span key={`term-${i}`} className={`inline-block border text-[0.9em] mb-0.5 ${highlightClass}`}>
                    {tPart}
                  </span>
                );
              }
              return <span key={`plain-${i}`}>{tPart}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
};
