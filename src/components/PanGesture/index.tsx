import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Card, {cards, CARD_WIDTH, CARD_HEIGHT} from '../Сard';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {Value, cond, set, add, eq} from 'react-native-reanimated';
import {onGestureEvent, diffClamp} from 'react-native-redash';

const {width, height} = Dimensions.get('window');

const containerWidth = width;
const containerHeight = height - 80;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const withOffset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>,
  offset: Animated.Value<number>
) => {
  return cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    add(offset, value)
  );
};

const [card] = cards;

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);

  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);

  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    state
  });

  const translateX = diffClamp(
    withOffset(translationX, state, offsetX),
    0,
    containerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    withOffset(translationY, state, offsetY),
    0,
    containerHeight - CARD_HEIGHT
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
