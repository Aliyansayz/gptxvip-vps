export interface SavedTopicTheory {
  id: string;
  type: 'topicTheory';
  theoryId: string;
  agentType: string;
  title: string;
  savedAt: string;
}

const isSavedTopicTheory = (item: unknown): item is SavedTopicTheory => {
  if (!item || typeof item !== 'object') return false;
  const value = item as Record<string, unknown>;
  return typeof value.id === 'string' && value.type === 'topicTheory' &&
    typeof value.theoryId === 'string' && typeof value.agentType === 'string' &&
    typeof value.title === 'string' && typeof value.savedAt === 'string';
};

export const getSavedTopicTheories = (): SavedTopicTheory[] => {
  try {
    const saves = localStorage.getItem('topicTheorySaves');
    if (!saves) return [];
    const parsed: unknown = JSON.parse(saves);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedTopicTheory);
  } catch {
    return [];
  }
};

export const saveTopicTheory = (theory: Omit<SavedTopicTheory, 'type' | 'savedAt' | 'id'>): SavedTopicTheory | null => {
  const saves = getSavedTopicTheories();
  const newSave: SavedTopicTheory = {
    ...theory,
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: 'topicTheory',
    savedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem('topicTheorySaves', JSON.stringify([...saves, newSave]));
    return newSave;
  } catch {
    return null;
  }
};

export const removeTopicTheorySave = (id: string): boolean => {
  const saves = getSavedTopicTheories();
  try {
    localStorage.setItem('topicTheorySaves', JSON.stringify(saves.filter(s => s.id !== id)));
    return true;
  } catch {
    return false;
  }
};
