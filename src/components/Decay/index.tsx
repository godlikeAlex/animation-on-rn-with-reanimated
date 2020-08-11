import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Card, {cards, CARD_WIDTH, CARD_HEIGHT} from '../Сard';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  Value,
  cond,
  set,
  add,
  eq,
  Clock,
  stopClock,
  block,
  and,
  not,
  clockRunning,
  startClock,
  decay
} from 'react-native-reanimated';
import {onGestureEvent, diffClamp} from 'react-native-redash';

const {width, height} = Dimensions.get('window');

const continerWidth = width;
const continerHeight = height - 80;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const [card] = cards;

const withDecay = (
  value: Animated.Value<number>,
  gestureState: Animated.Value<State>,
  offset: Animated.Value<number>,
  velocity: Animated.Value<number>
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    deceleration: 0.988
  };
  const finishDecay = [set(offset, state.position), stopClock(clock)];

  return block([
    cond(eq(gestureState, State.BEGAN), finishDecay),
    cond(
      eq(gestureState, State.END),
      [
        cond(and(not(clockRunning(clock)), not(state.finished)), [
          set(state.time, 0),
          startClock(clock)
        ]),
        decay(clock, state, config),
        cond(state.finished, finishDecay)
      ],
      [set(state.finished, 0), set(state.position, add(offset, value))]
    ),
    state.position
  ]);
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const offsetX = new Value((continerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((continerHeight - CARD_HEIGHT) / 2);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  });
  const translateX = diffClamp(
    withDecay(translationX, state, offsetX, velocityX),
    0,
    continerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    withDecay(translationY, state, offsetY, velocityY),
    0,
    continerHeight - CARD_HEIGHT
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={{transform: [{translateX}, {translateY}]}}>
          <Card {...{card}} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
