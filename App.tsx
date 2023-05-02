import * as React from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
