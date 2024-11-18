import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/config';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <motion.div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe size={20} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {LANGUAGES[i18n.language as keyof typeof LANGUAGES]?.nativeName || 'Language'}
        </span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
      >
        {Object.entries(LANGUAGES).map(([code, { name, nativeName }]) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                      ${i18n.language === code ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}
          >
            <span>{nativeName}</span>
            <span className="text-gray-400 text-xs ml-2">({name})</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}; 