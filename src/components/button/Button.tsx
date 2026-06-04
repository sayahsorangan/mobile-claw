import React from 'react';

import {ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

import {useTheme} from '@app/themes';

interface ButtonProps {
  children?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  ButtonStyle?: StyleProp<ViewStyle>;
  LabelStyle?: StyleProp<TextStyle>;
  secondary?: boolean;
  disabled?: boolean;
  rightItem?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.memo((props: ButtonProps) => {
  const {colors, borderRadii, textVariants} = useTheme();
  const {
    onPress,
    ButtonStyle,
    label = 'Test',
    secondary = false,
    disabled = false,
    LabelStyle,
    rightItem,
    children,
    loading,
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          backgroundColor: disabled ? colors.primary_light : secondary ? undefined : colors.primary,
          borderRadius: borderRadii.lg,
          height: 56,
          borderWidth: disabled ? 0 : 1,
          borderColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          maxHeight: 64,
        },
        ButtonStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size={'small'} />
      ) : children ? (
        children
      ) : (
        <>
          <Text
            style={[
              {
                ...textVariants.button_l_poppins_bold,
                color: disabled ? colors.white : secondary ? colors.primary : colors.white,
              },
              LabelStyle,
            ]}
          >
            {label}
          </Text>
          {rightItem ?? rightItem}
        </>
      )}
    </TouchableOpacity>
  );
});
