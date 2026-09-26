import React, { useRef, useState } from 'react';
import { SavedTheory } from '../TheoryCollectionContext';
import { BookOpenText, Camera, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import DevLushTheoryBridge from '../../devLushComponents/devLushTopicsView/DevLushTheoryBridge';
import { toast } from 'sonner';

interface TheoryCardProps {
  item: SavedTheory;
  isSliderMode?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  onOpenSource?: (item: SavedTheory) => void;
}

type AspectRatio = 'auto' | '16:9' | '3:2' | '4:3' | '1:1';

const TheoryCard: React.FC<TheoryCardProps> = ({
  item,
  isSliderMode = false,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  onOpenSource
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('auto');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleScreenshot = async () => {
    if (!cardRef.current) return;

    try {
      setIsCapturing(true);

      // Add a small delay to ensure rendering is complete before capture
      await new Promise(resolve => setTimeout(resolve, 200));

      const image = await toPng(cardRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        pixelRatio: 2, // Higher resolution
      });
      const link = document.createElement('a');
      link.href = image;
      link.download = `Theory_${item.chapterTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Theory screenshot downloaded.');

    } catch (error) {
      console.error('Failed to capture screenshot', error);
      toast.error('Could not create the screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '3:2': return 'aspect-[3/2]';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      default: return 'h-auto';
    }
  };

  const getCourseTypeStyles = () => {
    switch (item.courseType) {
      case 'bio': return 'bg-emerald-500/10 text-emerald-500';
      case 'devLush': return 'bg-indigo-500/10 text-indigo-500';
      case 'med': default: return 'bg-cyan-500/10 text-cyan-500';
    }
  };

  const getCourseTypeName = () => {
    switch (item.courseType) {
      case 'bio': return 'BioLabs';
      case 'devLush': return 'DevLush';
      case 'med': default: return 'MedCush';
    }
  };

  const getHoverColor = () => {
    switch (item.courseType) {
      case 'bio': return 'group-hover:text-emerald-500';
      case 'devLush': return 'group-hover:text-indigo-500';
      case 'med': default: return 'group-hover:text-cyan-500';
    }
  };

  return (
    <div className={`relative group ${isSliderMode ? 'w-full max-w-4xl mx-auto' : 'w-full'}`}>
      <div
        ref={cardRef}
        className={`bg-card border border-border rounded-2xl ${isCapturing ? 'p-8 shadow-2xl h-auto' : `p-6 shadow-sm transition-all duration-300 overflow-hidden ${getAspectRatioClass()}`} flex flex-col`}
      >
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getCourseTypeStyles()}`}>
                {getCourseTypeName()}
              </span>
              <span className={`text-xs font-medium break-words transition-colors text-black dark:text-white ${getHoverColor()}`}>
                {item.chapterTitle}
              </span>
            </div>
            <h3 className="text-xl font-heading tracking-wide text-foreground flex items-center gap-2">

              {item.theory.title}
            </h3>
          </div>

          {!isCapturing && (
            <div className="flex flex-col items-end gap-2 z-20">
              <div className="flex items-center gap-1 relative">
                {isSliderMode && (onNext || onPrev) && (
                  <div className="flex items-center gap-1 mr-2 pr-3 border-r border-border/50">
                    <button
                      type="button"
                      aria-label="Previous saved theory"
                      onClick={onPrev}
                      disabled={!hasPrev}
                      className="p-1.5 hover:bg-muted rounded-md text-foreground disabled:opacity-30 transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next saved theory"
                      onClick={onNext}
                      disabled={!hasNext}
                      className="p-1.5 hover:bg-muted rounded-md text-foreground disabled:opacity-30 transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="relative">
                  <button
                    type="button"
                    aria-label="Aspect ratio settings"
                    aria-expanded={showSettings}
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    title="Aspect Ratio Settings"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>

                  {showSettings && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xl overflow-hidden z-[100]">
                      {(['auto', '16:9', '3:2', '4:3', '1:1'] as AspectRatio[]).map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          aria-pressed={aspectRatio === ratio}
                          onClick={() => { setAspectRatio(ratio); setShowSettings(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${aspectRatio === ratio ? 'text-cyan-500 font-medium bg-cyan-500/5' : 'text-foreground'}`}
                        >
                          {ratio === 'auto' ? 'Auto Fit' : ratio}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  aria-label={`Take screenshot of ${item.exerciseTitle}`}
                  onClick={handleScreenshot}
                  className="p-1.5 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-md transition-colors"
                  title="Take Screenshot"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar pr-2 ${isCapturing ? 'overflow-visible h-auto' : ''}`}>
          <DevLushTheoryBridge item={item} />
        </div>

        {!isCapturing && onOpenSource && item.courseType === 'devLush' && item.labId !== 'unknown' && (
          <div className="mt-4 border-t border-border/50 pt-4">
            <p className="mb-2 text-xs text-muted-foreground">Source: {item.chapterTitle}</p>
            <button
              type="button"
              onClick={() => onOpenSource(item)}
              className="text-sm font-semibold text-cyan-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
            >
              Open source topic
            </button>
          </div>
        )}

        {isCapturing && (
          <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
            <span>Generated from {getCourseTypeName()}</span>
            <span>{new Date(item.savedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default TheoryCard;
