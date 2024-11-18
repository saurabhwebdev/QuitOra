import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferencesStore } from '../services/userPreferences';

export const useLanguageSync = () => {
  const { i18n } = useTranslation();
  const { preferences } = usePreferencesStore();

  useEffect(() => {
    if (preferences.language !== i18n.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language, i18n]);
}; 