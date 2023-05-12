import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import SignUpList from './src/pages/SignUpList';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootState} from './src/store/reducer';
import {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import {useAppDispatch} from './src/store';
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './src/components/DrawerContent';
import HomeScreen from './src/pages/HomeScreen';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SignUpList: undefined;
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppInner({navigation}) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.id);

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
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            desc: response.data.desc,
            nick: response.data.nick,
            accessToken: response.data.accessToken,
            img: response.data.img,
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

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // <Drawer.Navigator
        //   initialRouteName="Home"
        //   screenOptions={{
        //     drawerType: 'front',
        //   }}
        //   // screenOptions={({navigation}) => ({
        //   //   headerLeft: props => (
        //   // <Ionic
        //   //   name={'menu'}
        //   //   size={30}
        //   //   onPresss={navigation.toggleDrawer}
        //   // />
        //   //   ),
        //   // })}
        //   drawerContent={props => <DrawerContent {...props} />}>
        //   <Drawer.Screen name="마이코스모스" component={HomeScreen} />
        // </Drawer.Navigator>
        <HomeScreen />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인', headerShown: false}}
          />
          <Stack.Screen
            name="SignUpList"
            component={SignUpList}
            options={{title: '회원가입'}}
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
