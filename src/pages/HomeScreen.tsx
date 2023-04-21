import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Community from './Community';
import Settings from './Settings';
import ImageUpload from './ImageUpload';
import PersonalGallery from './PersonalGallery';
import EditProfile from './EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen name="PersonalGallery" component={PersonalGallery} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
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
          if (route.name === 'Community') {
            iconName = focused ? 'home' : 'home';
            // size = focused ? size + 18 : size + 15;
            return <Foundation name={iconName} size={size} color={color} />;
          } else if (route.name === 'ImageUpload') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            // size = focused ? size + 23 : size + 20;
            return <Ionic name={iconName} size={size} color={color} />;
          } else if (route.name === 'SettingsStackScreen') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            // size = focused ? size + 18 : size + 15;
            return <Ionic name={iconName} size={size} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="ImageUpload" component={ImageUpload} />
      <Tab.Screen name="SettingsStackScreen" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
