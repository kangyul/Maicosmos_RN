import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Galleries from './Galleries';
import Boards from './Boards';
import Members from './Members';

function BottomTabView(props) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 1,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen
        name="갤러리"
        children={() => <Galleries galleries={props.galleries} />}
      />
      {/* <Tab.Screen name="Boards" component={Boards} /> */}
      <Tab.Screen
        name="게시판"
        children={() => (
          <Boards boardAN={props.boardAN} boardFR={props.boardFR} />
        )}
      />
      {/* <Tab.Screen name="Members" component={Members} /> */}
      <Tab.Screen
        name="구성원"
        children={() => <Members members={props.members} />}
      />
    </Tab.Navigator>
  );
}

export default BottomTabView;
