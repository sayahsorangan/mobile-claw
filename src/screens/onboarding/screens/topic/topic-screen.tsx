import React from 'react';

import {KeyboardAvoidingView, ScrollView} from 'react-native';

import Toast from 'react-native-toast-message';

import {Lotties} from '@app/assets/animations';
import {is_ios} from '@app/constan/app';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {TextInput} from '@components/inputs';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';

const TopicScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const [topic, setTopic] = React.useState('');

  return (
    <Container>
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
          <Box flexDirection={'row'}>
            <Box flex={1}>
              <Text variant={'h_2_poppins_extrabold'}>{t('onboarding.topicInput.screenHeadline')}</Text>
              <Text variant={'h_2_poppins_extrabold'} color={'primary'}>
                {t('onboarding.topicInput.screenHeadlineAccent')}
              </Text>
              <Text mt={'sm'} color={'grey'} variant={'body_poppins_regular'}>
                {t('onboarding.topicInput.screenSubtitle')}
              </Text>
            </Box>
            <Box backgroundColor="white" padding={'sm'} alignSelf={'flex-start'} borderRadius={'lg'}>
              <Text variant={'h_6_poppins_extrabold'} color="primary">
                1<Text variant={'body_helper_poppins_regular'}>/6</Text>
              </Text>
            </Box>
          </Box>
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <MascotText
              lottieAnimation={Lotties.pointing_mascot}
              text={t('onboarding.topicInput.messageTitle') + ' ' + t('onboarding.topicInput.messageBody')}
            />
          </Box>
          <Box mb={'xl'}>
            <TextInput
              label={t('onboarding.topicInput.label')}
              placeholder={t('onboarding.topicInput.placeholder')}
              iconRightName={topic?.length > 0 ? 'x' : 'search'}
              onRightIconPress={() => topic?.length > 0 && setTopic('')}
              onChangeText={setTopic}
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
          <Box flexDirection={'row'}>
            <Button secondary label={t('back')} onPress={() => Navigation.back()} />
            <Divider horizontal="md" />
            <Button
              label={t('next')}
              disabled={topic?.length == 0}
              onPress={() => Toast.show({type: 'error', text1: 'Error', text2: 'Unknown error occurred'})}
            />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export {TopicScreen};
