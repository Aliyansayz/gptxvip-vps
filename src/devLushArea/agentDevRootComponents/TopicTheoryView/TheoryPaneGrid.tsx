import React, { useState, useEffect, useRef } from 'react';
import { SavedTheory, TheoryCollection, useTheoryCollections } from '../TheoryCollectionContext';
import { ChevronLeft, Grid, Maximize2, Trash2 } from 'lucide-react';
import TheoryCard from './TheoryCard';
import SaveTheoryButton from './SaveTheoryButton';

interface TheoryPaneGridProps {
  collection: TheoryCollection;
  onBack: () => void;
  onOpenSource?: (item: SavedTheory) => void;
}

const ITEMS_PER_PAGE = 10;

const TheoryPaneGrid: React.FC<TheoryPaneGridProps> = ({ collection, onBack, onOpenSource }) => {
  const { removeTheoryFromCollection } = useTheoryCollections();
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const [sliderIndex, setSliderIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Lazy loading logic
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisibleItems(collection.items.length);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, collection.items.length));
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [collection.items.length]);

  const displayedItems = collection.items.slice(0, visibleItems);

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            aria-label="Back to theory collections"
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-heading tracking-wide text-foreground">
              {collection.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {collection.items.length} saved theories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 shadow-sm">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
            title="Grid View"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Slider view"
            aria-pressed={viewMode === 'slider'}
            onClick={() => setViewMode('slider')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'slider' ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
            title="Slider View"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {collection.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
          <p className="text-muted-foreground text-lg">This collection is empty.</p>
          <p className="text-sm text-muted-foreground mt-2">Save theories from DevLush to see them here.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {displayedItems.map(item => (
              <div key={item.id} className="break-inside-avoid relative group">
                <TheoryCard item={item} onOpenSource={onOpenSource} />
                <button
                  type="button"
                  aria-label={`Remove ${item.exerciseTitle} from ${collection.name}`}
                  onClick={() => removeTheoryFromCollection(collection.id, item.id)}
                  className="absolute top-4 right-4 p-2 bg-destructive/90 text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive"
                  title="Remove from collection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {visibleItems < collection.items.length && (
            <div ref={observerTarget} role="status" aria-live="polite" className="h-20 flex items-center justify-center text-muted-foreground">
              Loading more...
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-4xl relative">
            <TheoryCard 
              item={collection.items[sliderIndex]} 
              isSliderMode 
              onNext={() => setSliderIndex(prev => Math.min(collection.items.length - 1, prev + 1))}
              onPrev={() => setSliderIndex(prev => Math.max(0, prev - 1))}
              hasNext={sliderIndex < collection.items.length - 1}
              hasPrev={sliderIndex > 0}
              onOpenSource={onOpenSource}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-2 overflow-x-auto max-w-full py-2 custom-scrollbar">
            {collection.items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show theory ${idx + 1}: ${item.exerciseTitle}`}
                aria-pressed={idx === sliderIndex}
                onClick={() => setSliderIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === sliderIndex ? 'bg-cyan-500 scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TheoryPaneGrid;
