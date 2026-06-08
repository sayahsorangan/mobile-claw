import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {Icons} from '@app/assets/icons';
import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {timeCommitmentOptions} from '@screens/onboarding/data/time-commitment-options';

const TimeCommitmentScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedTimeCommitmentId = useAppSelector(state => state.OnboardingReducer.selectedTimeCommitmentId);

  const handleSelect = (id: string) => {
    dispatch(onboarding_action.selectTimeCommitment(id));
    Navigation.navigate(Route.outcome_preview);
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
        <StepProgressHeader currentStep={7} maxStep={8} />

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
          {t('onboarding.timeCommitment.question')}
        </Text>
        <Text mt={'xs'} variant={'body_helper_poppins_regular'} color={'grey'}>
          {t('onboarding.timeCommitment.helper')}
        </Text>

        <Box gap={'sm'} mb={'xl'} mt={'md'} flex={1}>
          {timeCommitmentOptions.map(option => {
            const isSelected = selectedTimeCommitmentId === option.id;
            const estimateLabel = option.estimateLabels[language];
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
                <Box
                  width={40}
                  height={40}
                  borderRadius={'sm'}
                  backgroundColor={isSelected ? 'primary' : 'primary_light'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  mr={'md'}
                >
                  <Icons.Feather name={'clock'} size={20} color={isSelected ? colors.white : colors.primary} />
                </Box>
                <Box flex={1}>
                  <Text variant={'body_leading_poppins_medium'} color={'primary_dark'}>
                    {option.labels[language]}
                  </Text>
                  {estimateLabel ? (
                    <Text variant={'body_helper_poppins_regular'} color={'grey'}>
                      {estimateLabel}
                    </Text>
                  ) : null}
                </Box>
              </TouchableOpacity>
            );
          })}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {TimeCommitmentScreen};
