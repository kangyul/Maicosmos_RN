import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

function Boards(props) {
  const boardAN = props.boardAN;
  const boardFR = props.boardFR;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>공지 게시판</Text>
      </View>
      {boardAN.length !== 0 ? (
        <View style={styles.boardTitleContainer}>
          {boardAN.map((board, index) => (
            <Text
              style={[styles.boardTitle, index === 0 && styles.bold]}
              key={board.wr_id}>
              {board.wr_subject}
            </Text>
          ))}
        </View>
      ) : (
        <View style={styles.boardTitleContainer}>
          <Text>공지 게시글이 없습니다.</Text>
        </View>
      )}
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>자유 게시판</Text>
      </View>
      {boardFR.length !== 0 ? (
        <View style={styles.boardTitleContainer}>
          {boardFR.map((board, index) => (
            <Text
              style={[styles.boardTitle, index === 0 && styles.bold]}
              key={board.wr_id}>
              {board.wr_subject}
            </Text>
          ))}
        </View>
      ) : (
        <View style={styles.boardTitleContainer}>
          <Text>자유 게시글이 없습니다</Text>
        </View>
      )}
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
