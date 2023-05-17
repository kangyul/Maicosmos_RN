import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function Members(props) {
  const members = props.members;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={{padding: 20}}>
        <View style={{flex: 1, left: 0, right: 0}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/image/search.png')}
              style={{
                height: 25,
                width: 25,
                position: 'absolute',
                zIndex: 3,
                left: 15,
              }}
            />
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderRadius: 20,
                paddingHorizontal: 10,
                backgroundColor: '#f5f5f5',
                fontSize: 16,
                color: '#111',
                paddingLeft: 50,
              }}
              placeholderTextColor={'#757575'}
              placeholder="검색"
              // onChangeText={onChangeText}
            />
          </View>
        </View>
        <Text style={styles.memberCntText}>{members.length}명</Text>
        {members && (
          <View>
            {members.map(member => (
              <View
                key={member.gm_id}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginBottom: 20,
                  backgroundColor: 'rgba(255,255,255,1)',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Image
                    style={styles.memberImg}
                    source={{uri: 'https://www.maicosmos.com' + member.img}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.nick}>{member.nick}</Text>
                    <Text style={styles.name}>{member.name}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addBtnText}>팔로우</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default Members;

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#0cb6ea',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
