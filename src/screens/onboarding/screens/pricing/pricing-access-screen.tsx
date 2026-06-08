import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {Lotties} from '@app/assets/animations';
import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {onboarding_action} from '@lib/redux/slice/onboarding';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';
import {getAccessModelOptions} from '@screens/onboarding/data/access-model-options';
import type {AccessModelOptionId} from '@screens/onboarding/types/access-model-option';

const PricingAccessScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const selectedAccessModelId = useAppSelector(state => state.OnboardingReducer.selectedAccessModelId);

  const options = getAccessModelOptions(t);

  const handleSelect = (id: AccessModelOptionId) => {
    dispatch(onboarding_action.selectAccessModel(id));
  };

  const handleNext = () => {
    if (!selectedAccessModelId) {
      return;
    }
    if (selectedAccessModelId === 'premium') {
      Navigation.navigate(Route.premium_detail);
    } else {
      Navigation.navigate(Route.level_hypothesis);
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
        <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'xs'}>
          {t('onboarding.pricing.headline')}
        </Text>
        <Text variant={'body_poppins_regular'} color={'grey'} mb={'lg'}>
          {t('onboarding.pricing.subline')}
        </Text>

        <Box flex={1} justifyContent={'center'} alignItems={'center'} mb={'lg'}>
          <MascotText lottieAnimation={Lotties.main_mascot} text={t('onboarding.pricing.mascotNote')} />
        </Box>

        <Box gap={'md'} mb={'lg'}>
          {options.map(option => {
            const isSelected = selectedAccessModelId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id as AccessModelOptionId)}
                style={{
                  padding: spacing.md,
                  borderRadius: borderRadii.md,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : colors.grey_light,
                  backgroundColor: isSelected ? colors.primary_light : colors.white,
                }}
              >
                <Text variant={'h_5_poppins_bold'} color={isSelected ? 'primary' : 'primary_dark'} mb={'xs'}>
                  {option.title}
                </Text>
                <Text variant={'body_poppins_regular'} color={'grey'} mb={'xs'}>
                  {option.description}
                </Text>
                <Box gap={'xxs'}>
                  {option.features.map((feature, i) => (
                    <Text key={i} variant={'body_helper_poppins_regular'} color={isSelected ? 'primary' : 'grey'}>
                      • {feature}
                    </Text>
                  ))}
                </Box>
              </TouchableOpacity>
            );
          })}
        </Box>

        <Text variant={'body_helper_poppins_regular'} color={'grey'} textAlign={'center'} mb={'lg'}>
          {t('onboarding.pricing.closing')}
        </Text>

        <Box flexDirection={'row'}>
          <Button secondary label={t('back')} onPress={() => Navigation.back()} />
          <Divider horizontal="md" />
          <Button label={t('onboarding.pricing.next')} disabled={!selectedAccessModelId} onPress={handleNext} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {PricingAccessScreen};
