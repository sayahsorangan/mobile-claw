import React from 'react';

import {Image, ScrollView} from 'react-native';

import {Images} from '@app/assets/images';
import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {TKeys, translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const WelcomeScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  return (
    <Container>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xl}}>
        <Image
          source={Images.logo}
          style={{width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.2, resizeMode: 'contain'}}
        />
        <Text variant={'h_2_poppins_bold'} letterSpacing={-0.5}>
          {t(TKeys['welcome.ctaGreeting']).split('\n')[0]}
        </Text>
        <Text variant={'h_2_poppins_bold'} color={'primary'} letterSpacing={-0.5}>
          {t(TKeys['welcome.ctaGreeting']).split('\n')[1]}
        </Text>
        <MascotText text={t(TKeys['welcome.beginBubble'])} />
        <Box flexDirection={'row'}>
          <Button secondary label={t(TKeys['welcome.login'])} onPress={() => Navigation.navigate(Route.login)} />
          <Divider horizontal="md" />
          <Button label={t(TKeys['welcome.start'])} onPress={() => Navigation.navigate(Route.gamification)} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {WelcomeScreen};
