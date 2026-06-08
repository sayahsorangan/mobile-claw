import React from 'react';

import {Box, Text} from '@app/themes';
import {IconButton} from '@components/button/icon-button';
import {Navigation} from '@router/navigation-helper';

interface StepProgressHeaderProps {
  currentStep: number;
  maxStep: number;
  onBack?: () => void;
}

export const StepProgressHeader = React.memo((props: StepProgressHeaderProps) => {
  const {currentStep, maxStep, onBack} = props;
  const progress = `${Math.round((currentStep / maxStep) * 100)}%`;

  return (
    <Box flexDirection={'row'} alignItems={'center'} mb={'md'}>
      <IconButton
        iconName="chevron-left"
        ButtonStyle={{alignSelf: 'flex-start'}}
        onPress={onBack ?? (() => Navigation.back())}
      />
      <Box flex={1} height={8} backgroundColor={'grey_light'} marginLeft={'md'} borderRadius={'sm'}>
        <Box flex={1} backgroundColor={'primary'} borderRadius={'sm'} width={progress} />
      </Box>
      <Text variant={'body_poppins_semibold'} color={'black'} ml={'md'}>
        {`Step ${currentStep} of ${maxStep}`}
      </Text>
    </Box>
  );
});
