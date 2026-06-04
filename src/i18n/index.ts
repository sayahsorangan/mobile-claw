import {initReactI18next} from 'react-i18next';

import i18n from 'i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import id from './locales/id.json';

export const resources = {en: {translation: en}, id: {translation: id}, de: {translation: de}} as const;

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v4',
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    defaultVariables: {value: ''},
  },
  react: {
    useSuspense: false,
  },
});
type TranslationKey = keyof typeof resources.en.translation;

export const translate = (key: TranslationKey) => {
  return i18n.t(key);
};

export default i18n;
