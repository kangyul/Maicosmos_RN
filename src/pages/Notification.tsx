import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

function Notification() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{padding: 15}}>
        <Text style={styles.todayText}>오늘</Text>
      </View>
      <View style={{padding: 15}}>
        <Text>알림이 없습니다.</Text>
      </View>
      <View style={styles.borderLine} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  todayText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  borderLine: {
    borderBottomWidth: 1,
    width: '100%',
    borderColor: 'rgba(218, 218, 218, 1)',
  },
});

export default Notification;
