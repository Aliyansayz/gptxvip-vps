import React, { useRef, useState } from 'react';
import { SavedTheory } from '../../../agentDevRootComponents/TheoryCollectionContext';
import { BookOpenText, Camera, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import DevLushTheoryBridge from '../../devLushTopicsView/DevLushTheoryBridge';

interface DevLushTheoryCardProps {
  item: SavedTheory;
  isSliderMode?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

type AspectRatio = 'auto' | '16:9' | '3:2' | '4:3' | '1:1';

const DevLushTheoryCard: React.FC<DevLushTheoryCardProps> = ({ 
  item, 
  isSliderMode = false,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false
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
      
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Theory_${item.chapterTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.click();
      
    } catch (error) {
      console.error('Failed to capture screenshot', error);
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

  return (
    <div className={`relative group ${isSliderMode ? 'w-full max-w-4xl mx-auto' : 'w-full'}`}>
      <div 
        ref={cardRef}
        className={`bg-card border border-border rounded-2xl ${isCapturing ? 'p-8 shadow-2xl h-auto' : `p-6 shadow-sm transition-all duration-300 overflow-hidden ${getAspectRatioClass()}`} flex flex-col`}
      >
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-500">
                DevLush
              </span>
              <span className="text-xs font-medium break-words transition-colors text-black dark:text-white group-hover:text-indigo-500">
                {item.chapterTitle}
              </span>
            </div>
            <h3 className="text-xl font-heading tracking-wide text-foreground flex items-center gap-2">
              <BookOpenText className="w-5 h-5 text-muted-foreground" />
              {item.theory.title}
            </h3>
          </div>

          {!isCapturing && (
            <div className="flex flex-col items-end gap-2 z-20">
              <div className="flex items-center gap-1 relative">
                {isSliderMode && (onNext || onPrev) && (
                  <div className="flex items-center gap-1 mr-2 pr-3 border-r border-border/50">
                    <button 
                      onClick={onPrev} 
                      disabled={!hasPrev} 
                      className="p-1.5 hover:bg-muted rounded-md text-foreground disabled:opacity-30 transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
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
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    title="Aspect Ratio Settings"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[100]">
                      {(['auto', '16:9', '3:2', '4:3', '1:1'] as AspectRatio[]).map(ratio => (
                        <button
                          key={ratio}
                          onClick={() => { setAspectRatio(ratio); setShowSettings(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${aspectRatio === ratio ? 'text-indigo-500 font-medium bg-indigo-500/5' : 'text-foreground'}`}
                        >
                          {ratio === 'auto' ? 'Auto Fit' : ratio}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleScreenshot}
                  className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md transition-colors"
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
        
        {isCapturing && (
          <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
            <span>Generated from DevLush Sandboxes</span>
            <span>{new Date(item.savedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default DevLushTheoryCard;
