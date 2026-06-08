import React from 'react';

import {Image, ScrollView} from 'react-native';

import {Images} from '@app/assets/images';
import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {useAppDispatch} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {onboarding_action} from '@redux-store/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const WelcomeScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const dispatch = useAppDispatch();

  const onStartOnboarding = () => {
    dispatch(onboarding_action.resetOnboarding());
    Navigation.navigate(Route.gamification);
  };

  return (
    <Container backgroundColor={'transparent'}>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xl}}>
        <Image
          source={Images.logo}
          style={{width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.2, resizeMode: 'contain'}}
        />
        <Text variant={'h_2_poppins_bold'} letterSpacing={-0.5}>
          {t('welcome.ctaGreeting').split('\n')[0]}
        </Text>
        <Text variant={'h_2_poppins_bold'} color={'primary'} letterSpacing={-0.5}>
          {t('welcome.ctaGreeting').split('\n')[1]}
        </Text>
        <MascotText text={t('welcome.beginBubble')} />
        <Box flexDirection={'row'}>
          <Button secondary label={t('welcome.login')} onPress={() => Navigation.navigate(Route.login)} />
          <Divider horizontal="md" />
          <Button label={t('welcome.start')} onPress={onStartOnboarding} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {WelcomeScreen};
