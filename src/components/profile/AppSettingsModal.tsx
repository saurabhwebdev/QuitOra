import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Moon, Sun, Globe, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { userPreferencesService, usePreferencesStore } from '../../services/userPreferences';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingsModal = ({ isOpen, onClose }: Props) => {
  const { currentUser } = useAuth();
  const { preferences, loading } = usePreferencesStore();
  const { logActivity, templates } = useActivityLog();
  const { t } = useTranslation();

  const handleThemeChange = async (newTheme: typeof preferences.theme) => {
    if (!currentUser) return;
    try {
      await userPreferencesService.updateTheme(currentUser.uid, newTheme);
      await logActivity(templates.profile.preferencesUpdated('theme'));
      toast.success(t('preferences.updateSuccess'));
    } catch (error) {
      toast.error(t('preferences.updateError'));
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!currentUser) return;
    try {
      const newLanguage = e.target.value;
      await userPreferencesService.updateLanguage(currentUser.uid, newLanguage);
      toast.success(t('preferences.updateSuccess'));
    } catch (error) {
      toast.error(t('preferences.updateError'));
    }
  };

  const handleColorChange = async (newColor: string) => {
    if (!currentUser) return;
    try {
      await userPreferencesService.updateAccentColor(currentUser.uid, newColor);
      toast.success(t('preferences.updateSuccess'));
    } catch (error) {
      toast.error(t('preferences.updateError'));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{t('preferences.title')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t('preferences.theme.title')}</h4>
            <div className="grid grid-cols-3 gap-4">
              {(['light', 'dark', 'system'] as const).map((themeType) => (
                <button
                  key={themeType}
                  onClick={() => handleThemeChange(themeType)}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2
                            ${preferences.theme === themeType ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                >
                  {themeType === 'light' && <Sun size={18} />}
                  {themeType === 'dark' && <Moon size={18} />}
                  {themeType === 'system' && <Globe size={18} />}
                  <span className="capitalize">
                    {t(`preferences.theme.${themeType}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t('preferences.language.title')}</h4>
            <select
              value={preferences.language}
              onChange={handleLanguageChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(LANGUAGES).map(([code, { name, nativeName }]) => (
                <option key={code} value={code}>
                  {nativeName} ({name})
                </option>
              ))}
            </select>
          </div>

          {/* Accent Color */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t('preferences.accentColor.title')}</h4>
            <div className="grid grid-cols-4 gap-4">
              {['indigo', 'purple', 'blue', 'green'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2
                            ${preferences.accentColor === color ? 'border-indigo-600' : 'border-gray-200'}`}
                >
                  <Palette size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t('common.done')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 