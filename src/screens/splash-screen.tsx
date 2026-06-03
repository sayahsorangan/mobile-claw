import React, {useEffect} from 'react';

import {Image} from 'react-native';

import {Images} from '@app/assets/images';
import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {Box, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {store} from '@redux-store/store';
import {Navigation, navigationRef} from '@router/navigation-helper';

const SplashScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  const navigate = () => {
    if (!navigationRef.isReady()) {
      setTimeout(navigate, 1500);
      return;
    }
    const {UserReducer} = store.getState();
    const isAuthenticated = !!UserReducer.auth?.accessToken;
    if (isAuthenticated) {
      Navigation.replace('tab', {screen: 'home'});
    } else {
      Navigation.replace('welcome');
    }
  };

  useEffect(() => {
    navigate();
  });

  return (
    <Container withBackgroundImage>
      <Box flex={1} marginTop="xl">
        <Box flexDirection="row">
          <Image source={Images.germany_flag} style={{width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.4}} />
          <Image
            source={Images.logo}
            style={{width: SCREEN_WIDTH * 0.6 - spacing.md, height: SCREEN_WIDTH * 0.4}}
            resizeMode="contain"
          />
        </Box>
        <Box flex={1}>
          <MascotText text={t('welcome.splashGreeting')} />
        </Box>
      </Box>
    </Container>
  );
};

export default SplashScreen;
