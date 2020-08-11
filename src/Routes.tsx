import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ListSections,
  Transitions,
  Clocks,
  UseTransition,
  DarkMode,
  Timing,
  PanGestures,
  Decay,
  Spring,
  Swipe,
  DynamicSpring,
  SwipeToDrag,
  PinchGesture1,
  PinchGesture2,
  Education,
  Svg
} from './components';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Sections" component={ListSections} />
        <Stack.Screen name="Clocks" component={Clocks} />
        <Stack.Screen name="Transitions" component={Transitions} />
        <Stack.Screen name="UseTransition" component={UseTransition} />
        <Stack.Screen name="DarkMode" component={DarkMode} />
        <Stack.Screen name="Timing" component={Timing} />
        <Stack.Screen name="PanGesture" component={PanGestures} />
        <Stack.Screen name="Decay" component={Decay} />
        <Stack.Screen name="Spring" component={Spring} />
        <Stack.Screen name="Swipe" component={Swipe} />
        <Stack.Screen name="DynamicSpring" component={DynamicSpring} />
        <Stack.Screen name="SwipeToDrag" component={SwipeToDrag} />
        <Stack.Screen name="PinchGesture1" component={PinchGesture1} />
        <Stack.Screen name="PinchGesture2" component={PinchGesture2} />
        <Stack.Screen name="Education" component={Education} />
        <Stack.Screen name="Svg" component={Svg} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
