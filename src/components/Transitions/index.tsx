import React, {useState, useRef} from 'react';
import {StyleSheet, ViewStyle, ImageStyle, Dimensions} from 'react-native';
import {cards, FlexibleCard as Card} from '../Сard';
import StyleGuide from '../Сard/StyleGuide';
import Selection from '../Selection/Selection';
import {
  Transitioning,
  Transition,
  TransitioningView
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface Layout {
  id: string;
  name: string;
  layout: {
    container: ViewStyle;
    child?: ImageStyle;
  };
}

const column: Layout = {
  id: 'column',
  name: 'Column',
  layout: {
    container: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  }
};

const row: Layout = {
  id: 'row',
  name: 'Row',
  layout: {
    container: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }
};

const wrap: Layout = {
  id: 'wrap',
  name: 'Wrap',
  layout: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    child: {
      flex: 0,
      width: width / 2 - StyleGuide.spacing * 2
    }
  }
};

const layouts = [column, row, wrap];
const transition = (
  <Transition.Change durationMs={400} interpolation="easeInOut" />
);

export default () => {
  const [currentLayout, setCurrentLayout] = useState(layouts[0].layout);
  const ref = useRef<TransitioningView>(null);
  return (
    <>
      <Transitioning.View
        style={[styles.container, currentLayout.container]}
        {...{ref, transition}}>
        {cards.map((card) => (
          <Card key={card.id} style={currentLayout.child} {...{card}} />
        ))}
      </Transitioning.View>
      {layouts.map((layout) => (
        <Selection
          key={layout.id}
          name={layout.name}
          isSelected={layout.layout === currentLayout}
          onPress={() => {
            if (ref.current) {
              ref.current.animateNextTransition();
            }
            setCurrentLayout(layout.layout);
          }}
        />
      ))}
    </>
  );
};
