import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import ImageUpload from './src/pages/ImageUpload';
import Community from './src/pages/Community';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootState} from './src/store/reducer';
import {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import {useAppDispatch} from './src/store';
import SplashScreen from 'react-native-splash-screen';
import Ionic from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './src/components/DrawerContent';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  // const insets = useSafeAreaInsets();

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          SplashScreen.hide();
          return;
        }
        const response = await axios.post(
          'https://maicosmos.com/RN/refreshToken.php',
          {
            token,
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.name,
            email: response.data.email,
            accessToken: response.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  const HomeScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
          },
          tabBarIcon: ({focused, size, color}) => {
            let iconName;
            if (route.name === 'Community') {
              iconName = focused ? 'home' : 'home';
              // size = focused ? size + 18 : size + 15;
              return <Foundation name={iconName} size={size} color={color} />;
            } else if (route.name === 'ImageUpload') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              // size = focused ? size + 23 : size + 20;
              return <Ionic name={iconName} size={size} color={color} />;
            } else if (route.name === 'Settings') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              // size = focused ? size + 18 : size + 15;
              return <Ionic name={iconName} size={size} color={color} />;
            }
          },
        })}>
        <Tab.Screen name="Community" component={Community} />
        <Tab.Screen name="ImageUpload" component={ImageUpload} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="마이코스모스" component={HomeScreen} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인', headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
