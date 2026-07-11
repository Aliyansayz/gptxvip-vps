import React, { useState, useRef, useEffect } from 'react';
import { BookmarkPlus, FolderPlus, CheckCircle2 } from 'lucide-react';
import { Theory } from '../../devLushComponents/devLushTypes';
import { useTheoryCollections } from '../TheoryCollectionContext';
import { useLabContext } from '../LabContext';

interface SaveTheoryButtonProps {
    theory?: any;
    courseType?: 'devLush';
    labId?: string;
    chapterTitle?: string;
    exerciseTitle?: string;
}

const SaveTheoryButton: React.FC<SaveTheoryButtonProps> = ({ 
    theory, 
    courseType: propCourseType, 
    labId: propLabId, 
    chapterTitle: propChapterTitle, 
    exerciseTitle 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const labContext = useLabContext();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { collections, createCollection, addTheoryToCollection } = useTheoryCollections();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [savedTo, setSavedTo] = useState<string | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsCreating(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!theory) return null;
    
    // If we accidentally got passed an exercise object instead of a theory object, extract the theory
    const actualTheory = (theory.title && (theory.content || theory.analogy)) ? theory : theory.theory;
    
    if (!actualTheory) return null;

    // Determine labId: prop > context > default
    const labId = propLabId || labContext?.labId || 'unknown';

    // Determine courseType: prop > context > inferred from labId
    const courseType = propCourseType || labContext?.courseType || 'devLush';

    // Determine chapterTitle: prop > context > theory title > default
    const chapterTitle = propChapterTitle || labContext?.chapterTitle || actualTheory.title || 'Theory';

    const theoryData = {
        labId: labId,
        chapterTitle: chapterTitle,
        exerciseTitle: exerciseTitle || actualTheory.title || 'Theory',
        courseType: courseType as 'devLush',
        theory: actualTheory
    };

    const handleSave = (collectionId: string) => {
        addTheoryToCollection(collectionId, theoryData);
        setSavedTo(collectionId);
        setTimeout(() => {
            setSavedTo(null);
            setIsOpen(false);
        }, 1500);
    };

    const handleCreateAndSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCollectionName.trim()) {
            const newId = createCollection(newCollectionName.trim());
            handleSave(newId);
            setNewCollectionName('');
            setIsCreating(false);
        }
    };

    const collectionList = Object.values(collections).sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the accordion
                    setIsOpen(!isOpen);
                }}
                className={`p-1.5 rounded-md transition-colors ${isOpen ? 'bg-muted text-cyan-500' : 'hover:bg-muted/50 text-muted-foreground hover:text-cyan-500'}`}
                title="Save Theory"
            >
                <BookmarkPlus className="w-5 h-5" />
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[80vh] font-sans"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 border-b border-border bg-muted/30">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FolderPlus className="w-4 h-4 text-cyan-500" />
                            Save to Collection
                        </h3>
                    </div>

                    <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                        {isCreating ? (
                            <form onSubmit={handleCreateAndSave} className="space-y-2">
                                <input
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="New collection..."
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-cyan-500/50 outline-none"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-1.5 text-xs bg-muted text-foreground rounded hover:bg-muted/80 transition-colors">Cancel</button>
                                    <button type="submit" disabled={!newCollectionName.trim()} className="flex-1 py-1.5 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors disabled:opacity-50">Create & Save</button>
                                </div>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setIsCreating(true)}
                                className="w-full py-2 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
                            >
                                <FolderPlus className="w-4 h-4" />
                                New Collection
                            </button>
                        )}

                        <div className="space-y-1">
                            {collectionList.map(collection => (
                                <button
                                    key={collection.id}
                                    onClick={() => handleSave(collection.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all flex items-center justify-between ${
                                        savedTo === collection.id 
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-background border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 text-foreground'
                                    }`}
                                >
                                    <span className="font-medium truncate pr-2">{collection.name}</span>
                                    {savedTo === collection.id ? (
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{collection.items.length}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveTheoryButton;
