import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const PremiumBonusScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();

  const cards = [
    {
      key: 'premium',
      badge: t('onboarding.premiumBonus.premium.badge'),
      title: t('onboarding.premiumBonus.premium.title'),
      subtitle: t('onboarding.premiumBonus.premium.subtitle'),
      onPress: () => Navigation.navigate(Route.premium_detail),
      isPrimary: true,
    },
    {
      key: 'bonus',
      badge: t('onboarding.premiumBonus.bonus.badge'),
      title: t('onboarding.premiumBonus.bonus.title'),
      subtitle: t('onboarding.premiumBonus.bonus.subtitle'),
      onPress: () => Navigation.navigate(Route.premium_upgrade_hub),
      isPrimary: false,
    },
    {
      key: 'tomorrow',
      badge: undefined,
      title: t('onboarding.premiumBonus.tomorrow.title'),
      subtitle: t('onboarding.premiumBonus.tomorrow.subtitle'),
      onPress: () => Navigation.navigate(Route.level_hypothesis),
      isPrimary: false,
    },
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
            {t('onboarding.premiumBonus.headline')}
          </Text>
        </Box>

        <Text variant={'body_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.premiumBonus.prompt')}
        </Text>
        <Text variant={'body_helper_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.premiumBonus.promptSupport')}
        </Text>

        <Box gap={'md'} mb={'xl'}>
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
      </ScrollView>
    </Container>
  );
};

export {PremiumBonusScreen};
