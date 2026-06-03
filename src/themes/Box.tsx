import React from 'react';

import {StyleProp, ViewStyle} from 'react-native';

import {createBox} from '@shopify/restyle';

import {Theme} from './Theme';

const RestyleBox = createBox<Theme>();

export const Box = React.forwardRef<
  React.ElementRef<typeof RestyleBox>,
  React.ComponentProps<typeof RestyleBox> & {
    transform?: ViewStyle['transform'];
    style?: StyleProp<ViewStyle>;
  }
>(({transform, style, ...props}, ref) => {
  const mergedStyle: StyleProp<ViewStyle> = transform ? [style, {transform}] : style;

  return <RestyleBox ref={ref} {...props} style={mergedStyle} />;
});

Box.displayName = 'Box';
