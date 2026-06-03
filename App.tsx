import '@i18n';

import React, {useEffect} from 'react';

import {Platform, StatusBar, UIManager} from 'react-native';

import moment from 'moment';

import {useAppSelector} from '@app/hooks/redux';
import {dark_theme, theme} from '@app/themes';
import {AppProvider} from '@components-organisms/provider';
import {ErrorBoundary} from '@components/atoms/error-boundary';
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

  return (
    <ThemeProvider theme={activeTheme}>
      <ErrorBoundary>
        <MainNavigator />
      </ErrorBoundary>
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
