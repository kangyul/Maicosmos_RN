import axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
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

function MyArtWork(props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);

  const userId = useSelector((state: RootState) => state.user.id);

  // 모달
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalName, setModalName] = useState<string>('');
  const [modalDate, setModalDate] = useState<string>('');
  const [modalDesc, setModalDesc] = useState<string>('');
  const [modalImage, setModalImage] = useState<string>('');
  const [modalLikes, setModalLikes] = useState<string>('');

  // 앨범
  const [album, setAlbum] = useState([]);
  const [activeTagIndex, setActiveTagIndex] = useState(0);

  const allImages = useCallback(async () => {
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
      console.log(response.data.image);

      if (currentPage === 0) {
        setImages([...response.data.image]);
      } else {
        setImages([...images, ...response.data.image]);
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, images, isListEnd, userId]);

  const albumSort = useCallback(
    async albumId => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/albumFilter.php',
          {
            albumId: albumId,
            offset: currentPage,
          },
        );

        console.log(response.data.image);

        setImages([...response.data.image]);
      } catch {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [currentPage],
  );

  const _renderItem = ({item, index}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === index && styles.activeTag]}
        onPress={() => {
          setActiveTagIndex(index);
          setCurrentPage(0);
          if (album[index] === '전체') {
            allImages();
          } else {
            albumSort(album[index].key);
          }
        }}
        key={index}>
        <Text
          style={[
            styles.tagText,
            activeTagIndex === index && styles.activeText,
          ]}>
          {album[index].albumname}
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    setAlbum(props.albums);
  }, [props.albums]);

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

  // const RefreshDataFetch = useCallback(async () => {
  //   try {
  //     const response = await axios.post(
  //       'https://maicosmos.com/RN/artworks.php',
  //       {
  //         userId,
  //         offset: 0,
  //       },
  //     );
  //     setCurrentPage(0);
  //     setIsListEnd(false);
  //     setImages([...response.data.image]);
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError).response;
  //     if (errorResponse) {
  //       Alert.alert('알림', errorResponse.data.message);
  //     }
  //   }

  //   try {
  //     const response = await axios.post(
  //       'https://maicosmos.com/RN/userInfo.php',
  //       {
  //         userId,
  //       },
  //     );

  //     setGalleryCnt(response.data.galleryCnt);
  //     setFriendCnt(response.data.friendCnt);
  //     setImageCnt(response.data.imageCnt);
  //     setGalleries(response.data.gallery);
  //     setAlbums(response.data.album);
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError).response;
  //     if (errorResponse) {
  //       Alert.alert('알림', errorResponse.data.message);
  //     }
  //   }
  // }, [userId]);

  // useFocusEffect(
  //   useCallback(() => {
  //     RefreshDataFetch();
  //   }, [RefreshDataFetch]),
  // );

  const getRefreshData = async () => {
    setRefreshing(true);
    await RefreshDataFetch();
    setRefreshing(false);
  };

  const onRefresh = () => {
    if (!refreshing) {
      getRefreshData();
    }
  };

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

  return (
    <View style={{backgroundColor: '#fff'}}>
      <FlatList
        data={album}
        renderItem={_renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{padding: 20, marginBottom: 10}}
        // keyExtractor={item => item.key}
      />
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
      <FlatList
        data={formatData(images, numColumns)}
        renderItem={renderItem}
        ListFooterComponent={renderLoader}
        keyExtractor={item => item.key}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        numColumns={3}
        key={3}
        // onRefresh={onRefresh}
        refreshing={refreshing}
        style={{marginBottom: 100}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  activeTag: {
    backgroundColor: '#111',
  },
  activeText: {
    color: '#fff',
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
});

export default MyArtWork;
