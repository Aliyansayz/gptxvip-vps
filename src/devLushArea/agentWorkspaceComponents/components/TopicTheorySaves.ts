export interface SavedTopicTheory {
  id: string;
  type: 'topicTheory';
  theoryId: string;
  agentType: string;
  title: string;
  savedAt: string;
}

export const getSavedTopicTheories = (): SavedTopicTheory[] => {
  try {
    const saves = localStorage.getItem('topicTheorySaves');
    return saves ? JSON.parse(saves) : [];
  } catch {
    return [];
  }
};

export const saveTopicTheory = (theory: Omit<SavedTopicTheory, 'type' | 'savedAt' | 'id'>): SavedTopicTheory => {
  const saves = getSavedTopicTheories();
  const newSave: SavedTopicTheory = {
    ...theory,
    id: crypto.randomUUID(),
    type: 'topicTheory',
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('topicTheorySaves', JSON.stringify([...saves, newSave]));
  return newSave;
};

export const removeTopicTheorySave = (id: string): void => {
  const saves = getSavedTopicTheories();
  localStorage.setItem('topicTheorySaves', JSON.stringify(saves.filter(s => s.id !== id)));
};
