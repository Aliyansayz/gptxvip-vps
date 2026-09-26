export const loadState = <T,>(key: string, defaultVal: T): T => {
  try {
    const stored = typeof window === 'undefined' ? null : window.localStorage.getItem(key);
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

export const saveState = <T,>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Trading controls continue to work in memory when browser storage is unavailable.
  }
};
