import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Image, Alert} from 'react-native';

const Item = ({logo, name}) => (
  <View style={styles.item}>
    <View style={styles.groupContainer}>
      <Image style={styles.group} source={{uri: logo}} />
    </View>
    <Text style={styles.name}>{name}</Text>
  </View>
);

function Community() {
  const [groups, setGroups] = useState([]);

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
  });

  return (
    <FlatList
      data={groups}
      renderItem={({item}) => <Item logo={item.logo} name={item.name} />}
      keyExtractor={item => item.key}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      // onEndReached={() => {
      //   console.log('End of list reached');
      // }}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  age: {
    marginLeft: 16,
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CCC',
  },
  groupContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    height: 89,
    width: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  group: {
    height: 55,
    width: 55,
  },
});

export default Community;
