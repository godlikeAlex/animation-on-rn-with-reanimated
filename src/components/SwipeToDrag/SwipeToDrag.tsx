import React from 'react';
import {View} from 'react-native';
import {cards, CARD_WIDTH} from '../Сard';
import SortableCard, {CARD_HEIGHT} from './SortableCard';
import {Value} from 'react-native-reanimated';

export default () => {
  const offsets = cards.map((_, index) => new Value(CARD_HEIGHT * index));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      {cards.map((card, index) => (
        <SortableCard key={card.id} {...{card, index, offsets}} />
      ))}
    </View>
  );
};
