import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  Value,
  multiply,
  useCode,
  cond,
  set,
  eq
} from 'react-native-reanimated';
import {
  vec,
  onGestureEvent,
  pinchBegan,
  pinchActive,
  timing
} from 'react-native-redash';

const {width, height} = Dimensions.get('window');
const CANVAS = vec.create(width, height);
const center = vec.divide(CANVAS, 2);

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover'
  }
});

export default () => {
  const translation = vec.createValue(0, 0);
  const origin = vec.createValue(0, 0);
  const focal = vec.createValue(0, 0);
  const scale = new Value(1);
  const state = new Value(State.UNDETERMINED);
  const numberOfPointers = new Value(1);

  const gestureHandler = onGestureEvent({
    focalX: focal.x,
    focalY: focal.y,
    scale,
    state,
    numberOfPointers
  });
  const adjustedFocal = vec.sub(focal, center);
  useCode(
    () => [
      cond(pinchBegan(state), vec.set(origin, adjustedFocal)),
      cond(pinchActive(state, numberOfPointers), [
        vec.set(translation, vec.sub(adjustedFocal, origin))
      ]),
      cond(eq(state, State.END), [
        set(scale, timing({from: scale, to: 1})),
        set(translation.x, timing({from: translation.x, to: 0})),
        set(translation.y, timing({from: translation.y, to: 0}))
      ])
    ],
    [focal, origin, state]
  );
  return (
    <PinchGestureHandler {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Animated.Image
          style={[
            styles.image,
            {
              transform: [
                {translateX: translation.x},
                {translateY: translation.y},
                {translateX: origin.x},
                {translateY: origin.y},
                {scale},
                {translateX: multiply(-1, origin.x)},
                {translateY: multiply(-1, origin.y)}
              ]
            }
          ]}
          source={require('./assets/background.jpg')}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
};
