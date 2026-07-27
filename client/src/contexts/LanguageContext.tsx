import React, { createContext, useContext, useState, useEffect } from 'react';
import { ka } from '../i18n/ka';
import { en } from '../i18n/en';

export type Language = 'ka' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, lang?: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Merge translations from both i18n files
const translations: Record<string, Record<Language, string>> = {};

// Merge Georgian translations
Object.entries(ka).forEach(([key, value]) => {
  if (!translations[key]) {
    translations[key] = { ka: '', en: '' };
  }
  translations[key].ka = value;
});

// Merge English translations
Object.entries(en).forEach(([key, value]) => {
  if (!translations[key]) {
    translations[key] = { ka: '', en: '' };
  }
  translations[key].en = value;
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ka');

  // Load language from localStorage on mount and update html lang attribute
  useEffect(() => {
    const saved = localStorage.getItem('flowers-boutique-language') as Language | null;
    const lang = (saved && ['ka', 'en'].includes(saved)) ? saved : 'ka';
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('flowers-boutique-language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, lang?: Language): string => {
    const targetLang = lang || language;
    return translations[key]?.[targetLang] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
