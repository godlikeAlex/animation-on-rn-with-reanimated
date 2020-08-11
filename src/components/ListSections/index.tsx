import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#c7c7c7',
    borderBottomWidth: 1
  },
  itemText: {
    fontSize: 25
  }
});

export default () => {
  const navigation = useNavigation();

  interface ItemProps {
    text: string;
    navigateTo: string;
  }

  const ListItem = ({text, navigateTo}: ItemProps) => (
    <TouchableHighlight
      onPress={() => navigation.navigate(navigateTo)}
      activeOpacity={0.6}
      underlayColor="#DDDDDD">
      <View style={styles.item}>
        <Text style={styles.itemText}>{text}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <ScrollView>
      <ListItem text="⏰ Clocks" navigateTo="Clocks" />
      <ListItem text="💖 Transitions" navigateTo="Transitions" />
      <ListItem text="🐊 UseTransition" navigateTo="UseTransition" />
      <ListItem text="🌚 Dark Mode" navigateTo="DarkMode" />
      <ListItem text="⏳ Timing" navigateTo="Timing" />
      <ListItem text="👆 PanGestures" navigateTo="PanGesture" />
      <ListItem text="🌌 Decay" navigateTo="Decay" />
      <ListItem text="🧪 Spring" navigateTo="Spring" />
      <ListItem text="💫 Swipe" navigateTo="Swipe" />
      <ListItem text="👽 DynamicSpring" navigateTo="DynamicSpring" />
      <ListItem text="🎷 SwipeToDrag" navigateTo="SwipeToDrag" />
      <ListItem text="🐾 PinchGesture First" navigateTo="PinchGesture1" />
      <ListItem text="🐾🥱 PinchGesture Second" navigateTo="PinchGesture2" />
      <ListItem text="😎 Education" navigateTo="Education" />
    </ScrollView>
  );
};
