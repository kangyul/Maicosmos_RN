import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DismissKeyboardView from './DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

function MyFriends() {
  const [friends, setFriends] = useState([]);
  const [temp, setTemp] = useState([]);
  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/friends.php',
          {
            id: userId,
          },
        );

        // console.log(response.data.friends);
        setFriends(response.data.friends);
        setTemp(response.data.friends);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getFriends();
  }, [userId]);

  const unFriend = useCallback(
    async (id: string) => {
      console.log('친구 ID: ' + id);

      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/friendDelete.php',
          {
            id: userId,
            friend: id,
          },
        );

        setFriends(response.data.friends);
        setTemp(response.data.friends);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [userId],
  );

  const onChangeText = useCallback(
    (text: string) => {
      text = text.toLowerCase();

      if (text === '') {
        setFriends([...temp]);
        return;
      }
      setFriends(
        temp.filter(
          friend =>
            friend.name.toLowerCase().includes(text) ||
            friend.nick.toLowerCase().includes(text),
        ),
      );
      // console.log(groups.filter(group => group.name.includes(text)));
    },
    [temp],
  );

  return (
    <View style={{padding: 20}}>
      <View style={{flex: 1, left: 0, right: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../assets/image/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.memberInput}
            placeholderTextColor={'#757575'}
            placeholder="검색"
            onChangeText={onChangeText}
          />
        </View>
      </View>
      <Text style={styles.memberCntText}>{friends.length}명</Text>
      {friends.length > 0 ? (
        <View>
          {friends.map(friend => (
            <View key={friend.id} style={styles.memberView}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Image
                  style={styles.memberImg}
                  source={{uri: 'https://www.maicosmos.com' + friend.img}}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.nick}>{friend.nick}</Text>
                  <Text style={styles.name}>{friend.name}</Text>
                </View>
              </View>
              {/* <TouchableOpacity
                style={styles.addBtn}
                onPress={() => unFriend(friend.id)}>
                <Text style={styles.addBtnText}>친구 취소</Text>
              </TouchableOpacity> */}
              <Menu>
                <MenuTrigger style={styles.delBtn}>
                  <Image
                    style={{width: 4, height: 18}}
                    source={{
                      uri: 'https://www.maicosmos.com/img/icons/vertical_more_gray.png',
                    }}
                  />
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{width: 100}}>
                  <MenuOption onSelect={() => memberDown(member.id)}>
                    <Text style={styles.manageBtnText}>프로필 방문</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() =>
                      Alert.alert('', '친구 관계를 끊으시겠습니까?', [
                        {
                          text: '예',
                          onPress: () => unFriend(friend.id),
                        },
                        {
                          text: '아니오',
                          onPress: () => console.warn('No Pressed'),
                        },
                      ])
                    }>
                    <Text style={[styles.manageBtnText, {color: 'red'}]}>
                      친구 끊기
                    </Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Text>검색 결과가 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

export default MyFriends;

const styles = StyleSheet.create({
  searchIcon: {
    height: 25,
    width: 25,
    position: 'absolute',
    zIndex: 3,
    left: 15,
  },
  scrollView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  memberInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    color: '#111',
    paddingLeft: 50,
  },
  memberView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
  },
  memberImg: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: 15,
  },
  name: {
    fontWeight: '500',
    fontSize: 15,
  },
  nick: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 5,
  },
  memberCntText: {
    fontSize: 17,
    fontWeight: '600',
    marginVertical: 15,
  },
  addBtn: {
    backgroundColor: 'rgba(137,50,234,1)',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
