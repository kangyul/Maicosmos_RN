import axios, {AxiosError} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';

// const BG_IMAGE = require('../../assets/images/community_wall_paper.jpg');

const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;

function Community() {
  const [groups, setGroups] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getGroupList = async () => {
      try {
        const response = await axios.get(
          'https://maicosmos.com/RN/community.php',
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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <Image
        source={require('../../assets/image/community_wall_paper.png')}
        style={styles.backgroundImage}
        blurRadius={90}
      /> */}
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

          return (
            <Animated.View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: SPACING,
                marginBottom: SPACING,
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: 16,
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
              }}>
              <View style={styles.groupContainer}>
                <Image style={styles.group} source={{uri: item.logo}} />
              </View>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>
                  서울특별시 동대문구 회기로10길 63
                </Text>
                <Text style={styles.galleryCount}>갤러리 수: 10</Text>
              </View>
            </Animated.View>
          );
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
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255,0.8)',
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
    fontSize: 22,
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 3,
  },
  galleryCount: {
    fontSize: 16,
    opacity: 0.8,
    color: '#0099cc',
  },
  groupContainer: {
    borderRadius: 100,
    height: 89,
    width: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  group: {
    height: 70,
    width: 70,
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
