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

const DiagnosticAccountPromptScreen = () => {
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
              {getStepProgressLabel(6, 6)}
            </Text>
          </Box>
        </Box>

        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'xs'}>
          {t('onboarding.diagnosticAccountPrompt.headline')}
        </Text>
        <Text variant={'body_poppins_regular'} color={'grey'} mb={'md'}>
          {t('onboarding.diagnosticAccountPrompt.subline')}
        </Text>

        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText
            lottieAnimation={Lotties.pointing_mascot}
            text={t('onboarding.diagnosticAccountPrompt.message')}
          />
        </Box>

        <Box flexDirection={'row'} mt={'xl'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.diagnosticAccountPrompt.cta')}
            onPress={() => Navigation.navigate(Route.pricing_access)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {DiagnosticAccountPromptScreen};
