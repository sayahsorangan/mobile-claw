import React from 'react';

import {ScrollView} from 'react-native';

import {useAppDispatch} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {translate} from '@i18n';
import {diagnostic_action} from '@lib/redux/slice/diagnostic';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const DiagnosticIntroductionScreen = () => {
  const t = translate;
  const {spacing, colors} = useTheme();
  const dispatch = useAppDispatch();

  const exampleOptions = [
    t('onboarding.diagnosticIntroduction.optionA'),
    t('onboarding.diagnosticIntroduction.optionB'),
    t('onboarding.diagnosticIntroduction.optionC'),
    t('onboarding.diagnosticIntroduction.optionD'),
    t('onboarding.diagnosticIntroduction.optionE'),
    t('onboarding.diagnosticIntroduction.optionF'),
  ];

  const handleNext = () => {
    dispatch(diagnostic_action.resetDiagnostic());
    Navigation.navigate(Route.diagnostic_preparation);
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
              {getStepProgressLabel(2, 6)}
            </Text>
          </Box>
        </Box>

        <Text variant={'h_5_poppins_bold'} color={'primary_dark'} mb={'sm'}>
          {t('onboarding.diagnosticIntroduction.exampleSituation')}
        </Text>

        <Box padding={'md'} borderRadius={'md'} backgroundColor={'primary_light'} mb={'md'}>
          <Text variant={'body_poppins_regular'} color={'primary_dark'}>
            {t('onboarding.diagnosticIntroduction.exampleQuestion')}
          </Text>
        </Box>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} mb={'sm'}>
          {t('onboarding.diagnosticIntroduction.hint')}
        </Text>

        <Box gap={'xs'} mb={'xl'}>
          {exampleOptions.map((opt, i) => (
            <Box
              key={i}
              padding={'sm'}
              borderRadius={'sm'}
              style={{
                borderWidth: 1,
                borderColor: colors.grey_light,
              }}
            >
              <Text variant={'body_poppins_regular'} color={'primary_dark'}>
                {opt}
              </Text>
            </Box>
          ))}
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button label={t('onboarding.diagnosticCase.next')} onPress={handleNext} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {DiagnosticIntroductionScreen};
