import { useEffect } from 'react';
import { usePreferencesStore } from '../services/userPreferences';

export const useApplyPreferences = () => {
  const { preferences } = usePreferencesStore();

  useEffect(() => {
    // Apply theme
    if (preferences.theme === 'system') {
      // Check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    }

    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', preferences.accentColor);

    // Apply language
    document.documentElement.lang = preferences.language;
  }, [preferences]);
}; 