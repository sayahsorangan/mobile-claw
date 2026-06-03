import React, {Fragment, useEffect, useRef, useState} from 'react';

import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StatusBarProps,
  View,
  ViewProps,
} from 'react-native';

import {Images} from '@app/assets/images';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@app/constan/dimensions';
import {Text, useTheme} from '@app/themes';

import {EmptyData} from './empty-data';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0;

interface ContainerProps extends OwnStatusBarProps {
  children: React.ReactNode;
  backgroundColor?: string;
  loading?: boolean;
  containerProps?: ViewProps;
  is_empty?: boolean;
  loading_text?: string;
  withBackgroundImage?: boolean;
}

export const Container = React.memo((props: ContainerProps) => {
  const {colors, spacing} = useTheme();
  const {
    children,
    backgroundColor = colors.white,
    translucent = false,
    loading = false,
    containerProps,
    is_empty = false,
    loading_text,
    withBackgroundImage = false,
    ...other
  } = props;

  const [isLoading, setIsLoading] = useState(loading);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{flex: 1}} {...containerProps}>
      {withBackgroundImage && (
        <Animated.View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT + STATUSBAR_HEIGHT,
            zIndex: -1,
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: fadeAnim,
          }}
        >
          <ImageBackground
            source={Images.background}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT + STATUSBAR_HEIGHT,
            }}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
        </Animated.View>
      )}
      <MyStatusBar backgroundColor={withBackgroundImage ? undefined : backgroundColor} {...{translucent}} {...other} />
      <View style={{flex: 1, backgroundColor: withBackgroundImage ? undefined : backgroundColor, overflow: 'hidden'}}>
        {isLoading ? null : is_empty ? <EmptyData /> : children}
      </View>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: '100%',
            justifyContent: 'center',
            left: 0,
            zIndex: 10000,
          }}
        >
          <View style={{backgroundColor: colors.black, flex: 1, opacity: 0.1}} />
          <View
            style={{
              position: 'absolute',
              aspectRatio: 1,
              padding: spacing.lg,
              borderRadius: 8,
              backgroundColor: colors.white,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />

            {!!loading_text && (
              <Text color={'info'} variant={'body_poppins_regular'} mt={'md'}>
                {loading_text}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
});

interface OwnStatusBarProps extends StatusBarProps {
  safeArea?: boolean;
}

const MyStatusBar = React.memo(
  ({backgroundColor, safeArea = true, translucent = false, ...other}: OwnStatusBarProps) => {
    const Wrapper = safeArea ? SafeAreaView : Fragment;
    return (
      <View style={{backgroundColor, height: translucent ? 0 : STATUSBAR_HEIGHT}}>
        <Wrapper>
          <StatusBar animated={true} translucent backgroundColor="transparent" {...other} />
        </Wrapper>
      </View>
    );
  },
);
