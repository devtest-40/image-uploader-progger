
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Header from '../components/Header';
import UploadImages from '../components/UploadImages';

const Upload = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header title="Upload Images" showBack={true} navigation={navigation} />
      <View style={styles.main}>
        <UploadImages navigation={navigation} />
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

export default Upload;
