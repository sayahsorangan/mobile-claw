import React, {useEffect, useRef, useState} from 'react';

import {Animated} from 'react-native';

import LottieView from 'lottie-react-native';

import {Lotties} from '@app/assets/animations';
import {SCREEN_WIDTH} from '@app/constan/dimensions';
import {Box, Text} from '@app/themes';

interface MascotTextProps {
  text?: string;
  lottieAnimation?: string;
  streamText?: boolean;
}

export const MascotText = React.memo((props: MascotTextProps) => {
  const mascotTranslateY = useRef(new Animated.Value(0)).current;
  const [displayedText, setDisplayedText] = useState(() => (props.streamText ? '' : props.text ?? ''));

  useEffect(() => {
    if (!props.streamText) {
      setDisplayedText(props.text ?? '');
      return;
    }
    setDisplayedText('');
    const full = props.text ?? '';
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(full.slice(0, index));
      if (index >= full.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [props.text, props.streamText]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotTranslateY, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(mascotTranslateY, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [mascotTranslateY]);

  return (
    <Box justifyContent={'center'} alignItems={'center'} flex={1} paddingVertical={'lg'}>
      <Animated.View
        style={{transform: [{translateY: mascotTranslateY}], justifyContent: 'center', alignItems: 'center'}}
      >
        <Box padding="lg" backgroundColor={'primary'} borderRadius={'lg'} marginHorizontal={'md'} marginBottom={'md'}>
          <Text variant={'h_6_poppins_bold'} color={'white'} textAlign={'center'}>
            {displayedText}
          </Text>
          <Box
            position={'absolute'}
            width={16}
            height={16}
            backgroundColor={'primary'}
            alignSelf={'center'}
            bottom={-4}
            transform={[{rotate: '45deg'}]}
          />
        </Box>
        <LottieView
          autoPlay
          loop
          resizeMode="contain"
          source={props.lottieAnimation ?? Lotties.main_mascot}
          style={{width: SCREEN_WIDTH * 0.5, height: SCREEN_WIDTH * 0.5}}
        />
      </Animated.View>
    </Box>
  );
});
