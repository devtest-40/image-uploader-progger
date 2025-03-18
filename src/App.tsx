
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store/store';

import Index from './screens/Index';
import Edit from './screens/Edit';
import Upload from './screens/Upload';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Index" component={Index} />
            <Stack.Screen name="Edit" component={Edit} />
            <Stack.Screen name="Upload" component={Upload} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
