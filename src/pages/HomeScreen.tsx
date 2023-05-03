import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Community from './Community';
import CommunityMain from './CommunityMain';
import Settings from './Settings';
import ImageUpload from './ImageUpload';
import PersonalGallery from './PersonalGallery';
import EditProfile from './EditProfile';
import Home from './Home';
import Notification from './Notification';

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
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen name="PersonalGallery" component={PersonalGallery} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={route => ({
          title: '계정관리',
        })}
      />
    </Stack.Navigator>
  );
}

function HomeScreen() {
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
          if (route.name === 'CommunityStackScreen') {
            iconName = focused
              ? 'md-people-circle'
              : 'md-people-circle-outline';
          } else if (route.name === 'ImageUpload') {
            iconName = focused ? 'ios-image' : 'ios-image-outline';
          } else if (route.name === 'SettingsStackScreen') {
            iconName = focused
              ? 'ios-person-circle'
              : 'ios-person-circle-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'md-notifications'
              : 'md-notifications-outline';
          }

          size = 25;

          return <Ionic name={iconName} size={size} color={color} />;
        },
      })}>
      {/* <Tab.Screen name="Home" component={Home} /> */}
      <Tab.Screen
        name="CommunityStackScreen"
        component={CommunityStackScreen}
      />
      <Tab.Screen name="ImageUpload" component={ImageUpload} />
      {/* <Tab.Screen name="Notification" component={Notification} /> */}
      <Tab.Screen name="SettingsStackScreen" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
