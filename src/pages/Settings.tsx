import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Text} from 'react-native-paper';

function Settings() {
  const [nick, setNick] = useState('');
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [friendCnt, setFriendCnt] = useState(0);
  const [imageCnt, setImageCnt] = useState(0);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.email);

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
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/userInfo.php',
          {
            userId,
          },
        );

        setNick(response.data.nick);
        setAbout(response.data.profile);
        setProfileImage(response.data.profileImg);
        setGalleryCnt(response.data.galleryCnt);
        setFriendCnt(response.data.friendCnt);
        setImageCnt(response.data.imageCnt);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getUserInfo();
  }, [userId]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image style={styles.userImg} source={{uri: profileImage}} />
        <Text style={styles.userName}>{nick}</Text>
        <Text style={styles.aboutUser}>{about}</Text>
        <View style={styles.userBtnWrapper}>
          <TouchableOpacity style={styles.userBtn}>
            <Text style={styles.userBtnTxt}>정보수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userBtn}>
            <Text style={styles.userBtnTxt}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{galleryCnt}</Text>
            <Text style={styles.userInfoSubTitle}>갤러리 수</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{friendCnt}</Text>
            <Text style={styles.userInfoSubTitle}>친구 수</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{imageCnt}</Text>
            <Text style={styles.userInfoSubTitle}>작품 수</Text>
          </View>
        </View>
        <View style={{alignContent: 'flex-end', marginBottom: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>개인 갤러리</Text>
        </View>
        <View>
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
        </View>
        <View
          style={{alignContent: 'flex-end', marginTop: 20, marginBottom: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>작품</Text>
        </View>
        <View>
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
          <Image
            style={{
              width: '100%',
              height: 210,
              borderRadius: 20,
              marginBottom: 20,
            }}
            source={require('../../assets/image/community_wall_paper.png')}
          />
        </View>
        {/* <Pressable
          style={StyleSheet.compose(
            styles.loginButton,
            styles.loginButtonActive,
          )}
          onPress={onLogout}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'black',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
