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

  const EXPERIENCE_MASCOT_MESSAGES: Record<string, string> = {
    'no-prior-knowledge': t('onboarding.mascotReaction.responses.noPriorKnowledge'),
    'heard-about-it': t('onboarding.mascotReaction.responses.heardAboutIt'),
    'know-basics': t('onboarding.mascotReaction.responses.knowBasics'),
    'practical-experience': t('onboarding.mascotReaction.responses.practicalExperience'),
    'worked-several-times': t('onboarding.mascotReaction.responses.workedSeveralTimes'),
    'very-familiar': t('onboarding.mascotReaction.responses.veryFamiliar'),
    'higher-level-directly': t('onboarding.mascotReaction.responses.higherLevelDirectly'),
    'no-practical-experience': t('onboarding.mascotReaction.responses.noPracticalExperience'),
  };

  const mascotMessage =
    (selectedExperienceId && EXPERIENCE_MASCOT_MESSAGES[selectedExperienceId]) ??
    t('onboarding.mascotReaction.responses.fallback');

  const [showList, setShowList] = useState(false);
  const mascotOpacity = useRef(new Animated.Value(1)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(mascotOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowList(true);
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [mascotOpacity, listOpacity]);

  const handleToggle = (id: string) => {
    dispatch(onboarding_action.toggleGoalMotivation(id));
  };

  return (
    <Container>
      <Box flex={1} padding={'md'}>
        <StepProgressHeader currentStep={6} maxStep={8} />

        {!showList && (
          <Animated.View style={{flex: 1, opacity: mascotOpacity}}>
            <MascotText lottieAnimation={Lotties.main_mascot} text={mascotMessage} streamText />
          </Animated.View>
        )}

        {showList && (
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
