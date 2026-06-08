import React, {useState} from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {useAppDispatch} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {diagnostic_action} from '@lib/redux/slice/diagnostic';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {diagnosticCases} from '@screens/onboarding/data/diagnostic-cases';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const DiagnosticCaseScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  const diagnosticCase = diagnosticCases[0];

  if (!diagnosticCase) {
    return null;
  }

  const actionDisabled = selectedOptionIds.length !== 2;

  const handleToggleOption = (id: string) => {
    setSelectedOptionIds(currentIds => {
      if (currentIds.includes(id)) {
        return currentIds.filter(cid => cid !== id);
      }
      if (currentIds.length >= 2) {
        return currentIds;
      }
      return [...currentIds, id];
    });
  };

  const handleNext = () => {
    if (actionDisabled) {
      return;
    }
    dispatch(diagnostic_action.submitAnswer({caseId: diagnosticCase.id, selectedOptionIds}));
    Navigation.navigate(Route.diagnostic_case_transition);
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
          <Box flex={1} />
          <Box backgroundColor="white" padding={'sm'} alignSelf={'flex-start'} borderRadius={'lg'}>
            <Text variant={'h_6_poppins_extrabold'} color="primary">
              {getStepProgressLabel(3, 6)}
            </Text>
          </Box>
        </Box>

        <Box padding={'md'} borderRadius={'md'} backgroundColor={'primary_light'} mb={'md'}>
          <Text variant={'body_helper_poppins_regular'} color={'primary'} mb={'xs'}>
            {t('onboarding.diagnosticCase.situationLabel')}
          </Text>
          <Text variant={'body_poppins_regular'} color={'primary_dark'}>
            {diagnosticCase.situation}
          </Text>
        </Box>

        <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mb={'xs'}>
          {diagnosticCase.question}
        </Text>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} mb={'md'}>
          {t('onboarding.diagnosticCase.hint')}
        </Text>

        <Box gap={'xs'} mb={'xl'}>
          {diagnosticCase.options.map(option => {
            const isSelected = selectedOptionIds.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleToggleOption(option.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.sm,
                  borderRadius: borderRadii.sm,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.grey_light,
                  backgroundColor: isSelected ? colors.primary_light : colors.white,
                }}
              >
                <Box
                  width={28}
                  height={28}
                  borderRadius={'sm'}
                  backgroundColor={isSelected ? 'primary' : 'primary_light'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  mr={'sm'}
                >
                  <Text variant={'body_helper_poppins_regular'} color={isSelected ? 'white' : 'primary'}>
                    {isSelected ? '✓' : String.fromCharCode(65 + diagnosticCase.options.indexOf(option))}
                  </Text>
                </Box>
                <Text variant={'body_poppins_regular'} color={'primary_dark'} style={{flex: 1}}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button label={t('onboarding.diagnosticCase.next')} disabled={actionDisabled} onPress={handleNext} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {DiagnosticCaseScreen};
