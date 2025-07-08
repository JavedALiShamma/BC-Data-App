import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const FancyLoader = () => (
  <View style={styles.container}>
    <LottieView
      source={require('../assets/loader.json')}
      autoPlay
      loop
      style={styles.lottie}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

export default FancyLoader;