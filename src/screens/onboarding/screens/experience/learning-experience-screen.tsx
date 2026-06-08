import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {experienceOptions} from '@screens/onboarding/data/experience-options';

const LearningExperienceScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedExperienceId = useAppSelector(state => state.OnboardingReducer.selectedExperienceId);
  const selectedSubtopicId = useAppSelector(state => state.OnboardingReducer.selectedSubtopicId);
  const subtopicOptions = useAppSelector(state => state.OnboardingReducer.subtopicOptions);

  const selectedSubtopic = subtopicOptions.find(item => item.id === selectedSubtopicId);
  const selectedSubtopicLabel = selectedSubtopic?.labels[language] ?? t('onboarding.learningExperience.fallbackTopic');
  const question = `${t('onboarding.learningExperience.questionPrefix')} ${selectedSubtopicLabel}?`;

  const handleSelect = (id: string) => {
    dispatch(onboarding_action.selectExperience(id));
    Navigation.navigate(Route.goal_motivation);
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <StepProgressHeader currentStep={5} maxStep={8} />

        <Box flexDirection={'row'} mb={'md'}>
          <Box flex={1}>
            <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
              {question}
            </Text>
            <Text mt={'xs'} variant={'body_helper_poppins_regular'} color={'grey'}>
              {t('onboarding.learningExperience.helper')}
            </Text>
          </Box>
        </Box>

        <Box gap={'sm'} mb={'xl'}>
          {experienceOptions.map(option => {
            const isSelected = selectedExperienceId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
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
              </TouchableOpacity>
            );
          })}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {LearningExperienceScreen};
