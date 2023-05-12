import axios, {AxiosError} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';

// const BG_IMAGE = require('../../assets/images/community_wall_paper.jpg');

const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;

function Community({navigation: {navigate}}) {
  const [groups, setGroups] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getGroupList = async () => {
      try {
        const response = await axios.get(
          'https://maicosmos.com/RN/communityList.php',
        );

        setGroups(response.data.data);
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
      {/* <Image
        source={require('../../assets/image/community_wall_paper.png')}
        style={styles.backgroundImage}
        blurRadius={90}
      /> */}
      <Text style={styles.title}>커뮤니티</Text>
      <View
        style={{
          borderBottomWidth: 1,
          width: '90%',
          marginVertical: 20,
          borderColor: 'rgba(218, 218, 218, 1)',
          marginLeft: 20,
        }}
      />
      <Text style={{marginLeft: 20, fontSize: 15, marginBottom: 20}}>
        전체 {groups.length}개
      </Text>
      <Animated.FlatList
        data={groups}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
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
                    marginBottom: SPACING,
                    backgroundColor: '#AA74FF',
                    borderRadius: 8,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    opacity,
                    transform: [{scale}],
                    elevation: 9,
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
                    <Text style={styles.bestGalleryCount}>
                      갤러리: {item.gallery_cnt}개
                    </Text>
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
                    marginBottom: SPACING,
                    backgroundColor: 'rgba(255,255,255,1)',
                    borderRadius: 8,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    opacity,
                    transform: [{scale}],
                    elevation: 9,
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
          padding: SPACING,
        }}
        // onEndReached={() => {
        //   console.log('End of list reached');
        // }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bestName: {
    fontWeight: '700',
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    marginBottom: 5,
    color: '#fff',
  },
  bestLocation: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    marginBottom: 3,
    color: '#fff',
  },
  bestGalleryCount: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    opacity: 0.8,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
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
    opacity: 0.7,
    marginBottom: 3,
  },
  galleryCount: {
    fontSize: Platform.OS === 'ios' ? 16 : 12,
    opacity: 0.8,
    color: '#000',
  },
  group: {
    height: Platform.OS === 'ios' ? 70 : 60,
    width: Platform.OS === 'ios' ? 70 : 60,
    borderRadius: 100,
    marginRight: SPACING / 2,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});

export default Community;
