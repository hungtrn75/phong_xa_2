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
import {KeyboardAvoidingView, View, StatusBar, AppState} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigator/app_navigator';
import store from './src/redux';
import InternetListener from './src/widgets/base/internet_listener';
import Process from './src/widgets/base/process';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {useEffect} from 'react';
import CBLocation from './src/utils/CBLocation';
import colors from './src/theme/colors';

const App = () => {
  useEffect(() => {
    CBLocation.startUpdatingLocation();
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      CBLocation.stopUpdatingLocation();
    };
  }, []);

  const handleAppStateChange = state => {
    if (state.match(/inactive|background/)) {
      CBLocation.stopUpdatingLocation();
    } else {
      CBLocation.startUpdatingLocation();
    }
  };
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.PRIMARY} />
      <ActionSheetProvider>
        <Provider store={store}>
          <Suspense fallback={<View />}>
            <InternetListener />
            <AppNavigator />
            <FlashMessage position="top" />
            <Process />
          </Suspense>
        </Provider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
};

export default App;
