import React, {useState} from 'react';
import Card, {cards} from '../Сard';
import Animated, {multiply, interpolate} from 'react-native-reanimated';
import {View, StyleSheet, Button, Dimensions} from 'react-native';
import StyleGuide from '../StyleGuide';
import {useTransition} from 'react-native-redash';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const transformOrigin = -1 * (width / 2 - StyleGuide.spacing * 2);

export default () => {
  const [toogled, setToogled] = useState<0 | 1>(0);
  const transition = useTransition(toogled);
  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        let direction = interpolate(index, {
          inputRange: [0, 1, 2],
          outputRange: [-1, 0, 1],
        });

        const rotate = multiply(
          direction,
          interpolate(transition, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI / 6],
          }),
        );
        return (
          <Animated.View
            key={card.id}
            style={[
              styles.overlay,
              {
                transform: [
                  {translateX: transformOrigin},
                  {rotate: rotate},
                  {translateX: -transformOrigin},
                ],
              },
            ]}>
            <Card {...{card}} />
          </Animated.View>
        );
      })}
      <Button
        title={toogled ? 'Hide' : 'Show'}
        onPress={() => setToogled(toogled ? 0 : 1)}
      />
    </View>
  );
};
