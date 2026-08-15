import React, { useState, useEffect, useRef } from 'react';
import { Settings, Moon, Sun, FolderHeart } from 'lucide-react';

interface SettingsGearProps {
  onOpenFavorites: () => void;
}

export const SettingsGear: React.FC<SettingsGearProps> = ({ onOpenFavorites }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      // If no theme is set yet (on very first paint) assume dark is default
      return localStorage.theme !== 'light';
    }
    return true;
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load check
    if (localStorage.theme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
          <div className="py-1">
            <button
              onClick={() => {
                onOpenFavorites();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <FolderHeart className="w-4 h-4 text-rose-500" />
              My Favorites
            </button>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
