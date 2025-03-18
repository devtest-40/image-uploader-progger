
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import ImageGallery from '../components/ImageGallery';
import Header from '../components/Header';

const Index = ({ navigation }) => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header showSelectionToggle={true} />
      <View style={styles.main}>
        <ImageGallery navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  main: {
    flex: 1,
    padding: 16,
  },
});

export default Index;
