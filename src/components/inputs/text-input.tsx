import React from 'react';

import {
  StyleProp,
  TextInput as TIRN,
  TextInputProps as TIP,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {Icons} from '@app/assets/icons';
import {Box, Text, useTheme} from '@app/themes';

interface TextInputProps extends TIP {
  value?: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  TextInputStyle?: StyleProp<TextStyle>;
  onChangeText?: any;
  placeholder?: string;
  onRightIconPress?: () => void;
  iconLeftName?: string;
  iconRightName?: string;
  error?: string;
  maxLength?: number;
}

export const TextInput = React.memo(
  React.forwardRef<TIRN, TextInputProps>((props, ref) => {
    const {colors, textVariants, spacing, borderRadii} = useTheme();
    const {
      TextInputStyle,
      containerStyle,
      label,
      value,
      placeholderTextColor = colors.grey,
      onChangeText,
      placeholder,
      iconLeftName,
      iconRightName,
      onRightIconPress,
      error,
      maxLength,
      ...other
    } = props;

    return (
      <>
        {!!label && (
          <Box flexDirection="row" alignItems="flex-end" marginBottom="xs">
            <Text
              style={{
                ...textVariants.body_leading_poppins_medium,
                color: colors.black,
                flex: 1,
              }}
            >
              {label}
            </Text>
            {maxLength ? (
              <Text variant={'body_helper_poppins_regular'} color={'grey'}>
                {maxLength ? `${value?.length || 0}/${maxLength}` : ''}
              </Text>
            ) : null}
          </Box>
        )}
        <View
          style={[
            {
              paddingHorizontal: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              height: 56,
              borderRadius: borderRadii.md,
              borderColor: colors.grey_light,
              backgroundColor: colors.white,
            },
            containerStyle,
          ]}
        >
          <View style={{flex: 1, alignItems: 'center', marginHorizontal: spacing.xs, flexDirection: 'row'}}>
            {iconLeftName && (
              <View style={{marginRight: spacing.xs}}>
                <Icons.Feather name={iconLeftName} size={24} color={colors.grey} />
              </View>
            )}
            <View style={{flex: 1}}>
              <TIRN
                ref={ref}
                value={value}
                style={[
                  {
                    ...textVariants.body_leading_poppins_medium,
                    color: colors.black,
                    padding: 0,
                    flex: 1,
                  },
                  TextInputStyle,
                ]}
                placeholderTextColor={placeholderTextColor}
                placeholder={placeholder || label}
                onChangeText={v => {
                  onChangeText?.(v);
                }}
                {...other}
              />
            </View>
            {iconRightName && (
              <TouchableOpacity onPress={onRightIconPress} style={{paddingLeft: spacing.xs, height: '100%'}}>
                <Icons.Feather name={iconRightName} size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {error && (
          <Text variant="body_helper_poppins_regular" color="danger" marginTop="xxs">
            * {error}
          </Text>
        )}
      </>
    );
  }),
);
