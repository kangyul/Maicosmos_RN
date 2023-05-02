import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Swiper from 'react-native-swiper';

const numColumns = 3;

const formatData = (data, numColumns) => {
  let numberOfElementsLastRow = data.length % 3;
  let cnt = 0;
  while (
    numberOfElementsLastRow !== 0 &&
    numberOfElementsLastRow !== numColumns
  ) {
    data.push({
      key: 'blank',
      empty: true,
    });
    numberOfElementsLastRow++;
    cnt += 1;
  }

  console.log('추가 개수: ' + cnt);

  return data;
};

function Settings({navigation: {navigate}}) {
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [friendCnt, setFriendCnt] = useState(0);
  const [imageCnt, setImageCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const nick = useSelector((state: RootState) => state.user.nick);
  const profileImage = useSelector((state: RootState) => state.user.img);
  const about = useSelector((state: RootState) => state.user.desc);

  const [activeTagIndex, setActiveTagIndex] = useState('0');

  const _renderItem = ({item}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === item.key && styles.activeTag]}
        onPress={() => setActiveTagIndex(item.key)}>
        <Text style={styles.tagText}>{item.albumname}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
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

  useEffect(() => {
    const getUserImages = async () => {
      if (isListEnd) {
        return;
      }

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
        console.log('비동기 요청');
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
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <Image
          style={styles.personalImage}
          source={{uri: 'https://www.maicosmos.com' + item.url}}
        />
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
        data={formatData(images, numColumns)}
        ListHeaderComponent={
          <View>
            <Image style={styles.userImg} source={{uri: profileImage}} />
            <Text style={styles.userName}>{nick}</Text>
            <Text style={styles.aboutUser}>{about}</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigate('EditProfile', {
                  userId: userId,
                  profImg: profileImage,
                })
              }>
              <Text style={styles.editBtnText}>개인 정보</Text>
            </TouchableOpacity>

            <View style={styles.userInfoWrapper}>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{galleryCnt}</Text>
                <Text style={styles.userInfoSubTitle}>갤러리</Text>
              </View>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{friendCnt}</Text>
                <Text style={styles.userInfoSubTitle}>친구</Text>
              </View>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{imageCnt}</Text>
                <Text style={styles.userInfoSubTitle}>작품</Text>
              </View>
            </View>
            <View style={styles.listTitle}>
              <Text style={styles.listTitleText}>개인 갤러리</Text>
            </View>
            {galleryCnt > 0 ? (
              <Swiper showsButtons={false} style={{height: 270}}>
                {galleries.map(gallery => (
                  <View style={{paddingHorizontal: 20}} key={gallery.key}>
                    <TouchableOpacity
                      onPress={() =>
                        navigate('PersonalGallery', {galleryId: gallery.key})
                      }>
                      <Image
                        style={styles.personalGallery}
                        source={{
                          uri: 'https://www.maicosmos.com' + gallery.url,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </Swiper>
            ) : null}
            <View style={styles.listTitle}>
              <Text style={styles.listTitleText}>작품</Text>
            </View>
            <FlatList
              data={albums}
              renderItem={_renderItem}
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.key}
            />
          </View>
        }
        renderItem={renderItem}
        ListFooterComponent={renderLoader}
        keyExtractor={item => item.key}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        numColumns={3}
        key={3}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns,
  },
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
  personalImage: {
    width: '100%',
    height: Dimensions.get('window').width / numColumns,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  editBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    alignSelf: 'center',
  },
  editBtnText: {
    color: 'black',
    fontSize: 15,
  },
  tag: {
    // backgroundColor: SOCIAL_BLUE,
    borderColor: '#727477',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 15,
  },
  activeTag: {
    backgroundColor: '#2E8AF6',
  },
});

export default Settings;
