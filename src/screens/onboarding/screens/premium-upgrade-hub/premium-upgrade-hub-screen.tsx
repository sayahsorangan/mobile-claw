import React, {useMemo} from 'react';

import {ScrollView} from 'react-native';

import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

type PricingPreset = {
  countryLabel: string;
  flag: string;
  monthlyLabel: string;
  yearlyLabel: string;
};

function getDeviceRegionCode(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.includes('ID') || locale.includes('id')) {
      return 'ID';
    }
    if (locale.includes('US') || locale.includes('us')) {
      return 'US';
    }
  } catch {
    // ignore
  }
  return 'EU';
}

function getPricingPreset(t: typeof translate, regionCode: string): PricingPreset {
  if (regionCode === 'ID') {
    return {
      countryLabel: t('onboarding.premiumDetail.pricing.indonesia.country'),
      flag: 'id',
      monthlyLabel: t('onboarding.premiumDetail.pricing.indonesia.month'),
      yearlyLabel: t('onboarding.premiumDetail.pricing.indonesia.year'),
    };
  }
  if (regionCode === 'US') {
    return {
      countryLabel: t('onboarding.premiumDetail.pricing.us.country'),
      flag: 'us',
      monthlyLabel: t('onboarding.premiumDetail.pricing.us.month'),
      yearlyLabel: t('onboarding.premiumDetail.pricing.us.year'),
    };
  }
  return {
    countryLabel: t('onboarding.premiumDetail.pricing.eu.country'),
    flag: 'eu',
    monthlyLabel: t('onboarding.premiumDetail.pricing.eu.month'),
    yearlyLabel: t('onboarding.premiumDetail.pricing.eu.year'),
  };
}

const PremiumUpgradeHubScreen = () => {
  const t = translate;
  const {spacing, colors} = useTheme();

  const pricing = useMemo(() => getPricingPreset(t, getDeviceRegionCode()), [t]);

  const freeFeatures = [
    t('onboarding.premiumUpgradeHub.free.features.dailyLimit'),
    t('onboarding.premiumUpgradeHub.free.features.ads'),
    t('onboarding.premiumUpgradeHub.free.features.topicAccess'),
  ];

  const premiumFeatures = [
    t('onboarding.premiumUpgradeHub.premium.features.unlimited'),
    t('onboarding.premiumUpgradeHub.premium.features.noAds'),
    t('onboarding.premiumUpgradeHub.premium.features.faster'),
    t('onboarding.premiumUpgradeHub.premium.features.fullAccess'),
    t('onboarding.premiumUpgradeHub.premium.features.exam'),
    t('onboarding.premiumUpgradeHub.premium.features.certificates'),
  ];

  const trustItems = [
    t('onboarding.premiumUpgradeHub.trust.cancelAnytime'),
    t('onboarding.premiumUpgradeHub.trust.noHiddenCosts'),
    t('onboarding.premiumUpgradeHub.trust.instantAccess'),
  ];

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <Button secondary label={t('back')} onPress={() => Navigation.back()} style={{alignSelf: 'flex-start'}} />

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mt={'lg'} mb={'lg'}>
          {t('onboarding.premiumUpgradeHub.headline')}
        </Text>

        <Box flexDirection={'row'} gap={'md'} mb={'lg'}>
          <Box flex={1} padding={'md'} borderRadius={'md'} style={{borderWidth: 1, borderColor: colors.grey_light}}>
            <Text variant={'h_6_poppins_bold'} color={'grey'} mb={'sm'}>
              {t('onboarding.premiumUpgradeHub.free.title')}
            </Text>
            <Box gap={'xs'}>
              {freeFeatures.map((f, i) => (
                <Text key={i} variant={'body_helper_poppins_regular'} color={'grey'}>
                  • {f}
                </Text>
              ))}
            </Box>
          </Box>

          <Box
            flex={1}
            padding={'md'}
            borderRadius={'md'}
            backgroundColor={'primary_light'}
            style={{borderWidth: 2, borderColor: colors.primary}}
          >
            <Text variant={'h_6_poppins_bold'} color={'primary'} mb={'sm'}>
              {t('onboarding.premiumUpgradeHub.premium.title')}
            </Text>
            <Box gap={'xs'}>
              {premiumFeatures.map((f, i) => (
                <Text key={i} variant={'body_helper_poppins_regular'} color={'primary_dark'}>
                  ✓ {f}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>

        <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mb={'sm'}>
          {t('onboarding.premiumDetail.pricingTitle')}
        </Text>
        <Box padding={'md'} borderRadius={'md'} backgroundColor={'primary_light'} mb={'md'}>
          <Text variant={'body_leading_poppins_medium'} color={'primary_dark'}>
            {pricing.countryLabel} ({pricing.flag.toUpperCase()})
          </Text>
          <Text variant={'body_poppins_regular'} color={'grey'}>
            {pricing.monthlyLabel} — {t('onboarding.premiumDetail.pricing.monthCaption')}
          </Text>
          <Text variant={'body_poppins_regular'} color={'grey'}>
            {pricing.yearlyLabel} — {t('onboarding.premiumDetail.pricing.yearCaption')}
          </Text>
          <Text variant={'body_helper_poppins_regular'} color={'primary'} mt={'xs'}>
            {t('onboarding.premiumDetail.pricing.save')}
          </Text>
        </Box>

        <Text variant={'body_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.premiumUpgradeHub.prompt')}
        </Text>

        <Box gap={'xs'} mb={'lg'}>
          {trustItems.map((item, i) => (
            <Text key={i} variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'}>
              {item}
            </Text>
          ))}
        </Box>

        <Box flexDirection={'row'}>
          <Button
            secondary
            label={t('onboarding.premiumUpgradeHub.secondaryCta')}
            onPress={() => Navigation.navigate(Route.level_hypothesis)}
          />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.premiumUpgradeHub.primaryCta')}
            onPress={() => Navigation.navigate(Route.premium_detail)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {PremiumUpgradeHubScreen};
