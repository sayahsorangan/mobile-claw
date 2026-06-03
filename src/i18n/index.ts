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

export const translate = i18n.t;

export default i18n;

type TranslationKey = keyof typeof resources.en.translation;

export const TKeys = Object.keys(resources.en.translation).reduce((accumulator, key) => {
  const translationKey = key as TranslationKey;
  accumulator[translationKey] = translationKey;
  return accumulator;
}, {} as Record<TranslationKey, TranslationKey>);

export type TKey = TranslationKey;
