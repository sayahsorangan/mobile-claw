import {Pressable} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Icons} from '@app/assets/icons';
import {Box, Text, theme} from '@app/themes';
import {STATUSBAR_HEIGHT} from '@components/container';
import {store} from '@redux-store/store';
import {LoginScreen} from '@screens/auth/login-screen';
import {AccountIntroScreen} from '@screens/onboarding/screens/account-intro/account-intro-screen';
import {ChooseRegistrationScreen} from '@screens/onboarding/screens/choose-registration/choose-registration-screen';
import {CompetencySelectionScreen} from '@screens/onboarding/screens/competency/competency-selection-screen';
import {DiagnosticAccountPromptScreen} from '@screens/onboarding/screens/diagnostic-account-prompt/diagnostic-account-prompt-screen';
import {DiagnosticCaseTransitionScreen} from '@screens/onboarding/screens/diagnostic-case-transition/diagnostic-case-transition-screen';
import {DiagnosticCaseScreen} from '@screens/onboarding/screens/diagnostic-case/diagnostic-case-screen';
import {DiagnosticCompletionScreen} from '@screens/onboarding/screens/diagnostic-completion/diagnostic-completion-screen';
import {DiagnosticIntroductionScreen} from '@screens/onboarding/screens/diagnostic-introduction/diagnostic-introduction-screen';
import {DiagnosticLeadInScreen} from '@screens/onboarding/screens/diagnostic-lead-in/diagnostic-lead-in-screen';
import {DiagnosticPreparationScreen} from '@screens/onboarding/screens/diagnostic-preparation/diagnostic-preparation-screen';
import {EntryLevelSelectionScreen} from '@screens/onboarding/screens/entry-level/entry-level-selection-screen';
import {LearningExperienceScreen} from '@screens/onboarding/screens/experience/learning-experience-screen';
import {GamificationPreparationScreen} from '@screens/onboarding/screens/gamificaiton/gamification-preparation-screen';
import {GamificationScreen} from '@screens/onboarding/screens/gamificaiton/gamification-screen';
import {GoalMotivationScreen} from '@screens/onboarding/screens/goal/goal-motivation-screen';
import {OutcomePreviewScreen} from '@screens/onboarding/screens/outcome/outcome-preview-screen';
import {PremiumBonusScreen} from '@screens/onboarding/screens/premium-bonus/premium-bonus-screen';
import {PremiumDetailScreen} from '@screens/onboarding/screens/premium-detail/premium-detail-screen';
import {PremiumEndForTodayScreen} from '@screens/onboarding/screens/premium-end-for-today/premium-end-for-today-screen';
import {PremiumLimitReachedScreen} from '@screens/onboarding/screens/premium-limit-reached/premium-limit-reached-screen';
import {PremiumSoftReminderScreen} from '@screens/onboarding/screens/premium-soft-reminder/premium-soft-reminder-screen';
import {PremiumUpgradeHubScreen} from '@screens/onboarding/screens/premium-upgrade-hub/premium-upgrade-hub-screen';
import {PricingAccessScreen} from '@screens/onboarding/screens/pricing/pricing-access-screen';
import {SourceIdentificationScreen} from '@screens/onboarding/screens/source/source-identification-screen';
import {SubtopicSelectionScreen} from '@screens/onboarding/screens/subtopic/subtopic-selection-screen';
import {TimeCommitmentScreen} from '@screens/onboarding/screens/time-commitment/time-commitment-screen';
import {TopicScreen} from '@screens/onboarding/screens/topic/topic-screen';
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
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
      initialRouteName={Route.splash}
    >
      <Stack.Screen name={Route.splash} component={SplashScreen} />
      <Stack.Screen name={Route.welcome} component={WelcomeScreen} />
      <Stack.Screen name={Route.login} component={LoginScreen} />

      {/* Onboarding: Gamification intro */}
      <Stack.Screen name={Route.gamification} component={GamificationScreen} />
      <Stack.Screen
        name={Route.gamification_preparation}
        component={GamificationPreparationScreen}
        options={{animation: 'fade'}}
      />

      {/* Onboarding: Topic + competency/subtopic selection */}
      <Stack.Screen name={Route.topic} component={TopicScreen} options={{animation: 'fade'}} />
      <Stack.Screen
        name={Route.competency_selection}
        component={CompetencySelectionScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name={Route.subtopic_selection} component={SubtopicSelectionScreen} options={{animation: 'fade'}} />

      {/* Onboarding: Entry level branching */}
      <Stack.Screen
        name={Route.entry_level_selection}
        component={EntryLevelSelectionScreen}
        options={{animation: 'fade'}}
      />

      {/* Onboarding: Core profiling flow */}
      <Stack.Screen
        name={Route.source_identification}
        component={SourceIdentificationScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name={Route.learning_experience}
        component={LearningExperienceScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name={Route.goal_motivation} component={GoalMotivationScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.time_commitment} component={TimeCommitmentScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.outcome_preview} component={OutcomePreviewScreen} options={{animation: 'fade'}} />
      <Stack.Screen name={Route.pricing_access} component={PricingAccessScreen} options={{animation: 'fade'}} />

      {/* Onboarding: Diagnostic flow */}
      <Stack.Screen name={Route.diagnostic_lead_in} component={DiagnosticLeadInScreen} />
      <Stack.Screen name={Route.diagnostic_introduction} component={DiagnosticIntroductionScreen} />
      <Stack.Screen name={Route.diagnostic_preparation} component={DiagnosticPreparationScreen} />
      <Stack.Screen name={Route.diagnostic_case} component={DiagnosticCaseScreen} />
      <Stack.Screen name={Route.diagnostic_case_transition} component={DiagnosticCaseTransitionScreen} />
      <Stack.Screen name={Route.diagnostic_completion} component={DiagnosticCompletionScreen} />
      <Stack.Screen name={Route.diagnostic_account_prompt} component={DiagnosticAccountPromptScreen} />

      {/* Onboarding: Account/registration */}
      <Stack.Screen name={Route.account_intro} component={AccountIntroScreen} />
      <Stack.Screen name={Route.choose_registration} component={ChooseRegistrationScreen} />

      {/* Onboarding: Premium funnel */}
      <Stack.Screen name={Route.premium_bonus} component={PremiumBonusScreen} />
      <Stack.Screen name={Route.premium_detail} component={PremiumDetailScreen} />
      <Stack.Screen name={Route.premium_end_for_today} component={PremiumEndForTodayScreen} />
      <Stack.Screen name={Route.premium_limit_reached} component={PremiumLimitReachedScreen} />
      <Stack.Screen name={Route.premium_soft_reminder} component={PremiumSoftReminderScreen} />
      <Stack.Screen name={Route.premium_upgrade_hub} component={PremiumUpgradeHubScreen} />

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
