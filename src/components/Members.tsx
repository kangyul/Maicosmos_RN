import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

function Members() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>구성원</Text>
      </View>
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
});
