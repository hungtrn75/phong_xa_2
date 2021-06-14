import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginPage from '../screens/auth/login_page';
import Preview from '../screens/auth/preview';
import SignupPage from '../screens/auth/signup_page';
import ImageViewer from '../screens/helpers/image_viewer';
import AddPlaceModal from '../screens/helpers/modal';
import HomePage from '../screens/home/home_page';
import MapPage from '../screens/map/map';
import ProfilePage from '../screens/profile/profile_page';
import SplashScreen from '../screens/splash';
import {Colors} from '../theme';
import {MaterialColors} from '../theme/colors';
import {navigationRef} from './helper';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MyAuthStack = () => {
  return (
    <AuthStack.Navigator initialRouteName="PREVIEW">
      <AuthStack.Screen
        name={'PREVIEW'}
        component={Preview}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'LOGIN'}
        component={LoginPage}
        options={{
          title: 'Đăng nhập',
          headerBackTitle: 'Quay lại',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </AuthStack.Navigator>
  );
};

const MyAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName = 'home';
          const size = 28;
          switch (route.name) {
            case 'MAP':
              return <Icon name={'map'} size={size} color={color} />;
            case 'HOME':
              return <Icon name={'home'} size={size} color={color} />;
            case 'PROFILE':
              return <Icon name={'account'} size={size} color={color} />;
            default:
              return <Icon name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        labelStyle: {
          fontSize: 16,
        },
        activeTintColor: Colors.PRIMARY,
      }}>
      {__DEV__ && (
        <Tab.Screen name={'HOME'} component={HomePage} options={{}} />
      )}
      <Tab.Screen
        name={'MAP'}
        component={MapPage}
        options={{
          tabBarLabel: 'Bản đồ',
        }}
      />
      <Tab.Screen
        name={'PROFILE'}
        component={ProfilePage}
        options={{
          tabBarLabel: 'Tài khoản',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  useEffect(() => {
    Orientation.lockToLandscapeLeft();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle={'light-content'} backgroundColor={'white'} />
      <AppStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
        }}>
        <AppStack.Screen
          name={'Splash'}
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <AppStack.Screen
          name={'TAB'}
          component={MyAppTabs}
          options={{
            headerShown: false,
            headerTitleAlign: 'center',
          }}
        />
        <AppStack.Screen
          name={'IMAGE_VIEWER'}
          component={ImageViewer}
          options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
        />
        <AppStack.Screen
          name={'ADD_PLACE'}
          component={AddPlaceModal}
          options={{
            headerShown: false,
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
            gestureDirection: 'horizontal',
            cardStyleInterpolator: ({current, next, layouts}) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                    {
                      rotate: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                    },
                    {
                      scale: next
                        ? next.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.9],
                          })
                        : 1,
                    },
                  ],
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                },
              };
            },
            gestureEnabled: true,
          }}
        />
        <AppStack.Screen
          name={'AUTH_CONTAINER'}
          component={MyAuthStack}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
        />
        <AuthStack.Screen
          name={'SIGNUP'}
          component={SignupPage}
          options={{
            title: 'Đổi mật khẩu',
            headerBackTitle: 'Quay lại',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const customDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: MaterialColors.white,
  },
};
