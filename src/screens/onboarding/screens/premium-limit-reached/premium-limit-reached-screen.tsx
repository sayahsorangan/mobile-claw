import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const PremiumLimitReachedScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();

  const cards = [
    {
      key: 'premium',
      badge: t('onboarding.premiumLimitReached.premium.badge'),
      title: t('onboarding.premiumLimitReached.premium.title'),
      subtitle: t('onboarding.premiumLimitReached.premium.subtitle'),
      onPress: () => Navigation.navigate(Route.premium_detail),
      isPrimary: true,
    },
    {
      key: 'bonus',
      badge: t('onboarding.premiumLimitReached.bonus.badge'),
      title: t('onboarding.premiumLimitReached.bonus.title'),
      subtitle: t('onboarding.premiumLimitReached.bonus.subtitle'),
      onPress: () => Navigation.navigate(Route.premium_upgrade_hub),
      isPrimary: false,
    },
    {
      key: 'tomorrow',
      badge: undefined,
      title: t('onboarding.premiumLimitReached.tomorrow.title'),
      subtitle: t('onboarding.premiumLimitReached.tomorrow.subtitle'),
      onPress: () => Navigation.navigate(Route.level_hypothesis),
      isPrimary: false,
    },
  ];

  const trustItems = [
    t('onboarding.premiumLimitReached.trust.cancelAnytime'),
    t('onboarding.premiumLimitReached.trust.noHiddenCosts'),
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

        <Box mt={'lg'} mb={'sm'}>
          <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
            {t('onboarding.premiumLimitReached.headline')}
          </Text>
          <Text mt={'xs'} variant={'body_poppins_regular'} color={'grey'}>
            {t('onboarding.premiumLimitReached.subline')}
          </Text>
        </Box>

        <Text variant={'body_poppins_regular'} color={'grey'} mb={'xs'}>
          {t('onboarding.premiumLimitReached.prompt')}
        </Text>
        <Text variant={'body_helper_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.premiumLimitReached.promptSupport')}
        </Text>

        <Box gap={'md'} mb={'lg'}>
          {cards.map(card => (
            <TouchableOpacity
              key={card.key}
              onPress={card.onPress}
              style={{
                padding: spacing.md,
                borderRadius: borderRadii.md,
                borderWidth: 2,
                borderColor: card.isPrimary ? colors.primary : colors.grey_light,
                backgroundColor: card.isPrimary ? colors.primary_light : colors.white,
              }}
            >
              {card.badge ? (
                <Box
                  alignSelf={'flex-start'}
                  backgroundColor={card.isPrimary ? 'primary' : 'primary_light'}
                  paddingHorizontal={'sm'}
                  paddingVertical={'xxs'}
                  borderRadius={'xl'}
                  mb={'xs'}
                >
                  <Text variant={'body_helper_poppins_regular'} color={card.isPrimary ? 'white' : 'primary'}>
                    {card.badge}
                  </Text>
                </Box>
              ) : null}
              <Text variant={'h_5_poppins_bold'} color={card.isPrimary ? 'primary' : 'primary_dark'}>
                {card.title}
              </Text>
              <Text mt={'xs'} variant={'body_poppins_regular'} color={'grey'}>
                {card.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </Box>

        <Box gap={'xs'}>
          {trustItems.map((item, i) => (
            <Text key={i} variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'}>
              {item}
            </Text>
          ))}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {PremiumLimitReachedScreen};
