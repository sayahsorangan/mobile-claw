import {Pressable} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Icons} from '@app/assets/icons';
import {Box, Text, theme} from '@app/themes';
import {STATUSBAR_HEIGHT} from '@components/container';
import {store} from '@redux-store/store';
import {LoginScreen} from '@screens/auth/login-screen';
import {GamificationScreen} from '@screens/onboarding/screens/gamification-screen';
import SplashScreen from '@screens/splash-screen';
import {WelcomeScreen} from '@screens/welcome-screen';

import {BottomTabScreen} from './bottom-navigation';
import {Route, RouteStackNavigation} from './route-name';

const Stack = createNativeStackNavigator<RouteStackNavigation>();

export const StackNavigator = () => {
  store.subscribe(store.getState);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        header: p => CustomHeader(p),
      }}
      initialRouteName={Route.splash}
    >
      <Stack.Screen name={Route.splash} component={SplashScreen} />
      <Stack.Screen name={Route.welcome} component={WelcomeScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.login} component={LoginScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.gamification} component={GamificationScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.tab} component={BottomTabScreen} />
    </Stack.Navigator>
  );
};

const CustomHeader = (p: any) => {
  return (
    <Box
      style={{
        paddingTop: STATUSBAR_HEIGHT + theme.spacing.xs,
      }}
      paddingHorizontal="xs"
      paddingVertical="xs"
      flexDirection="row"
      alignItems="center"
      backgroundColor="white"
      borderBottomWidth={1}
      borderColor="grey_light"
    >
      <Pressable
        style={{
          padding: theme.spacing.xs,
        }}
        onPress={() => p.navigation.goBack()}
      >
        <Icons.Feather name="chevron-left" size={24} color={theme.colors.grey_dark} />
      </Pressable>
      <Box flex={1}>
        <Text numberOfLines={1} variant={'h_6_poppins_medium'} marginHorizontal={'xs'}>
          {p.options.title}
        </Text>
      </Box>
      <Box style={{width: theme.spacing.xs * 2 + 24}}>
        {
          // @ts-ignore
          p.options.headerRight && p.options.headerRight(null)
        }
      </Box>
    </Box>
  );
};
