import React from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {IconButton} from '@components/button/icon-button';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const GamificationPreparationScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  return (
    <Container withBackgroundImage>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <IconButton iconName="chevron-left" ButtonStyle={{alignSelf: 'flex-start'}} onPress={() => Navigation.back()} />
        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText
            lottieAnimation={Lotties.pointing_mascot}
            text={t('onboarding.gamificationPreparation.message')}
          />
        </Box>
        <Button label={t('next')} onPress={() => Navigation.navigate(Route.topic)} />
      </ScrollView>
    </Container>
  );
};

export {GamificationPreparationScreen};
