import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {interpolate, Extrapolate} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#c9d4ff',
    width: width - 50,
    height: 300,
    borderTopRightRadius: 300,
    borderTopLeftRadius: 300,
    borderBottomLeftRadius: 300,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#5073f9'
  }
});

interface ActivityIndecatorProps {
  progress: Animated.Value<number>;
}

const ActivityIndecator = ({progress}: ActivityIndecatorProps) => {
  const bubbles = [0, 1, 2];
  const delta = 1 / bubbles.length;

  return (
    <View style={styles.root}>
      {bubbles.map((i) => {
        const start = i * delta;
        const end = start + delta;
        const scale = interpolate(progress, {
          inputRange: [start, end],
          outputRange: [1, 1.5],
          extrapolate: Extrapolate.CLAMP
        });
        return (
          <Animated.View
            key={i}
            style={[styles.bubble, {transform: [{scale}]}]}
          />
        );
      })}
    </View>
  );
};

export default ActivityIndecator;
