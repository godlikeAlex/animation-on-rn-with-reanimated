import React from 'react';
import Animated, {
  Clock,
  add,
  Value,
  cond,
  set,
  eq,
  max,
  floor,
  divide,
  block,
  useCode,
  multiply,
  startClock,
  spring,
  diff,
  lessThan,
  greaterThan
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';
import Card, {CardProps, CARD_HEIGHT as INNER_CARD_HEIGHT} from '../Сard';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {panGestureHandler} from 'react-native-redash';
export const CARD_HEIGHT = INNER_CARD_HEIGHT + 32;

const {width} = Dimensions.get('window');

const moving = (value: Animated.Node<number>) => {
  const frames = new Value(0);
  const delta = diff(value);

  return cond(
    lessThan(delta, 0.01),
    [set(frames, add(frames, 1)), lessThan(frames, 5)],
    [set(frames, 1), 1]
  );
};

const withTransition = (
  value: Animated.Node<number>,
  velocity: Animated.Adaptable<number>,
  gestureState: Animated.Value<State>
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    toValue: new Value(0)
  };

  return block([
    startClock(clock),
    set(config.toValue, value),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.position, value), set(state.velocity, velocity)],
      spring(clock, state, config)
    ),
    state.position
  ]);
};

const withSafeOffsset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>,
  offset: Animated.Adaptable<number>
) => {
  const safeOffset = new Value(0);

  return cond(eq(state, State.ACTIVE), add(safeOffset, value), [
    set(safeOffset, offset),
    safeOffset
  ]);
};

interface SortableCard extends CardProps {
  offsets: Animated.Value<number>[];
  index: number;
}

export default ({card, offsets, index}: SortableCard) => {
  const {gestureHandler, translation, velocity, state} = panGestureHandler();

  const x = withSafeOffsset(translation.x, state, 0);
  const y = withSafeOffsset(translation.y, state, offsets[index]);
  const currentOffset = multiply(
    max(floor(divide(y, CARD_HEIGHT)), 0),
    CARD_HEIGHT
  );

  useCode(
    () =>
      block(
        offsets.map((offset) =>
          cond(eq(offset, currentOffset), [
            set(offset, offsets[index]),
            set(offsets[index], currentOffset)
          ])
        )
      ),
    []
  );

  const translateX = withTransition(x, velocity.x, state);
  const translateY = withTransition(y, velocity.y, state);
  const zIndex = cond(
    eq(state, State.ACTIVE),
    200,
    cond(moving(translateY), 100, 1)
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          zIndex,
          height: CARD_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{translateX}, {translateY}]
        }}>
        <Card {...{card}} />
      </Animated.View>
    </PanGestureHandler>
  );
};
