import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getOutcomePreviewCards} from '@screens/onboarding/data/outcome-preview-content';

const OutcomePreviewScreen = () => {
  const t = translate;
  const {spacing, colors} = useTheme();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedExperienceId = useAppSelector(state => state.OnboardingReducer.selectedExperienceId);
  const selectedGoalMotivationIds = useAppSelector(state => state.OnboardingReducer.selectedGoalMotivationIds);
  const selectedTimeCommitmentId = useAppSelector(state => state.OnboardingReducer.selectedTimeCommitmentId);

  const cards = getOutcomePreviewCards({
    currentLanguage: language,
    selectedExperienceId,
    selectedGoalMotivationIds,
    selectedTimeCommitmentId,
  });

  const onPressCard = (cardId: string) => {
    Navigation.navigate(Route.entry_level_selection);
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
        <StepProgressHeader currentStep={8} maxStep={8} />

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'md'}>
          {t('onboarding.outcomePreview.question')}
        </Text>

        <Box gap={'md'} mb={'xl'} flex={1}>
          {cards.map(card => (
            <TouchableOpacity key={card.id} onPress={() => onPressCard(card.id)}>
              <Box
                key={card.id}
                padding={'md'}
                borderRadius={'md'}
                backgroundColor={'white'}
                style={{
                  borderWidth: 1,
                  borderColor: colors.grey_light,
                }}
              >
                <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mb={'xs'}>
                  {card.title}
                </Text>
                <Text variant={'body_poppins_regular'} color={'grey'}>
                  {card.body}
                </Text>
              </Box>
            </TouchableOpacity>
          ))}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {OutcomePreviewScreen};
