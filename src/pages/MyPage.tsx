import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useFocusEffect} from '@react-navigation/native';
import SettingIcon from 'react-native-vector-icons/Feather';
import MyPageTabView from '../components/MyPageTabView';

function MyPage({navigation: {navigate}}) {
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [friendCnt, setFriendCnt] = useState(0);
  const [imageCnt, setImageCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [albums, setAlbums] = useState([]);

  const userId = useSelector((state: RootState) => state.user.id);
  const nick = useSelector((state: RootState) => state.user.nick);
  const profileImage = useSelector((state: RootState) => state.user.img);
  const about = useSelector((state: RootState) => state.user.desc);

  useLayoutEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/userInfo.php',
          {
            userId,
          },
        );

        setGalleryCnt(response.data.galleryCnt);
        setFriendCnt(response.data.friendCnt);
        setImageCnt(response.data.imageCnt);
        setGalleries(response.data.gallery);
        setAlbums(response.data.album);
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
      <View>
        <TouchableOpacity
          onPress={() => navigate('Settings')}
          style={{position: 'absolute', right: 20, top: 10}}>
          <SettingIcon size={22} name="settings" />
        </TouchableOpacity>
        <Image style={styles.userImg} source={{uri: profileImage}} />
        <Text style={styles.userName}>{nick}</Text>
        <Text style={styles.aboutUser}>{about}</Text>
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{friendCnt}</Text>
            <Text style={styles.userInfoSubTitle}>친구</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{galleryCnt}</Text>
            <Text style={styles.userInfoSubTitle}>갤러리</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{imageCnt}</Text>
            <Text style={styles.userInfoSubTitle}>작품</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigate('EditProfile', {
              userId: userId,
              profImg: profileImage,
            })
          }>
          <Text style={styles.editBtnText}>프로필 편집</Text>
        </TouchableOpacity>
      </View>
      <MyPageTabView galleries={galleries} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userImg: {
    height: 90,
    width: 90,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 50,
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
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  editBtn: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
  editBtnText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MyPage;
