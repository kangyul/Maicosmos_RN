import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import Galleries from './Galleries';
import Boards from './Boards';
import Members from './Members';

function BottomTabView(props) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 1.5,
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;
          if (route.name === 'Galleries') {
            iconName = focused ? 'ios-images' : 'ios-images-sharp';
            color = focused ? 'black' : 'gray';
          } else if (route.name === 'Boards') {
            iconName = focused ? 'ios-clipboard' : 'ios-clipboard-outline';
            color = focused ? 'black' : 'gray';
          } else if (route.name === 'Members') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
            color = focused ? 'black' : 'gray';
          }

          return <Ionic name={iconName} color={color} size={22} />;
        },
      })}>
      <Tab.Screen
        name="Galleries"
        children={() => <Galleries galleries={props.galleries} />}
      />
      {/* <Tab.Screen name="Boards" component={Boards} /> */}
      <Tab.Screen
        name="Boards"
        children={() => (
          <Boards boardAN={props.boardAN} boardFR={props.boardFR} />
        )}
      />
      {/* <Tab.Screen name="Members" component={Members} /> */}
      <Tab.Screen
        name="Members"
        children={() => <Members members={props.members} />}
      />
    </Tab.Navigator>
  );
}

export default BottomTabView;
