import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BottomTabView from '../components/BottomTabView';

function CommunityMain({navigation, route}) {
  const {groupId} = route.params;

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [memberCnt, setMemberCnt] = useState(0);
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [slotCnt, setSlotCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [boardAN, setBoardAN] = useState([]);
  const [boardFR, setBoardFR] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const response = await axios.get(
          `https://maicosmos.com/RN/community.php?groupId=${groupId}`,
        );

        setName(response.data.name);
        setLogo(response.data.logo);
        setMemberCnt(response.data.memberCnt);
        setGalleryCnt(response.data.galleryCnt);
        setGalleries(response.data.gallery);
        setBoardAN(response.data.board_an);
        setBoardFR(response.data.board_fr);
        setMembers(response.data.members);
        setSlotCnt(response.data.slotCnt);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getGroupInfo();
  }, [groupId]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          {logo && (
            <Image
              style={styles.groupImg}
              source={{uri: 'https://www.maicosmos.com' + logo}}
            />
          )}
          <Text style={styles.groupName}>{name}</Text>
        </View>
        <View style={styles.groupInfoItem}>
          <Text style={styles.groupInfoTitle}>{galleryCnt}</Text>
          <Text style={styles.groupInfoSubTitle}>갤러리</Text>
        </View>
        <View style={styles.groupInfoItem}>
          <Text style={styles.groupInfoTitle}>{memberCnt}</Text>
          <Text style={styles.groupInfoSubTitle}>구성원</Text>
        </View>
        <View style={styles.groupInfoItem}>
          <Text style={styles.groupInfoTitle}>{slotCnt}</Text>
          <Text style={styles.groupInfoSubTitle}>작품</Text>
        </View>
      </View>
      <BottomTabView
        galleries={galleries}
        boardAN={boardAN}
        boardFR={boardFR}
        members={members}
      />
    </SafeAreaView>
  );
}

export default CommunityMain;

const styles = StyleSheet.create({
  groupImg: {
    height: 80,
    width: 80,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#dbdbdb',
    alignSelf: 'center',
    marginTop: 20,
  },
  groupName: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  groupAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  groupInfoItem: {
    justifyContent: 'space-around',
  },
  groupInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  groupInfoSubTitle: {
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
  groupGallery: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    marginBottom: 20,
  },
});
