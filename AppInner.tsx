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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';

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

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

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
        console.log(response.data.name);
        console.log(response.data.email);
        console.log(response.data.accessToken);
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
        console.log('finally completed');
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          tabBarOptions={{
            showLabel: false,
          }}>
          <Tab.Screen
            name="Community"
            component={Community}
            options={{
              title: '커뮤니티',
              tabBarIcon: () => <Fontisto name="world-o" size={25} />,
            }}
          />
          <Tab.Screen
            name="ImageUpload"
            component={ImageUpload}
            options={{
              title: '이지/동영상 업로드',
              tabBarIcon: () => <Octicons name="plus-circle" size={30} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              title: '내 정보',
              tabBarIcon: () => <FontAwesome name="user-circle-o" size={25} />,
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '마이코스모스 회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
