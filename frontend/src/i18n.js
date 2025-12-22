// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Get saved language from localStorage or default to French
const savedLanguage = localStorage.getItem('language') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: savedLanguage,        // Use saved or default to French
    fallbackLng: "fr",         // Fallback to French
    interpolation: {
      escapeValue: false,
    },
  });

// Save to localStorage whenever language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;