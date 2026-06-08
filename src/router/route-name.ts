import {NavigatorScreenParams} from '@react-navigation/native';

export const Route = {
  splash: 'splash',
  tab: 'tab',
  home: 'home',
  welcome: 'welcome',
  login: 'login',
  register_email: 'register_email',
  gamification: 'gamification',
  gamification_preparation: 'gamification_preparation',
  topic: 'topic',
  competency_selection: 'competency_selection',
  subtopic_selection: 'subtopic_selection',
  entry_level_selection: 'entry_level_selection',
  source_identification: 'source_identification',
  learning_experience: 'learning_experience',
  mascot_reaction: 'mascot_reaction',
  level_hypothesis: 'level_hypothesis',
  goal_motivation: 'goal_motivation',
  motivation_reaction: 'motivation_reaction',
  time_commitment: 'time_commitment',
  outcome_preview: 'outcome_preview',
  pricing_access: 'pricing_access',
  diagnostic_lead_in: 'diagnostic_lead_in',
  diagnostic_introduction: 'diagnostic_introduction',
  diagnostic_preparation: 'diagnostic_preparation',
  diagnostic_case: 'diagnostic_case',
  diagnostic_case_transition: 'diagnostic_case_transition',
  diagnostic_completion: 'diagnostic_completion',
  diagnostic_account_prompt: 'diagnostic_account_prompt',
  account_intro: 'account_intro',
  choose_registration: 'choose_registration',
  premium_bonus: 'premium_bonus',
  premium_detail: 'premium_detail',
  premium_end_for_today: 'premium_end_for_today',
  premium_limit_reached: 'premium_limit_reached',
  premium_soft_reminder: 'premium_soft_reminder',
  premium_upgrade_hub: 'premium_upgrade_hub',
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
  [Route.register_email]: undefined;
  [Route.gamification]: undefined;
  [Route.gamification_preparation]: undefined;
  [Route.topic]: undefined;
  [Route.competency_selection]: undefined;
  [Route.subtopic_selection]: undefined;
  [Route.entry_level_selection]: undefined;
  [Route.source_identification]: undefined;
  [Route.learning_experience]: undefined;
  [Route.mascot_reaction]: undefined;
  [Route.level_hypothesis]: undefined;
  [Route.goal_motivation]: undefined;
  [Route.motivation_reaction]: undefined;
  [Route.time_commitment]: undefined;
  [Route.outcome_preview]: undefined;
  [Route.pricing_access]: undefined;
  [Route.diagnostic_lead_in]: undefined;
  [Route.diagnostic_introduction]: undefined;
  [Route.diagnostic_preparation]: undefined;
  [Route.diagnostic_case]: undefined;
  [Route.diagnostic_case_transition]: undefined;
  [Route.diagnostic_completion]: undefined;
  [Route.diagnostic_account_prompt]: undefined;
  [Route.account_intro]: undefined;
  [Route.choose_registration]: undefined;
  [Route.premium_bonus]: undefined;
  [Route.premium_detail]: undefined;
  [Route.premium_end_for_today]: undefined;
  [Route.premium_limit_reached]: undefined;
  [Route.premium_soft_reminder]: undefined;
  [Route.premium_upgrade_hub]: undefined;
};

export type RouteStackNavigation = {
  [Route.tab]: NavigatorScreenParams<IBottomTabScreen>;
} & StackScreens;
