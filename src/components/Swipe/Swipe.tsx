import React from 'react';
import Profiles from './Profiles';
import {Profile} from './Profile';

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Caroline',
    age: 25,
    profile: require('../../../assets/profiles/1.jpg')
  },
  {
    id: '1',
    name: 'Aleks',
    age: 25,
    profile: require('../../../assets/profiles/2.jpg')
  },
  {
    id: '1',
    name: 'Karina',
    age: 25,
    profile: require('../../../assets/profiles/3.jpg')
  },
  {
    id: '1',
    name: 'Andrey',
    age: 25,
    profile: require('../../../assets/profiles/4.jpg')
  }
];

export default () => {
  return <Profiles {...{profiles}} />;
};
