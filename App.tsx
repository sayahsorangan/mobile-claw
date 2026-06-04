import '@i18n';

import React, {useEffect, useRef} from 'react';

import {Animated, ImageBackground, Platform, StatusBar, UIManager} from 'react-native';

import moment from 'moment';

import {Images} from '@app/assets/images';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@app/constan/dimensions';
import {useAppSelector} from '@app/hooks/redux';
import {Box, dark_theme, theme} from '@app/themes';
import {AppProvider} from '@components-organisms/provider';
import {ErrorBoundary} from '@components/atoms/error-boundary';
import {STATUSBAR_HEIGHT} from '@components/container';
import i18n from '@i18n';
import {MainNavigator} from '@router/main-navigation';
import {ThemeProvider} from '@shopify/restyle';

const App = () => {
  const themeMode = useAppSelector(state => state.AppReducer.themeMode);
  const language = useAppSelector(state => state.AppReducer.language);

  useEffect(() => {
    moment.locale('en');
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    StatusBar.setBarStyle(themeMode === 'dark' ? 'light-content' : 'dark-content');
  }, [themeMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const activeTheme = themeMode === 'dark' ? dark_theme : theme;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <Box flex={1} backgroundColor={'white'}>
        <Animated.View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT + STATUSBAR_HEIGHT,
            zIndex: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: fadeAnim,
          }}
        >
          <ImageBackground
            source={Images.background}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT + STATUSBAR_HEIGHT,
            }}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
        </Animated.View>
        <ErrorBoundary>
          <MainNavigator />
        </ErrorBoundary>
      </Box>
    </ThemeProvider>
  );
};

function RootApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

export default RootApp;
