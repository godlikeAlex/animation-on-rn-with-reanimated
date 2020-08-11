import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {
  Transitioning,
  TransitioningView,
  Transition
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    fontSize: 25,
    textAlign: 'center'
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10
  }
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={4000} />
    <Transition.Out type="fade" durationMs={400} />
  </Transition.Together>
);

export default () => {
  const [dark, setDark] = useState(true);
  const ref = useRef<TransitioningView>(null);

  return (
    <Transitioning.View style={styles.container} {...{ref, transition}}>
      {dark && (
        <View
          style={{...StyleSheet.absoluteFillObject, backgroundColor: 'black'}}
        />
      )}
      <Button
        onPress={() => {
          if (ref.current) {
            ref.current.animateNextTransition();
          }
          setDark(!dark);
        }}
        title={dark ? 'WHITE' : 'DARK'}
      />
      <Text style={[styles.name, {color: dark ? 'white' : 'black'}]}>
        Aleksandr Yurkovsky
      </Text>
      <Text style={[styles.status, {color: dark ? 'white' : 'black'}]}>
        Frontend Backnd developer 😍
      </Text>
    </Transitioning.View>
  );
};
