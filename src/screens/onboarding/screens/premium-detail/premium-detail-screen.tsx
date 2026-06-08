import React, {useMemo} from 'react';

import {ScrollView} from 'react-native';

import {useAppDispatch} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
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

const PremiumDetailScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const dispatch = useAppDispatch();

  const pricing = useMemo(() => getPricingPreset(t, getDeviceRegionCode()), [t]);

  const benefits = [
    t('onboarding.premiumDetail.benefits.unlimitedSequences'),
    t('onboarding.premiumDetail.benefits.noWaiting'),
    t('onboarding.premiumDetail.benefits.fasterProgress'),
    t('onboarding.premiumDetail.benefits.fullAccess'),
    t('onboarding.premiumDetail.benefits.examPreparation'),
    t('onboarding.premiumDetail.benefits.certificates'),
  ];

  const trustItems = [
    t('onboarding.premiumDetail.trust.cancelAnytime'),
    t('onboarding.premiumDetail.trust.noHiddenCosts'),
  ];

  const handlePrimary = () => {
    dispatch(onboarding_action.selectAccessModel('premium'));
    Navigation.navigate(Route.level_hypothesis);
  };

  const handleSecondary = () => {
    dispatch(onboarding_action.selectAccessModel('free'));
    Navigation.navigate(Route.level_hypothesis);
  };

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

        <Box mt={'lg'} mb={'sm'}>
          <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
            {t('onboarding.premiumDetail.headline')}
          </Text>
          <Text mt={'xs'} variant={'body_poppins_regular'} color={'grey'}>
            {t('onboarding.premiumDetail.subline')}
          </Text>
        </Box>

        <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mt={'lg'} mb={'sm'}>
          {t('onboarding.premiumDetail.benefitsTitle')}
        </Text>
        <Box gap={'xs'} mb={'lg'}>
          {benefits.map((benefit, i) => (
            <Box key={i} flexDirection={'row'} alignItems={'center'}>
              <Box
                width={20}
                height={20}
                borderRadius={'round'}
                backgroundColor={'primary'}
                alignItems={'center'}
                justifyContent={'center'}
                mr={'sm'}
              >
                <Text variant={'body_helper_poppins_regular'} color={'white'}>
                  ✓
                </Text>
              </Box>
              <Text variant={'body_poppins_regular'} color={'primary_dark'} style={{flex: 1}}>
                {benefit}
              </Text>
            </Box>
          ))}
        </Box>

        <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mb={'sm'}>
          {t('onboarding.premiumDetail.pricingTitle')}
        </Text>
        <Box padding={'md'} borderRadius={'md'} backgroundColor={'primary_light'} mb={'lg'}>
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

        <Box gap={'xs'} mb={'lg'}>
          {trustItems.map((item, i) => (
            <Text key={i} variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'}>
              {item}
            </Text>
          ))}
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('onboarding.premiumDetail.secondaryCta')} onPress={handleSecondary} />
          <Divider horizontal="md" />
          <Button label={t('onboarding.premiumDetail.primaryCta')} onPress={handlePrimary} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {PremiumDetailScreen};
