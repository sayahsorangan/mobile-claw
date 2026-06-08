import React, {useState} from 'react';

import {KeyboardAvoidingView, ScrollView} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {is_ios} from '@app/constan/app';
import {useAppDispatch} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {TextInput} from '@components/inputs';
import {MascotText} from '@components/mascot-text';
import {StepProgressHeader} from '@components/step-progress-header';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {OnboardingQueries} from '@react-query/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const TopicScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const dispatch = useAppDispatch();

  const [topic, setTopic] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutateAsync: startSession, isPending: isSubmitting} = OnboardingQueries.useStartOnboardingSession();

  const handleTopicChange = (value: string) => {
    if (errorMessage) {
      setErrorMessage(null);
    }
    setTopic(value);
  };

  const handleContinue = async () => {
    const trimmed = topic.trim();
    if (!trimmed || isSubmitting) {
      return;
    }
    try {
      setErrorMessage(null);
      const sessionId = await startSession();
      dispatch(onboarding_action.setOnboardingSessionId(sessionId));
      dispatch(onboarding_action.setTopicIntentAndResetDependents(trimmed));
      Navigation.navigate(Route.competency_selection);
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Something went wrong');
    }
  };

  return (
    <Container withBackgroundImage>
      <KeyboardAvoidingView
        behavior={is_ios ? 'padding' : undefined}
        keyboardVerticalOffset={is_ios ? 40 : 0}
        style={{flex: 1}}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: spacing.md,
            paddingBottom: spacing.xl,
          }}
        >
          <StepProgressHeader currentStep={1} maxStep={8} />
          <Text variant={'h_4_poppins_bold'}>
            {t('onboarding.topicInput.screenHeadline')}{' '}
            <Text variant={'h_4_poppins_bold'} color={'primary'}>
              {t('onboarding.topicInput.screenHeadlineAccent')}
            </Text>
          </Text>

          <Text mt={'sm'} color={'grey'} variant={'body_poppins_regular'}>
            {t('onboarding.topicInput.screenSubtitle')}
          </Text>

          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <MascotText
              lottieAnimation={Lotties.pointing_mascot}
              text={t('onboarding.topicInput.messageTitle') + ' ' + t('onboarding.topicInput.messageBody')}
            />
          </Box>
          <Box mb={'lg'}>
            <TextInput
              label={t('onboarding.topicInput.label')}
              placeholder={t('onboarding.topicInput.placeholder')}
              iconRightName={topic.length > 0 ? 'x' : 'search'}
              onRightIconPress={() => topic.length > 0 && handleTopicChange('')}
              onChangeText={handleTopicChange}
              value={topic}
              maxLength={200}
            />
            <Box
              backgroundColor="primary_light"
              paddingHorizontal={'md'}
              paddingVertical={'sm'}
              alignSelf={'center'}
              borderRadius={'lg'}
              mt={'lg'}
            >
              <Text variant={'body_helper_poppins_regular'}>{t('onboarding.topicInput.helperPill')}</Text>
            </Box>
          </Box>

          {errorMessage ? (
            <Box mb={'md'}>
              <Text variant={'body_helper_poppins_regular'} color={'danger'} textAlign={'center'}>
                {errorMessage}
              </Text>
            </Box>
          ) : null}

          <Button
            label={t('onboarding.topicInput.next')}
            disabled={topic.trim().length === 0}
            loading={isSubmitting}
            onPress={handleContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export {TopicScreen};
