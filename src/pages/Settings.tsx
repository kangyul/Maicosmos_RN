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
  Text,
  ActivityIndicator,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

const randomImages = [
  {
    url: 'https://www.maicosmos.com/Thumbs/IMG-634627c0544d67.17083191.jpg',
  },
  {
    url: 'https://www.maicosmos.com/Thumbs/IMG-63465ec90cb3e4.02608400.jpeg',
  },
  {
    url: 'https://www.maicosmos.com/Thumbs/VID-63465ee4a36939.30839018.png',
  },
];

function Settings() {
  const [nick, setNick] = useState('');
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [friendCnt, setFriendCnt] = useState(0);
  const [imageCnt, setImageCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
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
        setGalleries(response.data.gallery);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getUserInfo();
  }, [userId]);

  useEffect(() => {
    const getUserImages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/artworks.php',
          {
            userId,
            offset: currentPage,
          },
        );
        if (response.data.listEnd) {
          setIsListEnd(true);
        }
        setImages([...images, ...response.data.image]);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUserImages();
  }, [userId, currentPage]);

  const renderItem = ({item}) => {
    return (
      <View>
        <Image style={styles.personalGallery} source={{uri: item.url}} />
      </View>
    );
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    if (!isListEnd) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={images}
        ListHeaderComponent={
          <View>
            <Image style={styles.userImg} source={{uri: profileImage}} />
            <Text style={styles.userName}>{nick}</Text>
            <Text style={styles.aboutUser}>{about}</Text>
            <View style={styles.userBtnWrapper}>
              <TouchableOpacity style={styles.userBtn}>
                <Text style={styles.userBtnTxt}>정보수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={onLogout}>
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
            <View style={styles.listTitle}>
              <Text style={styles.listTitleText}>개인 갤러리</Text>
            </View>
            <View style={{paddingHorizontal: 20}}>
              {galleries.map(gallery => (
                <Image
                  key={gallery.key}
                  style={styles.personalGallery}
                  source={{uri: gallery.url}}
                />
              ))}
            </View>
            <View style={styles.listTitle}>
              <Text style={styles.listTitleText}>작품</Text>
            </View>
          </View>
        }
        renderItem={renderItem}
        ListFooterComponent={renderLoader}
        keyExtractor={item => item.key}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 20,
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
  listTitle: {
    alignContent: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listTitleText: {
    fontWeight: 'bold',
    fontSize: 18,
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
  personalGallery: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    marginBottom: 20,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default Settings;
