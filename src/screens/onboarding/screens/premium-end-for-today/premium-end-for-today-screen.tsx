import React from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const PremiumEndForTodayScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <Button secondary label={t('back')} onPress={() => Navigation.back()} />

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mt={'lg'} mb={'xs'}>
          {t('onboarding.premiumEndForToday.headline')}
        </Text>
        <Text variant={'body_poppins_regular'} color={'grey'} mb={'md'}>
          {t('onboarding.premiumEndForToday.subline')}
        </Text>

        <Box flex={1} justifyContent={'center'} alignItems={'center'} mb={'lg'}>
          <MascotText lottieAnimation={Lotties.main_mascot} text={t('onboarding.premiumEndForToday.prompt')} />
        </Box>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'} mb={'lg'}>
          {t('onboarding.premiumEndForToday.promptSupport')}
        </Text>

        <Button
          label={t('onboarding.premiumEndForToday.primaryCta')}
          onPress={() => Navigation.navigate(Route.level_hypothesis)}
        />
      </ScrollView>
    </Container>
  );
};

export {PremiumEndForTodayScreen};
