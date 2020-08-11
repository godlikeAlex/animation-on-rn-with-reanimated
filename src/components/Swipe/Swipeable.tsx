import React from 'react';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  Value,
  useCode,
  Clock,
  block,
  set,
  cond,
  eq,
  and,
  not,
  clockRunning,
  startClock,
  spring,
  add,
  stopClock,
  neq,
  multiply,
  abs,
  sub,
  call
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {onGestureEvent, min} from 'react-native-redash';

const snapPoint = (
  snapPoints: number[],
  value: Animated.Adaptable<number>,
  velocity: Animated.Adaptable<number>
) => {
  const point = add(value, multiply(velocity, 0.2));
  const deltas = snapPoints.map((p) => abs(sub(point, p)));
  const minDelta = min(...deltas);
  return snapPoints.reduce((acc, p) =>
    cond(eq(abs(sub(point, p)), minDelta), p, acc)
  );
};

interface withSrpingProps {
  value: Animated.Value<number>;
  state: Animated.Value<State>;
  velocity: Animated.Value<number>;
  snapPoints: number[];
  offset?: Animated.Value<number>;
  onSnap?: (args: readonly number[]) => void;
}

const withSpring = (props: withSrpingProps) => {
  const {value, velocity, state, offset, config, snapPoints, onSnap} = {
    offset: new Value(0),
    config: {
      damping: 20,
      mass: 1,
      stiffness: 150,
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      toValue: new Value(0)
    },
    ...props
  };

  const clock = new Clock();
  const springState = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0)
  };

  const areGestureAnimationFinished = new Value(1);
  const finishDecay = [set(offset, springState.position), stopClock(clock)];

  return block([
    cond(eq(state, State.BEGAN), finishDecay),
    cond(areGestureAnimationFinished, set(springState.position, offset)),
    cond(neq(state, State.END), [
      set(areGestureAnimationFinished, 0),
      set(springState.finished, 0),
      set(springState.position, add(offset, value))
    ]),
    cond(and(eq(state, State.END), not(areGestureAnimationFinished)), [
      cond(and(not(clockRunning(clock)), not(springState.finished)), [
        set(springState.velocity, velocity),
        set(springState.time, 0),
        set(config.toValue, snapPoint(snapPoints, value, velocity)),
        startClock(clock)
      ]),
      spring(clock, springState, config),
      cond(springState.finished, [
        onSnap && call([springState.position], onSnap),
        set(areGestureAnimationFinished, 1),
        ...finishDecay
      ])
    ]),
    springState.position
  ]);
};

interface SwipeableProps {
  translateX: Animated.Value<number>;
  translateY: Animated.Value<number>;
  snapPoints: number[];
  offsetX: Animated.Value<number>;
  onSnap?: (args: readonly number[]) => void;
}

export default ({
  translateX,
  translateY,
  snapPoints,
  onSnap,
  offsetX
}: SwipeableProps) => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);

  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    velocityX,
    velocityY,
    state
  });

  const x = withSpring({
    value: translationX,
    velocity: velocityX,
    state,
    snapPoints,
    offset: offsetX,
    onSnap
  });

  const y = withSpring({
    value: translationY,
    velocity: velocityY,
    state,
    snapPoints: [0]
  });

  useCode(() => block([set(translateX, x), set(translateY, y)]), []);

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill} />
    </PanGestureHandler>
  );
};
