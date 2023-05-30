import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Community from './Community';
import CommunityMain from './CommunityMain';
import MyPage from './MyPage';
import ImageUpload from './ImageUpload';
import PersonalGallery from './PersonalGallery';
import EditProfile from './EditProfile';
import Home from './Home';
import Notification from './Notification';
import {SvgUri} from 'react-native-svg';
import Settings from './Settings';
import ImagePicker from 'react-native-image-crop-picker';
import {SafeAreaView} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CommunityStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Community"
        component={Community}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CommunityMain"
        component={CommunityMain}
        options={route => ({
          title: '커뮤니티',
        })}
      />
    </Stack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{headerShown: false}}
      />
      <Stack.Screen name="PersonalGallery" component={PersonalGallery} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={route => ({
          title: '프로필 편집',
          // headerRight: () => <FinishButton />,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={route => ({
          title: '설정',
        })}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarShowLabel: false,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'CommunityStackScreen') {
            iconName = focused
              ? 'https://maicosmos.com/Mobile/blackcommunity.svg'
              : 'https://maicosmos.com/Mobile/community.svg';
          } else if (route.name === 'ImageUpload') {
            iconName = focused
              ? 'https://maicosmos.com/Mobile/blackupload.svg'
              : 'https://maicosmos.com/Mobile/upload.svg';
          } else if (route.name === 'SettingsStackScreen') {
            iconName = focused
              ? 'https://maicosmos.com/Mobile/blackmypage.svg'
              : 'https://maicosmos.com/Mobile/mypage.svg';
          } else if (route.name === 'Home') {
            iconName = focused
              ? 'https://maicosmos.com/Mobile/blackhome.svg'
              : 'https://maicosmos.com/Mobile/home.svg';
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'https://maicosmos.com/Mobile/blacknotification.svg'
              : 'https://maicosmos.com/Mobile/notification.svg';
          }

          size = 25;

          return <SvgUri width="25" height="25" uri={iconName} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen
        name="CommunityStackScreen"
        component={CommunityStackScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ImageUpload"
        component={ImageUpload}
        options={{title: '게시물'}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();
            //Any custom code here

            ImagePicker.openPicker({
              includeExif: true,
              includeBase64: true,
            }).then(file => {
              if (file.mime.includes('image')) {
                navigation.navigate('ImageUpload', {
                  file: file,
                  type: 'image',
                });
              } else {
                navigation.navigate('ImageUpload', {
                  file: file,
                  type: 'video',
                });
              }
            });
          },
        })}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: '알림',
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: '#fd3040', color: '#fff'},
        }}
      />
      <Tab.Screen
        name="SettingsStackScreen"
        component={SettingsStackScreen}
        options={{title: '마이페이지', headerShown: true}}
      />
    </Tab.Navigator>
  );
}

export default HomeScreen;
