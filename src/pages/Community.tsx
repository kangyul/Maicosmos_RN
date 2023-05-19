import axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Animated,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';

const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;

const tags = ['전체', '서울', '경기도', '부산', '제주도'];

function Community({navigation: {navigate}}) {
  const [groups, setGroups] = useState([]);
  const [temp, setTemp] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [activeTagIndex, setActiveTagIndex] = useState(0);

  const listEmptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text>검색 결과가 없습니다</Text>
      </View>
    );
  };

  const _renderItem = ({item, index}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === index && styles.activeTag]}
        onPress={() => {
          setActiveTagIndex(index);
          if (tags[index] === '전체') {
            setGroups([...temp]);
          } else {
            setGroups(
              temp.filter(group => group.street_address.includes(tags[index])),
            );
          }
        }}
        key={index}>
        <Text
          style={[
            styles.tagText,
            activeTagIndex === index && styles.activeText,
          ]}>
          {tags[index]}
        </Text>
      </Pressable>
    );
  };

  const onChangeText = useCallback(
    (text: string) => {
      if (text === '') {
        setGroups([...temp]);
        return;
      }
      // setGroups([]);
      setGroups(temp.filter(group => group.name.includes(text)));
      // console.log(groups.filter(group => group.name.includes(text)));
    },
    [temp],
  );

  useEffect(() => {
    const getGroupList = async () => {
      try {
        const response = await axios.get(
          'https://maicosmos.com/RN/communityList.php',
        );

        setGroups(response.data.data);
        setTemp(response.data.data);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getGroupList();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Animated.FlatList
        data={groups}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        ListEmptyComponent={listEmptyComponent}
        renderItem={({item, index}) => {
          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
          ];

          const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1),
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });

          const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0],
          });

          if (index < 3) {
            return (
              <TouchableOpacity
                onPress={() => navigate('CommunityMain', {groupId: item.key})}>
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: SPACING,
                    marginBottom: SPACING / 2,
                    backgroundColor: '#rgba(115,82,255,1)',
                    borderRadius: 8,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                  }}>
                  <Image
                    style={styles.group}
                    source={{uri: 'https://www.maicosmos.com' + item.logo}}
                  />
                  <View>
                    <Text style={styles.bestName}>{item.name}</Text>
                    <Text style={styles.bestLocation}>
                      {item.street_address}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.bestGalleryCount}>
                        갤러리: {item.gallery_cnt}개
                      </Text>
                      <Image
                        style={{width: 20, height: 20, marginRight: 5}}
                        source={require('../../assets/image/best.png')}
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'rgba(255,193,92,1)',
                        }}>
                        BEST
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => navigate('CommunityMain', {groupId: item.key})}>
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: SPACING,
                    marginBottom: SPACING / 2,
                    backgroundColor: 'rgba(243,243,243,1)',
                    borderRadius: 8,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                  }}>
                  <Image
                    style={styles.group}
                    source={{uri: 'https://www.maicosmos.com' + item.logo}}
                  />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.location}>{item.street_address}</Text>
                    <Text style={styles.galleryCount}>
                      갤러리: {item.gallery_cnt}개
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }
        }}
        keyExtractor={item => item.key}
        contentContainerStyle={{
          paddingHorizontal: SPACING,
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View>
            <View
              style={{
                flex: 1,
                paddingVertical: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../../assets/image/smallLogo.png')}
              />
              <View style={{flex: 1, left: 0, right: 0}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/image/search.png')}
                    style={{
                      height: 25,
                      width: 25,
                      position: 'absolute',
                      zIndex: 3,
                      left: 20,
                    }}
                  />
                  <TextInput
                    style={{
                      height: 35,
                      width: 350,
                      marginHorizontal: 10,
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      backgroundColor: '#f5f5f5',
                      fontSize: 15,
                      color: '#111',
                      paddingLeft: 40,
                    }}
                    placeholderTextColor={'#757575'}
                    placeholder="다른 학교들과 소통해 보세요!"
                    onChangeText={onChangeText}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.title}>커뮤니티</Text>
            <FlatList
              data={tags}
              renderItem={_renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              // keyExtractor={item => item.key}
            />
            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                marginVertical: 20,
                borderColor: 'rgba(218, 218, 218, 1)',
              }}
            />
            <Text style={styles.total}>전체 {groups.length}개</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  total: {
    fontSize: 17,
    marginBottom: SPACING,
    color: '#rgba(117,117,117,1)',
  },
  bestName: {
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    marginBottom: 5,
    color: '#fff',
  },
  bestLocation: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    marginBottom: 3,
    color: 'rgba(231,226,255,1)',
    fontWeight: 'normal',
  },
  bestGalleryCount: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 15,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    // transform: [{scale}],
  },
  name: {
    fontWeight: '700',
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    marginBottom: 5,
  },
  location: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    color: 'rgba(133,136,148,1)',
    marginBottom: 3,
  },
  galleryCount: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    color: '#000',
  },
  group: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: SPACING / 2,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  tag: {
    // backgroundColor: SOCIAL_BLUE,
    borderColor: '#727477',
    borderWidth: 1,
    paddingHorizontal: 15,
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

export default Community;
