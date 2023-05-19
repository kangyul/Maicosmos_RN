import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';

function Boards(props) {
  const [board, setBoard] = useState([]);
  const groupId = props.groupId;

  useEffect(() => {
    const getBoard = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/board.php',
          {
            id: groupId,
          },
        );
        setBoard(response.data.board);
        console.log(response.data.board);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getBoard();
  }, [groupId]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      {board.map(bo => (
        <View
          style={{
            marginTop: 20,
            backgroundColor: '#fff',
            borderColor: '#rgba(227,228,229,1)',
            borderTopWidth: 1,
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              padding: 20,
              borderColor: '#rgba(227,228,229,1)',
              borderBottomWidth: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#757575',
              }}>
              {bo.ca_name}
            </Text>
          </View>
          <View style={{padding: 20}}>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <Image
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 100,
                  marginRight: 10,
                }}
                source={{
                  uri: 'https://maicosmos.com/' + bo.wr_img,
                }}
              />
              <View style={{alignSelf: 'center'}}>
                <Text style={{fontSize: 15, marginBottom: 5, color: '#212121'}}>
                  {bo.wr_name}
                </Text>
                <Text style={{fontSize: 14, color: '#9E9E9E'}}>
                  {bo.wr_datetime}
                </Text>
              </View>
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={{fontSize: 18, color: '#111'}}>{bo.wr_subject}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16, color: '#111'}}>{bo.wr_content}</Text>
            </View>
          </View>
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 20,
                alignItems: 'center',
              }}>
              <Image
                style={{width: 23, height: 20, marginRight: 10}}
                source={require('../../assets/image/chatbox.png')}
              />
              <Text style={{fontSize: 16}}>{bo.wr_comment}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 22, height: 20, marginRight: 10}}
                source={require('../../assets/image/view.png')}
              />
              <Text style={{fontSize: 16}}>{bo.wr_hit}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default Boards;

const styles = StyleSheet.create({
  boardTitle: {
    marginBottom: 5,
    fontSize: 15,
  },
  boardTitleContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  scrollView: {
    width: '100%',
    height: '100%',
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
  galleriesView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
});
