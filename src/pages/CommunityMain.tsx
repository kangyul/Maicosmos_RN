import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import axios, {AxiosError} from 'axios';
import Galleries from '../components/Galleries';
import Boards from '../components/Boards';
import Members from '../components/Members';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const HEADER_HEIGHT = 250;

const DATA = [0, 1, 2, 3, 4];
const identity = (v: unknown): string => v + '';

const CommunityMain: React.FC = ({navigation, route}) => {
  const renderItem: ListRenderItem<number> = React.useCallback(({index}) => {
    return (
      <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
    );
  }, []);

  const {groupId} = route.params;

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [memberCnt, setMemberCnt] = useState(0);
  const [galleryCnt, setGalleryCnt] = useState(0);
  const [slotCnt, setSlotCnt] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const [gallerySet, setGallerySet] = useState([]);

  const [isAdmin, setIsAdmin] = useState<boolean>(0);
  const [role, setRole] = useState(0);

  const userId = useSelector((state: RootState) => state.user.id);

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
        setSlotCnt(response.data.slotCnt);
        setGallerySet(response.data.gallerySet);

        const responseIsAdmin = await axios.post(
          'https://maicosmos.com/RN/isAdmin.php',
          {
            id: userId,
            groupId: groupId,
          },
        );
        setIsAdmin(responseIsAdmin.data.isAdmin);
        setRole(responseIsAdmin.data.role);
        console.log(role);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getGroupInfo();
  }, [groupId, userId]);

  const Header = () => {
    return (
      <View>
        <Image
          style={styles.commImg}
          source={{uri: 'https://www.maicosmos.com' + logo}}
        />
        <Text style={styles.communityName}>{name}</Text>
        <View style={styles.commInfoWrapper}>
          <View style={styles.commInfoItem}>
            <Text style={styles.commInfoTitle}>{memberCnt}</Text>
            <Text style={styles.commInfoSubTitle}>친구</Text>
          </View>
          <View style={styles.commInfoItem}>
            <Text style={styles.commInfoTitle}>{galleryCnt}</Text>
            <Text style={styles.commInfoSubTitle}>갤러리</Text>
          </View>
          <View style={styles.commInfoItem}>
            <Text style={styles.commInfoTitle}>{slotCnt}</Text>
            <Text style={styles.commInfoSubTitle}>작품</Text>
          </View>
        </View>
        {role >= 1 ? (
          <View style={styles.adminView}>
            <Text style={styles.addBtnText}>관리자</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>가입 신청</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Tabs.Container renderHeader={Header} lazy={true}>
      <Tabs.Tab name="갤러리">
        <Tabs.ScrollView style={{backgroundColor: '#fff'}}>
          <Galleries galleries={galleries} gallerySet={gallerySet} />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="게시판">
        <Tabs.ScrollView>
          <Boards groupId={groupId} />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="구성원">
        <Tabs.ScrollView style={{backgroundColor: '#fff'}}>
          <Members isAdmin={isAdmin} groupId={groupId} role={role} />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: 'rgba(137,50,234,1)',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  adminView: {
    backgroundColor: '#0cb6ea',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  commInfoItem: {
    justifyContent: 'center',
  },
  commInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  commInfoSubTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  commImg: {
    height: 90,
    width: 90,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  communityName: {
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
  commInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
});

export default CommunityMain;
