/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import Screen from './src/main/index';

// 하단 노란 박스 안나오게 하기
console.disableYellowBox = true;

const App: () => React$Node = () => {
  return (
    <Screen />
  );
};

export default App;
