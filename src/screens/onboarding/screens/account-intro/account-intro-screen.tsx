import React from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const AccountIntroScreen = () => {
  const t = translate;
  const {spacing, colors} = useTheme();

  const benefitItems = [
    t('onboarding.accountIntro.benefits.progressSaved'),
    t('onboarding.accountIntro.benefits.continueLater'),
    t('onboarding.accountIntro.benefits.levelSaved'),
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
        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'xs'}>
          {t('onboarding.accountIntro.headline')}
        </Text>
        <Text variant={'body_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.accountIntro.subline')}
        </Text>

        <Box flex={1} justifyContent={'center'} alignItems={'center'} mb={'lg'}>
          <MascotText lottieAnimation={Lotties.pointing_mascot} text={t('onboarding.accountIntro.bubble')} />
        </Box>

        <Box gap={'sm'} mb={'lg'}>
          {benefitItems.map((item, i) => (
            <Box
              key={i}
              flexDirection={'row'}
              alignItems={'center'}
              padding={'sm'}
              borderRadius={'sm'}
              style={{
                borderWidth: 1,
                borderColor: colors.grey_light,
              }}
            >
              <Box
                width={28}
                height={28}
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
                {item}
              </Text>
            </Box>
          ))}
        </Box>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'} mb={'md'}>
          {t('onboarding.accountIntro.footerHint')}
        </Text>

        <Box flexDirection={'row'}>
          <Button
            secondary
            label={t('onboarding.accountIntro.secondaryCta')}
            onPress={() => Navigation.navigate(Route.gamification)}
          />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.accountIntro.primaryCta')}
            onPress={() => Navigation.navigate(Route.choose_registration)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {AccountIntroScreen};
