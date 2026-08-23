'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    const saved = localStorage.getItem('gvk_lang');
    if (saved === 'en' || saved === 'tr') setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === 'tr' ? 'en' : 'tr';
    setLang(next);
    localStorage.setItem('gvk_lang', next);
  };

  // t('Türkçe metin', 'English text')
  const t = (tr, en) => (lang === 'tr' ? tr : en);

  // Model field helper: getField(obj, 'title') → obj.title_tr or obj.title_en
  const getField = (obj, field) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_tr`] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, getField }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
