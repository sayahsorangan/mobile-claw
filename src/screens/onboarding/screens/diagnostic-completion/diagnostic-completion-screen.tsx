import React, {useEffect} from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const DIAGNOSTIC_COMPLETION_DELAY_MS = 1800;

const DiagnosticCompletionScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      Navigation.navigate(Route.diagnostic_account_prompt);
    }, DIAGNOSTIC_COMPLETION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

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
              {getStepProgressLabel(5, 6)}
            </Text>
          </Box>
        </Box>

        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText lottieAnimation={Lotties.main_mascot} text={t('onboarding.diagnosticCompletion.message')} />
        </Box>

        <Button secondary label={t('back')} onPress={() => Navigation.back()} />
      </ScrollView>
    </Container>
  );
};

export {DiagnosticCompletionScreen};
