import React, {useCallback} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';

function Settings() {
  const dispatch = useAppDispatch();

  const onLogout = useCallback(async () => {
    try {
      // await axios.post(
      //   `${Config.API_URL}/logout`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   },
      // );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          id: '',
          name: '',
          desc: '',
          email: '',
          nick: '',
          img: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.signOutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  signOutText: {
    fontSize: 18,
    color: '#d50801',
  },
});

export default Settings;
