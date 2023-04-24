import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

function Boards(props) {
  const boardAN = props.boardAN;
  const boardFR = props.boardFR;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>공지 게시판</Text>
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 20}}>
        {boardAN.map(board => (
          <Text key={board.wr_id}>🔖 {board.wr_subject}</Text>
        ))}
      </View>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>자유 게시판</Text>
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 20}}>
        {boardFR.map(board => (
          <Text key={board.wr_id}>🔖 {board.wr_subject}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

export default Boards;

const styles = StyleSheet.create({
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
});
