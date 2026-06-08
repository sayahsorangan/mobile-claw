import React from 'react';

import {ScrollView} from 'react-native';

import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const PremiumSoftReminderScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  const benefits = [
    t('onboarding.premiumSoftReminder.benefits.unlimited'),
    t('onboarding.premiumSoftReminder.benefits.access'),
    t('onboarding.premiumSoftReminder.benefits.progress'),
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

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mt={'lg'} mb={'xs'}>
          {t('onboarding.premiumSoftReminder.headline')}
        </Text>

        <Box gap={'xs'} mt={'md'} mb={'lg'}>
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

        <Text variant={'body_poppins_regular'} color={'grey'} mb={'xs'}>
          {t('onboarding.premiumSoftReminder.prompt')}
        </Text>
        <Text variant={'body_helper_poppins_regular'} color={'grey'} mb={'xl'}>
          {t('onboarding.premiumSoftReminder.promptSupport')}
        </Text>

        <Box flexDirection={'row'}>
          <Button
            secondary
            label={t('onboarding.premiumSoftReminder.secondaryCta')}
            onPress={() => Navigation.navigate(Route.level_hypothesis)}
          />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.premiumSoftReminder.primaryCta')}
            onPress={() => Navigation.navigate(Route.premium_detail)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {PremiumSoftReminderScreen};
