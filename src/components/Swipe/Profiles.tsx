import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import Animated, {
  Value,
  useCode,
  block,
  cond,
  eq,
  not,
  clockRunning,
  call,
  set,
  Clock,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import {timing} from '../AnimationHelpers';
import Card, {Profile} from './Profile';
import Swipeable from './Swipeable';
import {useMemoOne} from 'use-memo-one';

const {width, height} = Dimensions.get('window');
const deltaX = width / 2;
const a = Math.PI / 12;
const A = Math.round(width * Math.cos(a) + height * Math.sin(a));
const snapPoints = [-A, 0, A];

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    marginHorizontal: 16,
    zIndex: 100
  },
  container: {
    flex: 1,
    paddingVertical: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 50
  },
  smileSize: {
    fontSize: 50
  }
});

interface ProfileProps {
  profiles: Profile[];
}

export default ({profiles}: ProfileProps) => {
  const [index, setIndex] = useState(0);
  const profile = profiles[index];
  const {clock, translateX, translateY, offsetX, like, disLike} = useMemoOne(
    () => ({
      clock: new Clock(),
      translateX: new Value(0),
      translateY: new Value(0),
      offsetX: new Value(0),
      like: new Value(0),
      disLike: new Value(0)
    }),
    []
  );
  const onSnap = ([x]: readonly number[]) => {
    if (x !== 0) {
      setIndex((prevIndex) => (prevIndex + 1) % profiles.length);
      offsetX.setValue(0);
    }
  };
  const rotateZ = interpolate(translateX, {
    inputRange: [-A, 0, A],
    outputRange: [-Math.PI / 12, 0, Math.PI / 12],
    extrapolate: Extrapolate.CLAMP
  });
  const likeOpacity = interpolate(translateX, {
    inputRange: [0, width / 2],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP
  });
  const nopeOpacity = interpolate(translateX, {
    inputRange: [-width / 2, 0],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  useCode(
    () =>
      block([
        cond(eq(like, 1), [
          set(
            offsetX,
            timing({clock, from: 0, to: snapPoints[2], duration: 200})
          ),
          cond(not(clockRunning(clock)), [
            call([translateX], onSnap),
            set(like, 0)
          ])
        ]),
        cond(eq(disLike, 1), [
          set(
            offsetX,
            timing({clock, from: 0, to: snapPoints[0], duration: 200})
          ),
          cond(not(clockRunning(clock)), [
            call([translateX], onSnap),
            set(disLike, 0)
          ])
        ])
      ]),
    [onSnap]
  );

  return (
    <View style={styles.container}>
      <View style={styles.cards}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{translateX}, {translateY}, {rotateZ}]
          }}>
          <Card {...{profile, likeOpacity, nopeOpacity}} />
          <Swipeable
            {...{translateX, translateY, snapPoints, onSnap, offsetX}}
          />
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <TouchableWithoutFeedback onPress={() => disLike.setValue(1)}>
          <Text style={styles.smileSize}>👎</Text>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => like.setValue(1)}>
          <Text style={styles.smileSize}>💙</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
