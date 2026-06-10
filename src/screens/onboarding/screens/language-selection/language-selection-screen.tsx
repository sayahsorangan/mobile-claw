import React from 'react';

import {ScrollView, TouchableOpacity} from 'react-native';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {Container} from '@components/container';
import {translate} from '@i18n';
import {app_action, AppLanguage} from '@lib/redux/slice/app/app';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const LANGUAGE_OPTIONS: {id: AppLanguage; label: string; nativeLabel: string}[] = [
  {id: 'en', label: 'English', nativeLabel: 'English'},
  {id: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia'},
];

const LanguageSelectionScreen = () => {
  const t = translate;
  const {spacing, colors, borderRadii} = useTheme();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(state => state.AppReducer.language);

  const handleSelect = (lang: AppLanguage) => {
    dispatch(app_action.setLanguage(lang));
    Navigation.navigate(Route.diagnostic_introduction);
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
        <Box flex={1} justifyContent={'center'}>
          <Text variant={'h_4_poppins_bold'} color={'primary_dark'} mb={'xs'}>
            {t('languageSelection.title')}
          </Text>
          <Text variant={'body_poppins_regular'} color={'grey'} mb={'xl'}>
            {t('languageSelection.description')}
          </Text>

          <Box gap={'sm'}>
            {LANGUAGE_OPTIONS.map(option => {
              const isSelected = currentLanguage === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelect(option.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.md,
                    borderRadius: borderRadii.md,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.grey_light,
                    backgroundColor: isSelected ? colors.primary_light : colors.white,
                  }}
                >
                  <Box flex={1}>
                    <Text variant={'body_leading_poppins_medium'} color={isSelected ? 'primary' : 'primary_dark'}>
                      {option.nativeLabel}
                    </Text>
                    {option.nativeLabel !== option.label ? (
                      <Text variant={'body_helper_poppins_regular'} color={'grey'}>
                        {option.label}
                      </Text>
                    ) : null}
                  </Box>
                  {isSelected ? (
                    <Box
                      width={22}
                      height={22}
                      borderRadius={'round'}
                      backgroundColor={'primary'}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <Text variant={'body_helper_poppins_regular'} color={'white'}>
                        ✓
                      </Text>
                    </Box>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>

        <Box mt={'xl'}>
          <Button label={t('next')} onPress={() => Navigation.navigate(Route.diagnostic_introduction)} />
        </Box>
      </ScrollView>
    </Container>
  );
};

export {LanguageSelectionScreen};
