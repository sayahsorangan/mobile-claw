import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const ChooseRegistrationScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();

  const handleOption = (option: 'apple' | 'google' | 'email' | 'login') => {
    switch (option) {
      case 'email':
        Navigation.navigate(Route.register_email);
        return;
      case 'login':
        Navigation.navigate(Route.login);
        return;
      default:
        break;
    }
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
        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'xs'}>
          {t('onboarding.chooseRegistration.headline')}
        </Text>
        <Text variant={'body_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.chooseRegistration.subline')}
        </Text>

        <Box flex={1} justifyContent={'center'} alignItems={'center'} mb={'lg'}>
          <MascotText lottieAnimation={Lotties.pointing_mascot} text={t('onboarding.chooseRegistration.bubble')} />
        </Box>

        <Box gap={'sm'} mb={'md'}>
          <TouchableOpacity
            onPress={() => handleOption('google')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.md,
              borderRadius: borderRadii.md,
              borderWidth: 1,
              borderColor: colors.grey_light,
              backgroundColor: colors.white,
            }}
          >
            <Text variant={'body_leading_poppins_medium'} color={'primary_dark'}>
              {t('onboarding.chooseRegistration.continueWithGoogle')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOption('apple')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.md,
              borderRadius: borderRadii.md,
              borderWidth: 1,
              borderColor: colors.grey_light,
              backgroundColor: colors.white,
            }}
          >
            <Text variant={'body_leading_poppins_medium'} color={'primary_dark'}>
              {t('onboarding.chooseRegistration.continueWithApple')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOption('email')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.md,
              borderRadius: borderRadii.md,
              backgroundColor: colors.primary,
            }}
          >
            <Text variant={'body_leading_poppins_medium'} color={'white'}>
              {t('onboarding.chooseRegistration.registerWithEmail')}
            </Text>
          </TouchableOpacity>
        </Box>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'} mb={'sm'}>
          {t('onboarding.chooseRegistration.trust')}
        </Text>

        <Divider vertical="sm" />

        <TouchableOpacity onPress={() => handleOption('login')}>
          <Text variant={'body_leading_poppins_medium'} color={'primary'} textAlign={'center'}>
            {t('onboarding.chooseRegistration.existingAccount')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export {ChooseRegistrationScreen};
