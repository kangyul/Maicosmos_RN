import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function Members(props) {
  const members = props.members;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>구성원</Text>
      </View>
      {members && (
        <View>
          {members.map(member => (
            <View
              key={member.gm_id}
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                marginBottom: 2,
                backgroundColor: 'rgba(255,255,255,1)',
                alignItems: 'center',
              }}>
              <Image
                style={styles.memberImg}
                source={{uri: 'https://www.maicosmos.com' + member.img}}
              />
              <View>
                <Text style={styles.nick}>{member.nick}</Text>
                <Text style={styles.name}>{member.name}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default Members;

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  galleriesView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  tabTitle: {
    alignContent: 'flex-end',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  tabTitleText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  memberImg: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginRight: 20,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
  },
  nick: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
  },
});
