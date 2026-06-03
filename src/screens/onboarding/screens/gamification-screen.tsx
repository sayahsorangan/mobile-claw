import React from 'react';

import {Image, ScrollView} from 'react-native';

import {Images} from '@app/assets/images';
import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {Box, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {TKeys, translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';

const GamificationScreen = () => {
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
        <Image
          source={Images.logo}
          style={{width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.2, resizeMode: 'contain'}}
        />

        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText text={t(TKeys['onboarding.gamification.intro'])} />
        </Box>
        <Box flexDirection={'row'}>
          <Button secondary label={t(TKeys.back)} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button label={t(TKeys.next)} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {GamificationScreen};
