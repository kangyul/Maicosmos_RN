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

function Members(props) {
  const isAdmin = props.isAdmin;
  const groupId = props.groupId;
  const role = props.role;
  const [members, setMembers] = useState([]);
  const [temp, setTemp] = useState([]);

  const [waitList, setWaitList] = useState([]);

  const userId = useSelector((state: RootState) => state.user.id);

  const onChangeText = useCallback(
    (text: string) => {
      text = text.toLowerCase();

      if (text === '') {
        setMembers([...temp]);
        return;
      }
      // setGroups([]);
      setMembers(
        temp.filter(
          member =>
            member.name.toLowerCase().includes(text) ||
            member.nick.toLowerCase().includes(text),
        ),
      );
      // console.log(groups.filter(group => group.name.includes(text)));
    },
    [temp],
  );

  const declineRequest = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/groupDecline.php',
          {
            groupId: groupId,
            id: id,
          },
        );

        setWaitList(response.data.waitList);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [groupId],
  );

  const acceptRequest = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/groupAccept.php',
          {
            groupId: groupId,
            id: id,
          },
        );

        setWaitList(response.data.waitList);
        setMembers(response.data.members);
        console.log(response.data.members);
        setTemp(response.data.members);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [groupId, members],
  );

  const removeMember = useCallback(async (id: string) => {
    try {
      const response = await axios.post(
        'https://maicosmos.com/RN/groupMemberDelete.php',
        {
          gmId: id,
        },
      );

      setMembers(response.data.members);
      setTemp(response.data.members);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, []);

  const memberUp = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/groupMemberUp.php',
          {
            id: id,
            groupId: groupId,
            myRole: role,
          },
        );

        setMembers(response.data.members);
        console.log(response.data.members);
        setTemp(response.data.members);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [groupId, role],
  );

  const memberDown = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/groupMemberDown.php',
          {
            id: id,
            groupId: groupId,
          },
        );

        setMembers(response.data.members);
        console.log(response.data.members);
        setTemp(response.data.members);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [groupId],
  );

  const addFriend = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/friendRequest.php',
          {
            id: userId,
            friend: id,
          },
        );
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    },
    [userId],
  );

  useEffect(() => {
    const getWaitList = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/groupWaitList.php',
          {
            groupId: groupId,
          },
        );

        setWaitList(response.data.waitlist);
        setMembers(response.data.members);
        setTemp(response.data.members);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getWaitList();
  }, [groupId]);

  return (
    <DismissKeyboardView style={{backgroundColor: '#fff'}}>
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
        {role >= 1 ? (
          <View style={{marginTop: 20}}>
            <Text style={styles.memberCntText}>
              받은 요청 (
              {waitList === null || waitList === undefined
                ? 0
                : waitList.length}
              명)
            </Text>
            <View>
              {waitList !== null && waitList !== undefined
                ? waitList.map(member => (
                    <View key={member.id} style={styles.memberView}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                          style={styles.memberImg}
                          source={{
                            uri: 'https://www.maicosmos.com' + member.img,
                          }}
                        />
                        <View style={{alignSelf: 'center'}}>
                          <Text style={styles.nick}>{member.nick}</Text>
                          <Text style={styles.name}>{member.name}</Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={styles.noBtn}
                          onPress={() => {
                            acceptRequest(member.id);
                          }}>
                          <Text style={styles.delBtnText}>수락</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.yesBtn}
                          onPress={() => {
                            declineRequest(member.id);
                          }}>
                          <Text style={styles.delBtnText}>거절</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                : null}
            </View>
          </View>
        ) : null}
        <View
          style={{
            borderBottomWidth: 1,
            width: '100%',
            marginVertical: 10,
            borderColor: 'rgba(218, 218, 218, 1)',
          }}
        />
        <Text style={styles.memberCntText}>
          {members === null || members === undefined ? 0 : members.length}명
        </Text>
        {members !== null && members !== undefined ? (
          <View>
            {members.map(member => (
              <View key={member.id} style={styles.memberView}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Image
                    style={styles.memberImg}
                    source={{uri: 'https://www.maicosmos.com' + member.img}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.nick}>
                      {member.nick} [{member.roleName}]
                    </Text>
                    <Text style={styles.name}>{member.name}</Text>
                  </View>
                </View>
                {role >= 1 ? (
                  role > member.role ? (
                    <Menu>
                      <MenuTrigger style={styles.delBtn} text="관리" />
                      <MenuOptions optionsContainerStyle={{width: 100}}>
                        <MenuOption onSelect={() => memberUp(member.id)}>
                          <Text style={styles.manageBtnText}>등업</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => memberDown(member.id)}>
                          <Text style={styles.manageBtnText}>강등</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => removeMember(member.gm_id)}>
                          <Text style={[styles.manageBtnText, {color: 'red'}]}>
                            삭제
                          </Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  ) : null
                ) : (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      addFriend(member.id);
                    }}>
                    <Text style={styles.addBtnText}>친구 추가</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text>검색 결과가 없습니다.</Text>
          </View>
        )}
      </View>
    </DismissKeyboardView>
  );
}

export default Members;

const styles = StyleSheet.create({
  manageBtnText: {
    fontSize: 16,
    marginVertical: 8,
    alignSelf: 'center',
  },
  searchIcon: {
    height: 25,
    width: 25,
    position: 'absolute',
    zIndex: 3,
    left: 15,
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
  noBtn: {
    backgroundColor: '#dbdbdb',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  yesBtn: {
    backgroundColor: '#dbdbdb',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
  },
  delBtn: {
    backgroundColor: '#dbdbdb',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
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
  delBtnText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
  },
});
