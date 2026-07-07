import React, { useEffect, useRef } from 'react';

interface TextRevealOnScrollProps {
  text: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  subScroll: number;
}

export const TextRevealOnScroll: React.FC<TextRevealOnScrollProps> = ({ 
  text, 
  className, 
  containerRef, 
  subScroll 
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    // Split text into words and wrap them in span elements
    // Using opacity-30 for unrevealed and opacity-100 for revealed words
    const words = text.split(' ').map(word => `<span class="opacity-20 transition-opacity duration-300 word">${word}</span>`);
    paragraph.innerHTML = words.join(' ');
  }, [text]);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    const container = containerRef.current;
    if (!paragraph || !container) return;

    const updateVisibility = () => {
      const wordSpans = paragraph.querySelectorAll('.word');
      const totalWords = wordSpans.length;
      if (totalWords === 0) return;

      const containerRect = container.getBoundingClientRect();
      const pRect = paragraph.getBoundingClientRect();

      // We want to start revealing when the top of the text enters the bottom threshold of the container
      const revealStart = containerRect.bottom - 10;
      // It should be fully revealed by the time it reaches the top 30% of the container
      const revealEnd = containerRect.top + (containerRect.height * 0.3);
      
      const revealRange = revealStart - revealEnd;
      const distanceScrolled = revealStart - pRect.top;

      let scrollProgress = 0;
      if (revealRange > 0) {
        scrollProgress = Math.min(Math.max(0, distanceScrolled / revealRange), 1);
      }

      const wordsToReveal = Math.floor(scrollProgress * totalWords);
      
      wordSpans.forEach((word, index) => {
        if (index < wordsToReveal) {
          word.classList.remove('opacity-20');
          word.classList.add('opacity-100');
        } else {
          word.classList.remove('opacity-100');
          word.classList.add('opacity-20');
        }
      });
    };

    updateVisibility();

    // Setup an intersection or timer check to guarantee correct layout reads after bounds finish animating
    const fallbackTimer = setTimeout(updateVisibility, 150);
    const secondTimer = setTimeout(updateVisibility, 400);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(secondTimer);
    };
  }, [subScroll, containerRef, text]);

  return <p ref={paragraphRef} className={className}></p>;
};
