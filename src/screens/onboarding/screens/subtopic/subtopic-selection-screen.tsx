import React, {useEffect, useMemo, useState} from 'react';

import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';

import Toast from 'react-native-toast-message';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {TextInput} from '@components/inputs';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {OnboardingQueries} from '@react-query/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import type {SelectableOption} from '@screens/onboarding/types/selectable-option';

const DEFAULT_VISIBLE_COUNT = 9;

function dedupeSubtopicOptions(options: SelectableOption[]): SelectableOption[] {
  const seenKeys = new Set<string>();
  return options.filter(opt => {
    const key = typeof opt.blockId === 'number' ? `block:${opt.blockId}` : `id:${opt.id}`;
    if (seenKeys.has(key)) {
      return false;
    }
    seenKeys.add(key);
    return true;
  });
}

const SubtopicSelectionScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const onboardingSessionId = useAppSelector(state => state.OnboardingReducer.onboardingSessionId);
  const selectedCompetencyId = useAppSelector(state => state.OnboardingReducer.selectedCompetencyId);
  const selectedSubtopicId = useAppSelector(state => state.OnboardingReducer.selectedSubtopicId);

  const [subtopics, setSubtopics] = useState<SelectableOption[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {mutateAsync: submitCompetencyStep} = OnboardingQueries.useSubmitOnboardingStep();
  const {mutateAsync: submitTopicStep} = OnboardingQueries.useSubmitOnboardingStep();

  useEffect(() => {
    const fetchSubtopics = async () => {
      if (onboardingSessionId === null || selectedCompetencyId === null) {
        return;
      }
      try {
        setIsFetching(true);
        const result = await submitCompetencyStep({
          payload: {subject_area_id: Number(selectedCompetencyId)},
          sessionId: onboardingSessionId,
          step: 'competency_selection',
        });
        if (result.sessionId !== null && result.sessionId !== onboardingSessionId) {
          dispatch(onboarding_action.setOnboardingSessionId(result.sessionId));
        }
        setSubtopics(result.options);
      } catch (error: any) {
        Toast.show({type: 'error', text1: t('onboarding.errorOverlay.title'), text2: error?.message});
      } finally {
        setIsFetching(false);
      }
    };
    fetchSubtopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dedupedOptions = dedupeSubtopicOptions(subtopics);
  const isDirectTopicSelection = selectedCompetencyId === null;

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return dedupedOptions;
    }
    return dedupedOptions.filter(opt => opt.labels[language].toLowerCase().includes(q));
  }, [dedupedOptions, searchQuery, language]);

  const visibleSubtopics = filteredOptions.slice(0, visibleCount);
  const showLoadMore = filteredOptions.length > visibleCount;

  const heading = isDirectTopicSelection
    ? t('onboarding.subtopicSelection.directHeading')
    : t('onboarding.subtopicSelection.heading');

  const handleSelect = async (id: string) => {
    if (isSubmitting || onboardingSessionId === null) {
      return;
    }
    const selectedOption = dedupedOptions.find(o => o.id === id);
    const blockId = selectedOption?.blockId;
    if (typeof blockId !== 'number') {
      Toast.show({type: 'error', text1: 'Missing block ID for selected topic.'});
      return;
    }
    try {
      setIsSubmitting(true);
      dispatch(onboarding_action.selectSubtopic(id));
      const result = await submitTopicStep({
        payload: {block_id: blockId},
        sessionId: onboardingSessionId,
        step: 'topic_selection',
      });
      if (result.sessionId !== null && result.sessionId !== onboardingSessionId) {
        dispatch(onboarding_action.setOnboardingSessionId(result.sessionId));
      }
      Navigation.navigate(Route.source_identification);
    } catch (error: any) {
      Toast.show({type: 'error', text1: t('onboarding.errorOverlay.title'), text2: error?.message});
    } finally {
      setIsSubmitting(false);
    }
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
        <StepProgressHeader currentStep={3} maxStep={8} />

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
          {isDirectTopicSelection
            ? t('onboarding.subtopicSelection.directHelper')
            : t('onboarding.subtopicSelection.helper')}
        </Text>

        <Text mt={'xs'} variant={'body_leading_poppins_medium'} color={'primary_dark'} mb={'md'}>
          {heading}
        </Text>

        <Box marginVertical={'md'}>
          <TextInput
            placeholder={t('onboarding.subtopicSelection.searchPlaceholder')}
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
          ) : visibleSubtopics.length === 0 ? (
            <Box flex={1} alignItems={'center'} justifyContent={'center'} paddingVertical={'xl'}>
              <Text variant={'body_poppins_regular'} color={'grey'} textAlign={'center'}>
                {t('onboarding.subtopicSelection.emptyDescription')}
              </Text>
            </Box>
          ) : (
            <Box gap={'sm'}>
              {visibleSubtopics.map(subtopic => {
                const isSelected = selectedSubtopicId === subtopic.id && isSubmitting;
                return (
                  <TouchableOpacity
                    key={subtopic.id}
                    onPress={() => handleSelect(subtopic.id)}
                    disabled={isSubmitting}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing.md,
                      borderRadius: borderRadii.md,
                      backgroundColor: isSelected ? colors.primary_light : colors.white,
                    }}
                  >
                    <Text variant={'body_leading_poppins_medium'} color={'primary_dark'} style={{flex: 1}}>
                      {subtopic.labels[language]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Box>
          )}

          {showLoadMore ? (
            <Box mt={'md'}>
              <Button
                secondary
                label={t('onboarding.subtopicSelection.loadMore')}
                onPress={() => setVisibleCount(c => c + DEFAULT_VISIBLE_COUNT)}
              />
            </Box>
          ) : null}
        </Box>
      </ScrollView>
    </Container>
  );
};

export {SubtopicSelectionScreen};
