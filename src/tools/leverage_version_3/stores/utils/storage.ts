export const loadState = <T,>(key: string, defaultVal: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(defaultVal)) {
        return (Array.isArray(parsed) ? parsed : defaultVal) as unknown as T;
      }
      if (typeof parsed === 'object' && parsed !== null && typeof defaultVal === 'object' && defaultVal !== null) {
        return { ...defaultVal, ...parsed };
      }
      return parsed;
    }
    return defaultVal;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return defaultVal;
  }
};
