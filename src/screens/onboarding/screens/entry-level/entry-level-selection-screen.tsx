import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {entryLevelOptions} from '@screens/onboarding/data/entry-level-options';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const EntryLevelSelectionScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedEntryLevelId = useAppSelector(state => state.OnboardingReducer.selectedEntryLevelId);

  const handleSelect = (id: string) => {
    dispatch(onboarding_action.selectEntryLevel(id));
  };

  const handleNext = () => {
    if (!selectedEntryLevelId) {
      return;
    }
    if (selectedEntryLevelId === 'diagnostic') {
      Navigation.navigate(Route.diagnostic_lead_in);
    } else {
      Navigation.navigate(Route.source_identification);
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
        <Box flexDirection={'row'} mb={'md'}>
          <Box flex={1}>
            <Text variant={'h_4_poppins_bold'} color={'primary_dark'}>
              {t('onboarding.entryLevel.question')}
            </Text>
            <Text mt={'xs'} variant={'body_helper_poppins_regular'} color={'grey'}>
              {t('onboarding.entryLevel.helper')}
            </Text>
          </Box>
          <Box backgroundColor="white" padding={'sm'} alignSelf={'flex-start'} borderRadius={'lg'}>
            <Text variant={'h_6_poppins_extrabold'} color="primary">
              {getStepProgressLabel(1, 3)}
            </Text>
          </Box>
        </Box>

        <Box gap={'sm'} mb={'xl'}>
          {entryLevelOptions.map(option => {
            const isSelected = selectedEntryLevelId === option.id;
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
                  <Text variant={'h_6_poppins_bold'} color={isSelected ? 'white' : 'primary'}>
                    {option.icon}
                  </Text>
                </Box>
                <Text variant={'body_leading_poppins_medium'} color={'primary_dark'} style={{flex: 1}}>
                  {option.labels[language]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button label={t('onboarding.entryLevel.next')} disabled={!selectedEntryLevelId} onPress={handleNext} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {EntryLevelSelectionScreen};
