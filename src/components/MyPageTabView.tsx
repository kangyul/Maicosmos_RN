import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import MyGallery from './MyGallery';
import MyArtWork from './MyArtWork';

function MyPageTabView(props) {
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
        },
      })}>
      <Tab.Screen
        name="갤러리"
        children={() => <MyGallery galleries={props.galleries} />}
      />
      <Tab.Screen name="작품" component={MyArtWork} />
    </Tab.Navigator>
  );
}

export default MyPageTabView;
