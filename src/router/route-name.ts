import {NavigatorScreenParams} from '@react-navigation/native';

export const Route = {
  splash: 'splash',
  tab: 'tab',
  home: 'home',
  welcome: 'welcome',
  login: 'login',
  gamification: 'gamification',
} as const;

export interface IBottomTabScreen {
  [key: string]: undefined;
  home: undefined;
  knowledge: undefined;
  profile: undefined;
  notification: undefined;
}

export type StackScreens = {
  [Route.splash]: undefined;
  [Route.home]: undefined;
  [Route.welcome]: undefined;
  [Route.login]: undefined;
  [Route.gamification]: undefined;
};

export type RouteStackNavigation = {
  [Route.tab]: NavigatorScreenParams<IBottomTabScreen>;
} & StackScreens;
