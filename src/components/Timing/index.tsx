import React, {useState} from 'react';
import {View, StyleSheet, Easing, Button} from 'react-native';
import ActivityIndecator from './ActivityIndecator';
import Animated, {
  Value,
  Clock,
  useCode,
  set,
  block,
  timing,
  cond,
  clockRunning,
  startClock,
  not,
  eq,
  and,
  stopClock
} from 'react-native-reanimated';
import {useMemoOne} from 'use-memo-one';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});

const runTiming = (clock: Animated.Clock) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0)
  };

  const config = {
    toValue: new Value(1),
    duration: 1000,
    easing: Easing.linear
  };

  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, cond(eq(state.position, 1), 0, 1))
    ]),
    state.position
  ]);
};

export default () => {
  const [playing, setPlaying] = useState(false);
  const {progress, clock, isPlaying} = useMemoOne(
    () => ({
      progress: new Value(0),
      clock: new Clock(),
      isPlaying: new Value(0) as Animated.Value<number>
    }),
    []
  );
  isPlaying.setValue(playing ? 1 : 0);
  useCode(
    () =>
      block([
        cond(and(eq(isPlaying, 0), clockRunning(clock)), stopClock(clock)),
        cond(
          and(eq(isPlaying, 1), not(clockRunning(clock))),
          startClock(clock)
        ),
        set(progress, runTiming(clock))
      ]),
    []
  );
  return (
    <View style={styles.container}>
      <ActivityIndecator {...{progress}} />
      <Button
        onPress={() => setPlaying(!playing)}
        title={playing ? 'Pause' : 'Play'}
      />
    </View>
  );
};
