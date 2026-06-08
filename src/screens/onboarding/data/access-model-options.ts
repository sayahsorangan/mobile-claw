import {translate} from '@i18n';

import type {AccessModelOption, AccessModelOptionId} from '../types/access-model-option';

type TranslationFn = typeof translate;

export function getAccessModelOptions(t: TranslationFn): AccessModelOption[] {
  const ids: AccessModelOptionId[] = ['free', 'premium'];
  return ids.map(id => {
    if (id === 'free') {
      return {
        id,
        title: t('onboarding.pricing.free.title'),
        description: t('onboarding.pricing.free.description'),
        features: [
          t('onboarding.pricing.free.featureOne'),
          t('onboarding.pricing.free.featureTwo'),
          t('onboarding.pricing.free.featureThree'),
          t('onboarding.pricing.free.featureFour'),
        ],
      };
    }
    return {
      id,
      title: t('onboarding.pricing.premium.title'),
      description: t('onboarding.pricing.premium.description'),
      features: [
        t('onboarding.pricing.premium.featureOne'),
        t('onboarding.pricing.premium.featureTwo'),
        t('onboarding.pricing.premium.featureThree'),
        t('onboarding.pricing.premium.featureFour'),
        t('onboarding.pricing.premium.featureFive'),
      ],
    };
  });
}
