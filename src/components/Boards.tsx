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
      {board !== undefined && board.length > 0 ? (
        board.map(bo => (
          <View style={styles.container}>
            <View style={styles.caContainer}>
              <Text style={styles.caText}>{bo.ca_name}</Text>
            </View>
            <View style={{padding: 20}}>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <Image
                  style={styles.writerImage}
                  source={{
                    uri: 'https://maicosmos.com/' + bo.wr_img,
                  }}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.nameText}>{bo.wr_name}</Text>
                  <Text style={styles.dateText}>{bo.wr_datetime}</Text>
                </View>
              </View>
              <View style={{marginBottom: 10}}>
                <Text style={styles.subjectText}>{bo.wr_subject}</Text>
              </View>
              <View>
                <Text style={styles.contentText}>{bo.wr_content}</Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconView,
                  {
                    marginRight: 20,
                  },
                ]}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/image/chatbox.png')}
                />
                <Text style={styles.numberText}>{bo.wr_comment}</Text>
              </View>
              <View style={styles.iconView}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/image/view.png')}
                />
                <Text style={styles.numberText}>{bo.wr_hit}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text>게시판 글이 없습니다.</Text>
        </View>
      )}
    </ScrollView>
  );
}

export default Boards;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderColor: '#rgba(227,228,229,1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  caContainer: {
    padding: 20,
    borderColor: '#rgba(227,228,229,1)',
    borderBottomWidth: 1,
  },
  caText: {fontSize: 16, color: '#757575'},
  scrollView: {
    width: '100%',
    height: '100%',
  },
  numberText: {
    fontSize: 16,
  },
  icon: {
    width: 22,
    height: 20,
    marginRight: 10,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  nameText: {
    fontSize: 15,
    marginBottom: 5,
    color: '#212121',
  },
  dateText: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  subjectText: {
    fontSize: 18,
    color: '#111',
  },
  contentText: {
    fontSize: 16,
    color: '#111',
  },
  writerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
    marginRight: 10,
  },
});
