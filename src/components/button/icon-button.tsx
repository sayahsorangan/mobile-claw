import React from 'react';

import {ActivityIndicator, Pressable, StyleProp, TextStyle, ViewProps, ViewStyle} from 'react-native';

import {Icons} from '@app/assets/icons';
import {Box, Text, useTheme} from '@app/themes';

interface IconButtonProps extends ViewProps {
  onPress?: () => void;
  onIconPress?: () => void;
  iconName?: string;
  iconSize?: number;
  ButtonStyle?: StyleProp<ViewStyle>;
  LabelStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  label?: string;
  disabled?: boolean;
  leftIcon?: boolean;
  center?: boolean;
  loading?: boolean;
}

export const IconButton = React.memo((props: IconButtonProps) => {
  const {colors, spacing, textVariants} = useTheme();
  const {
    onPress,
    iconName = 'x',
    iconSize = 24,
    ButtonStyle,
    iconColor = colors.black,
    label,
    LabelStyle,
    disabled = false,
    leftIcon = true,
    center = false,
    loading = false,
    onIconPress,
    ...other
  } = props;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          borderRadius: spacing.xl,
          backgroundColor: colors.white,
          padding: spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: loading ? 'center' : undefined,
        },
        ButtonStyle,
      ]}
      {...other}
    >
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <>
          {leftIcon ? (
            <Pressable disabled={!!!onIconPress} onPress={onIconPress}>
              <Icons.Feather name={iconName} color={iconColor} size={iconSize} />
            </Pressable>
          ) : (
            center && <Box style={{width: iconSize + spacing.xs}} />
          )}
          {!!label && (
            <Text
              style={[
                {
                  ...textVariants.button_m_poppins_medium,
                  marginLeft: leftIcon ? spacing.xs : 0,
                  marginRight: leftIcon ? 0 : spacing.xs,
                },
                LabelStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
          {!leftIcon ? (
            <Pressable disabled={!!!onIconPress} onPress={onIconPress}>
              <Icons.Feather name={iconName} color={iconColor} size={iconSize} />
            </Pressable>
          ) : (
            center && <Box style={{width: iconSize + spacing.xs}} />
          )}
        </>
      )}
    </Pressable>
  );
});
