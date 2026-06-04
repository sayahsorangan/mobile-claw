import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import Toast, {ToastConfig} from 'react-native-toast-message';

import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {Box, Text} from '@app/themes';

import {linking} from './linking';
import {navigationRef} from './navigation-helper';
import {StackNavigator} from './stack-navigation';

const ToastComponent = ({type, text1, text2}: {type: 'error' | 'success' | 'info'; text1?: string; text2?: string}) => {
  return (
    <Box
      backgroundColor={type == 'error' ? 'danger' : type == 'success' ? 'success' : 'primary'}
      marginTop={'md'}
      padding={'md'}
      paddingHorizontal={'lg'}
      maxWidth={SCREEN_WIDTH - 32}
      borderRadius={'md'}
    >
      <Text color="white" variant={'body_leading_poppins_semibold'}>
        {text1}
      </Text>
      <Text color="white" variant={'body_helper_poppins_regular'} mt={'xxs'}>
        {text2}
      </Text>
    </Box>
  );
};

export const MainNavigator = () => {
  const routeNameRef = React.useRef<string | undefined>('');

  const onReady = React.useCallback(async () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  }, []);

  async function onStateChange() {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    routeNameRef.current = currentRouteName;
  }

  const toastConfig: ToastConfig = {
    error: ({text1, text2}) => {
      return ToastComponent({type: 'error', text1, text2});
    },
    success: ({text1, text2}) => {
      return ToastComponent({type: 'success', text1, text2});
    },
    info: ({text1, text2}) => {
      return ToastComponent({type: 'info', text1, text2});
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
      documentTitle={{enabled: true}}
      linking={linking}
    >
      <StackNavigator />
      <Toast config={toastConfig} position="top" />
    </NavigationContainer>
  );
};
