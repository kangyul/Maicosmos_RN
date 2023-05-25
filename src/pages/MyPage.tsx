import axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import SettingIcon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import MyFriends from '../components/MyFriends';
import Icon from 'react-native-vector-icons/Feather';

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

const MyPage: React.FC = ({navigation: {navigate}}) => {
  const [galleryCnt, setGalleryCnt] = useState<number>(0);
  const [friendCnt, setFriendCnt] = useState<number>(0);
  const [imageCnt, setImageCnt] = useState<number>(0);
  const [galleries, setGalleries] = useState([]);
  const [galleriesTemp, setGalleriesTemp] = useState([]);
  const [gallerySet, setGallerySet] = useState([]);
  const [albums, setAlbums] = useState([]);

  const userId = useSelector((state: RootState) => state.user.id);
  const nick = useSelector((state: RootState) => state.user.nick);
  const profileImage = useSelector((state: RootState) => state.user.img);
  const about = useSelector((state: RootState) => state.user.desc);

  // const renderGalleryItem: ListRenderItem<number> = React.useCallback(({item, index}) => {
  //   return (
  //     <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
  //   );
  // }, []);

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
        console.log(galleries);
        setGalleriesTemp(response.data.gallery);
        setAlbums(response.data.album);
        setGallerySet(response.data.gallerySet);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getUserInfo();
  }, [userId]);

  ////////////////////////////////////////////////////////////////
  ///////// 작품 렌더링 /////////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);

  const renderItem = ({item}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => showModal(item.key)}>
        <Image
          style={styles.personalImage}
          source={{uri: 'https://www.maicosmos.com' + item.url}}
        />
      </TouchableOpacity>
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

        if (currentPage === 0) {
          setImages([...response.data.image]);
        } else {
          setImages([...images, ...response.data.image]);
        }

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
  ////////////////////////////////////////////////////////////////
  ///////// 작품 렌더링 /////////////////////////////////////////////

  // 모달
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalName, setModalName] = useState<string>('');
  const [modalDate, setModalDate] = useState<string>('');
  const [modalDesc, setModalDesc] = useState<string>('');
  const [modalImage, setModalImage] = useState<string>('');
  const [modalLikes, setModalLikes] = useState<string>('');

  const showModal = useCallback(async (id: string) => {
    console.log('작품 ID: ' + id);

    try {
      const response = await axios.post(
        'https://maicosmos.com/RN/artworkModal.php',
        {
          id,
        },
      );

      setModalTitle(response.data.image.title);
      setModalDesc(response.data.image.description);
      setModalDate(response.data.image.date);
      setModalName(response.data.image.name);
      setModalImage('https://maicosmos.com' + response.data.image.imageurl);
      setModalLikes(response.data.image.likes);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }

    setModalVisible(true);
  }, []);
  // 모달

  // 갤러리 연도 표시 탭
  const [activeTagIndex, setActiveTagIndex] = useState(0);

  const renderYear = ({item, index}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === index && styles.activeTag]}
        onPress={() => {
          setActiveTagIndex(index);
          if (gallerySet[index] === '전체') {
            setGalleries([...galleriesTemp]);
          } else {
            setGalleries(
              galleriesTemp.filter(gallery =>
                gallery.date.includes(gallerySet[index]),
              ),
            );
          }
        }}
        key={index}>
        <Text
          style={[
            styles.tagText,
            activeTagIndex === index && styles.activeText,
          ]}>
          {gallerySet[index]}
        </Text>
      </Pressable>
    );
  };
  // 갤러리 연도 표시 탭

  // 앨범
  const renderAlbum = ({item, index}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === index && styles.activeTag]}
        onPress={() => {
          setActiveTagIndex(index);
        }}
        key={index}>
        <Text
          style={[
            styles.tagText,
            activeTagIndex === index && styles.activeText,
          ]}>
          {albums[index].albumname}
        </Text>
      </Pressable>
    );
  };
  // 앨범

  const Header = () => {
    return (
      <View>
        <TouchableOpacity
          style={{position: 'absolute', right: 20, top: 10}}
          onPress={() => navigate('Settings')}>
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
    );
  };

  return (
    <Tabs.Container
      renderHeader={Header}
      allowHeaderOverscroll={true}
      lazy={true}>
      <Tabs.Tab name="갤러리">
        <Tabs.ScrollView style={{backgroundColor: '#fff'}}>
          <View>
            <FlatList
              data={gallerySet}
              renderItem={renderYear}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{padding: 20}}
            />
            {galleryCnt > 0
              ? galleries.map(gallery => (
                  <View key={gallery.key}>
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
                    <View style={styles.galleryInfoContainer}>
                      <Text style={styles.galleryTitle}>{gallery.title}</Text>
                      <Text style={styles.galleryDate}>{gallery.date}</Text>
                    </View>
                  </View>
                ))
              : null}
          </View>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="작품">
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 20,
                  marginBottom: 20,
                }}
                source={{
                  uri: modalImage,
                }}
              />
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon size={15} name="heart" />
                  <Text style={{marginLeft: 5}}>{modalLikes}</Text>
                </View>
                <Text>작품 제목: {modalTitle}</Text>
                <Text>작가 이름: {modalName}</Text>
                <Text>날짜: {modalDate}</Text>
                <Text>작품 설명: {modalDesc}</Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>작품 닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Tabs.FlatList
          data={formatData(images, numColumns)}
          renderItem={renderItem}
          ListHeaderComponent={
            <FlatList
              data={albums}
              renderItem={renderAlbum}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{padding: 20}}
            />
          }
          ListFooterComponent={renderLoader}
          keyExtractor={item => item.key}
          onEndReached={loadMoreItem}
          onEndReachedThreshold={0}
          showsHorizontalScrollIndicator={false}
          numColumns={3}
          key={3}
          // onRefresh={onRefresh}
          refreshing={refreshing}
          style={{backgroundColor: '#fff'}}
        />
      </Tabs.Tab>
      <Tabs.Tab name="친구">
        <Tabs.ScrollView style={{backgroundColor: '#fff'}}>
          <MyFriends />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const styles = StyleSheet.create({
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
  personalGallery: {
    width: '100%',
    height: 240,
  },
  galleryInfoContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  galleryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  galleryDate: {
    fontSize: 16,
    color: '#aaa',
  },
  item: {
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  personalImage: {
    width: '100%',
    height: Dimensions.get('window').width / numColumns,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  tag: {
    // backgroundColor: SOCIAL_BLUE,
    borderColor: '#727477',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTag: {
    backgroundColor: '#111',
  },
  activeText: {
    color: '#fff',
  },
});

export default MyPage;
