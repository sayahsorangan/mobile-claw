import React from 'react';

import {ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getLevelHypothesisContent} from '@screens/onboarding/data/level-hypothesis-content';
import {getStepProgressLabel} from '@screens/onboarding/utils/progress';

const LevelHypothesisScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const language = useAppSelector(state => state.AppReducer.language);
  const selectedExperienceId = useAppSelector(state => state.OnboardingReducer.selectedExperienceId);

  const content = getLevelHypothesisContent(language, selectedExperienceId);

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
              {getStepProgressLabel(2, 3)}
            </Text>
          </Box>
        </Box>

        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <MascotText lottieAnimation={Lotties.main_mascot} text={content.headline} />
        </Box>

        <Box mt={'md'} padding={'md'} borderRadius={'md'} backgroundColor={'white'} mb={'xl'}>
          <Text variant={'body_leading_poppins_medium'} color={'primary_dark'} textAlign={'center'}>
            {content.body}
          </Text>
        </Box>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button
            label={t('onboarding.levelHypothesis.next')}
            onPress={() => Navigation.navigate(Route.diagnostic_preparation)}
          />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {LevelHypothesisScreen};
