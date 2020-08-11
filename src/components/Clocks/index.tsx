import React, {useState} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import Animated, {
  Value,
  add,
  interpolate,
  Extrapolate,
  useCode,
  cond,
  eq,
  startClock,
  set,
  not,
} from 'react-native-reanimated';
import {useClock, useValues} from 'react-native-redash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    width: 300,
    height: 200,
    backgroundColor: 'purple',
    borderRadius: 10,
  },
});

const duration = 1000;

const runAnimation = (
  startAnimation: Animated.Value<number>,
  clock: Animated.Clock,
  from: Animated.Value<number>,
  to: Animated.Value<number>,
  startTime: Animated.Value<number>,
  opacity: Animated.Node<number>,
) =>
  cond(eq(startAnimation, 1), [
    startClock(clock),
    set(from, opacity),
    set(to, not(to)),
    set(startTime, clock),
    set(startAnimation, 0),
  ]);

export default () => {
  const [show, setShow] = useState(true);
  const clock = useClock();
  const [startTime, from, to] = useValues(0, 0, 0);
  const startAnimation = new Value(1);
  const endTime = add(startTime, duration);
  const opacity = interpolate(clock, {
    inputRange: [startTime, endTime],
    outputRange: [from, to],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(
    () => runAnimation(startAnimation, clock, from, to, startTime, opacity),
    [clock, from, opacity, startAnimation, startTime, to],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.block, {opacity}]} />
      <Button
        onPress={() => setShow((prev) => !prev)}
        title={show ? 'Hide' : 'Show'}
      />
    </View>
  );
};
