/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Suspense} from 'react';
import {KeyboardAvoidingView, View, StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigator/app_navigator';
import store from './src/redux';
import InternetListener from './src/widgets/base/internet_listener';
import Process from './src/widgets/base/process';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <Suspense fallback={<View />}>
          <InternetListener />
          <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            <AppNavigator />
          </KeyboardAvoidingView>
          <FlashMessage position="top" />
          <Process />
        </Suspense>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
