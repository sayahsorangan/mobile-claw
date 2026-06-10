import React, {useEffect, useRef, useState} from 'react';

import {Animated, ScrollView, TouchableOpacity} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {goalMotivationOptions} from '@screens/onboarding/data/goal-motivation-options';

type Phase = 'transition' | 'experience' | 'list';

const TRANSITION_DURATION_MS = 4000;
const EXPERIENCE_DURATION_MS = 5000;

const EXPERIENCE_MASCOT_MESSAGES: Record<string, string> = {
  'no-prior-knowledge': 'onboarding.mascotReaction.responses.noPriorKnowledge',
  'heard-about-it': 'onboarding.mascotReaction.responses.heardAboutIt',
  'know-basics': 'onboarding.mascotReaction.responses.knowBasics',
  'practical-experience': 'onboarding.mascotReaction.responses.practicalExperience',
  'worked-several-times': 'onboarding.mascotReaction.responses.workedSeveralTimes',
  'very-familiar': 'onboarding.mascotReaction.responses.veryFamiliar',
  'higher-level-directly': 'onboarding.mascotReaction.responses.higherLevelDirectly',
  'no-practical-experience': 'onboarding.mascotReaction.responses.noPracticalExperience',
};

const GoalMotivationScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedGoalMotivationIds = useAppSelector(state => state.OnboardingReducer.selectedGoalMotivationIds);
  const selectedSubtopicId = useAppSelector(state => state.OnboardingReducer.selectedSubtopicId);
  const subtopicOptions = useAppSelector(state => state.OnboardingReducer.subtopicOptions);
  const topicIntent = useAppSelector(state => state.OnboardingReducer.topicIntent);
  const selectedExperienceId = useAppSelector(state => state.OnboardingReducer.selectedExperienceId);

  const selectedSubtopic = subtopicOptions.find(item => item.id === selectedSubtopicId);
  const selectedTopicLabel =
    selectedSubtopic?.labels[language] ?? (topicIntent.trim() || t('onboarding.goalMotivation.fallbackTopic'));
  const question = `${t('onboarding.goalMotivation.questionPrefix')} ${selectedTopicLabel}?`;

  const experienceMessageKey =
    selectedExperienceId && EXPERIENCE_MASCOT_MESSAGES[selectedExperienceId]
      ? EXPERIENCE_MASCOT_MESSAGES[selectedExperienceId]
      : 'onboarding.mascotReaction.responses.fallback';

  const [phase, setPhase] = useState<Phase>('transition');
  const mascotOpacity = useRef(new Animated.Value(1)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: show transition message, then cross-fade to experience reaction
    const t1 = setTimeout(() => {
      Animated.timing(mascotOpacity, {toValue: 0, duration: 500, useNativeDriver: true}).start(() => {
        setPhase('experience');
        Animated.timing(mascotOpacity, {toValue: 1, duration: 500, useNativeDriver: true}).start();
      });
    }, TRANSITION_DURATION_MS);

    // Phase 2: show experience reaction, then fade to options list
    const t2 = setTimeout(() => {
      Animated.timing(mascotOpacity, {toValue: 0, duration: 500, useNativeDriver: true}).start(() => {
        setPhase('list');
        Animated.timing(listOpacity, {toValue: 1, duration: 200, useNativeDriver: true}).start();
      });
    }, TRANSITION_DURATION_MS + EXPERIENCE_DURATION_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mascotOpacity, listOpacity]);

  const handleToggle = (id: string) => {
    dispatch(onboarding_action.toggleGoalMotivation(id));
  };

  return (
    <Container>
      <Box flex={1} padding={'md'}>
        <StepProgressHeader currentStep={6} maxStep={8} />

        {phase !== 'list' && (
          <Animated.View style={{flex: 1, opacity: mascotOpacity}}>
            {phase === 'transition' ? (
              <MascotText lottieAnimation={Lotties.main_mascot} text={t(experienceMessageKey as any)} streamText />
            ) : (
              <MascotText
                lottieAnimation={Lotties.main_mascot}
                text={t('onboarding.transitionMotivation.message')}
                streamText
              />
            )}
          </Animated.View>
        )}

        {phase === 'list' && (
          <Animated.View style={{flex: 1, opacity: listOpacity}}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, paddingBottom: spacing.xl}}
              showsVerticalScrollIndicator={false}
            >
              <Box flexDirection={'row'} mb={'md'}>
                <Box flex={1}>
                  <Text variant={'h_4_poppins_bold'}>{question}</Text>
                  <Text mt={'xs'} variant={'body_helper_poppins_regular'} color={'grey'}>
                    {t('onboarding.goalMotivation.helper')}
                  </Text>
                </Box>
              </Box>

              <Box gap={'sm'} mb={'xl'} flex={1}>
                {goalMotivationOptions.map(option => {
                  const isSelected = selectedGoalMotivationIds.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => handleToggle(option.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: spacing.md,
                        borderRadius: borderRadii.md,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.primary : colors.grey_light,
                        backgroundColor: isSelected ? colors.primary_light : colors.white,
                      }}
                    >
                      <Text variant={'body_leading_poppins_medium'} color={'primary_dark'} style={{flex: 1}}>
                        {option.labels[language]}
                      </Text>
                      {isSelected ? (
                        <Box
                          width={20}
                          height={20}
                          borderRadius={'round'}
                          backgroundColor={'primary'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          ml={'sm'}
                        >
                          <Text variant={'body_helper_poppins_regular'} color={'white'}>
                            ✓
                          </Text>
                        </Box>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </Box>

              <Button
                label={t('onboarding.goalMotivation.next')}
                disabled={selectedGoalMotivationIds.length === 0}
                onPress={() => Navigation.navigate(Route.time_commitment)}
              />
            </ScrollView>
          </Animated.View>
        )}
      </Box>
    </Container>
  );
};

export {GoalMotivationScreen};
