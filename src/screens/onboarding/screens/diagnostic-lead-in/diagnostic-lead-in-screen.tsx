import React from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const DiagnosticLeadInScreen = () => {
  const t = translate;
  const {spacing} = useTheme();

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
              {getStepProgressLabel(1, 6)}
            </Text>
          </Box>
        </Box>

        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText lottieAnimation={Lotties.pointing_mascot} text={t('onboarding.diagnosticLeadIn.message')} />
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.diagnosticLeadIn.start')}
            onPress={() => Navigation.navigate(Route.diagnostic_introduction)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {DiagnosticLeadInScreen};
