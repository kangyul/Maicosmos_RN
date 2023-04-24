import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function CommunityMain({navigation, route}) {
  const {groupId} = route.params;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [memberCnt, setMemberCnt] = useState(0);
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [boardAN, setBoardAN] = useState([]);
  const [boardFR, setBoardFR] = useState([]);

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const response = await axios.get(
          `https://maicosmos.com/RN/community.php?groupId=${groupId}`,
        );

        setName(response.data.name);
        setAddress(response.data.address);
        setLogo(response.data.logo);
        setMemberCnt(response.data.memberCnt);
        setGalleryCnt(response.data.galleryCnt);
        setGalleries(response.data.gallery);
        setBoardAN(response.data.board_an);
        setBoardFR(response.data.board_fr);

        console.log('테스트: ' + response.data.name);
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
      <ScrollView>
        <Image style={styles.groupImg} source={{uri: logo}} />
        <Text style={styles.groupName}>{name}</Text>
        <Text style={styles.groupAddress}>{address}</Text>
        <View style={styles.groupInfoWrapper}>
          <View style={styles.groupInfoItem}>
            <Text style={styles.groupInfoTitle}>{galleryCnt}</Text>
            <Text style={styles.groupInfoSubTitle}>갤러리</Text>
          </View>
          <View style={styles.groupInfoItem}>
            <Text style={styles.groupInfoTitle}>{memberCnt}</Text>
            <Text style={styles.groupInfoSubTitle}>구성원</Text>
          </View>
        </View>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>학급 갤러리</Text>
        </View>
        <View style={{paddingHorizontal: 20}}>
          {galleries.map(gallery => (
            <TouchableOpacity>
              <Image
                key={gallery.key}
                style={styles.groupGallery}
                source={{uri: gallery.thumbnail}}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>공지 게시판</Text>
        </View>
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          {boardAN.map(board => (
            <Text>🔖 {board.wr_subject}</Text>
          ))}
        </View>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>자유 게시판</Text>
        </View>
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          {boardFR.map(board => (
            <Text>🔖 {board.wr_subject}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CommunityMain;

const styles = StyleSheet.create({
  groupImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 20,
  },
  groupName: {
    fontSize: 18,
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
  groupInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  groupInfoItem: {
    justifyContent: 'center',
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
