import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {
  PinchGestureHandler,
  State,
  PanGestureHandler
} from 'react-native-gesture-handler';
import Animated, {
  Value,
  multiply,
  useCode,
  cond,
  set,
  eq,
  sub,
  max,
  and,
  or,
  call,
  block
} from 'react-native-reanimated';
import {
  vec,
  onGestureEvent,
  pinchBegan,
  pinchActive,
  timing,
  translate,
  clamp
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
  const gestureScale = new Value(1);
  const state = new Value(State.END);
  const numberOfPointers = new Value(1);

  const gestureHandler = onGestureEvent({
    focalX: focal.x,
    focalY: focal.y,
    scale: gestureScale,
    state,
    numberOfPointers
  });

  const scaleOffset = new Value(1);
  const offset = vec.createValue(0, 0);
  const adjustedFocal = vec.sub(focal, center);
  const scale = new Value(1);
  const minVec = vec.min(vec.multiply(-0.5, CANVAS, sub(scale, 1)), 0);
  const maxVec = vec.max(vec.minus(minVec), 0);
  const pan = vec.createValue(0);
  const panState = new Value(State.END);
  const panGestureHandler = onGestureEvent({
    translationX: pan.x,
    translationY: pan.y,
    state: panState
  });

  useCode(
    () =>
      block([
        cond(eq(panState, State.ACTIVE), vec.set(translation, pan)),
        cond(pinchBegan(state), vec.set(origin, adjustedFocal)),
        cond(pinchActive(state, numberOfPointers), [
          vec.set(
            translation,
            vec.add(
              vec.sub(adjustedFocal, origin),
              origin,
              vec.multiply(-1, gestureScale, origin)
            )
          )
        ]),
        cond(or(eq(state, State.END), eq(panState, State.END)), [
          set(scaleOffset, multiply(scaleOffset, gestureScale)),
          vec.set(offset, vec.add(offset, translation)),
          set(gestureScale, 1),
          vec.set(focal, 0),
          vec.set(translation, 0),
          set(
            scaleOffset,
            timing({from: scaleOffset, to: max(scaleOffset, 1)})
          ),
          set(
            offset.x,
            timing({from: offset.x, to: clamp(offset.x, minVec.x, maxVec.x)})
          ),
          set(
            offset.y,
            timing({from: offset.y, to: clamp(offset.y, minVec.x, maxVec.y)})
          )
        ]),
        set(scale, multiply(gestureScale, scaleOffset))
      ]),
    []
  );
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <PinchGestureHandler {...gestureHandler} minPointers={2} maxPointers={2}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <PanGestureHandler
            minPointers={1}
            maxPointers={1}
            {...panGestureHandler}>
            <Animated.View style={StyleSheet.absoluteFill}>
              <Animated.Image
                style={[
                  styles.image,
                  {
                    transform: [
                      ...translate(vec.add(offset, translation)),
                      {scale}
                    ]
                  }
                ]}
                source={require('./assets/background.jpg')}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};
