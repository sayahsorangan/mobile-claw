import React, {useEffect, useMemo, useState} from 'react';

import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';

import Toast from 'react-native-toast-message';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {TextInput} from '@components/inputs';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {OnboardingQueries} from '@react-query/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import type {SelectableOption} from '@screens/onboarding/types/selectable-option';

const CompetencySelectionScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const topicIntent = useAppSelector(state => state.OnboardingReducer.topicIntent);
  const selectedCompetencyId = useAppSelector(state => state.OnboardingReducer.selectedCompetencyId);

  const [areas, setAreas] = useState<SelectableOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const {mutateAsync: startSession} = OnboardingQueries.useStartOnboardingSession();
  const {mutateAsync: submitTopicStep} = OnboardingQueries.useSubmitOnboardingStep();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setIsFetching(true);
        const sessionId = await startSession();
        dispatch(onboarding_action.setOnboardingSessionId(sessionId));
        const result = await submitTopicStep({
          payload: {query: topicIntent},
          sessionId,
          step: 'topic_input',
        });
        if (result.sessionId !== null && result.sessionId !== sessionId) {
          dispatch(onboarding_action.setOnboardingSessionId(result.sessionId));
        }
        setAreas(result.options);
      } catch (error: any) {
        Toast.show({type: 'error', text1: t('onboarding.errorOverlay.title'), text2: error?.message});
      } finally {
        setIsFetching(false);
      }
    };
    fetchAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleAreas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return areas;
    }
    return areas.filter(area => area.labels[language].toLowerCase().includes(q));
  }, [areas, searchQuery, language]);

  const handleSelect = (id: string) => {
    dispatch(onboarding_action.selectCompetency(id));
    Navigation.navigate(Route.subtopic_selection);
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
        <StepProgressHeader currentStep={2} maxStep={8} />

        <Text variant={'h_4_poppins_bold'}>
          {t('onboarding.competencySelection.heading')}{' '}
          <Text variant={'h_4_poppins_bold'} color={'primary'}>
            {`"${topicIntent}"`}
          </Text>
        </Text>

        <Text mt={'xs'} variant={'body_helper_poppins_regular'} color={'grey'}>
          {t('onboarding.competencySelection.helper')}
        </Text>

        <Box marginVertical={'md'}>
          <TextInput
            placeholder={t('onboarding.competencySelection.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            iconRightName={searchQuery ? 'x' : 'search'}
            onRightIconPress={() => searchQuery && setSearchQuery('')}
          />
        </Box>

        <Box flex={1} mb={'xl'}>
          {isFetching ? (
            <Box flex={1} alignItems={'center'} justifyContent={'center'} paddingVertical={'xl'}>
              <ActivityIndicator />
            </Box>
          ) : visibleAreas.length === 0 ? (
            <Box flex={1} alignItems={'center'} justifyContent={'center'} paddingVertical={'xl'}>
              <Text variant={'body_poppins_regular'} color={'grey'} textAlign={'center'}>
                {t('onboarding.competencySelection.emptyDescription')}
              </Text>
            </Box>
          ) : (
            <Box gap={'sm'}>
              {visibleAreas.map(area => {
                const isSelected = selectedCompetencyId === area.id;
                return (
                  <TouchableOpacity
                    key={area.id}
                    onPress={() => handleSelect(area.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing.md,
                      borderRadius: borderRadii.md,
                      backgroundColor: isSelected ? colors.primary_light : colors.white,
                    }}
                  >
                    <Text variant={'body_leading_poppins_medium'} color={'primary_dark'}>
                      {area.labels[language]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Box>
          )}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {CompetencySelectionScreen};
