import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import StyleGuide from '../StyleGuide';

export const CHECK_ICON_SIZE = 35;
const styles = StyleSheet.create({
  container: {
    width: CHECK_ICON_SIZE,
    height: CHECK_ICON_SIZE,
    borderRadius: CHECK_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: StyleGuide.palette.primary,
  },
});

export default () => {
  return (
    <View style={styles.container}>
      <Text>👌</Text>
    </View>
  );
};
