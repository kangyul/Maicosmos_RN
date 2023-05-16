import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

function FinishButton() {
  return (
    <TouchableOpacity>
      <Text style={styles.text}>완료</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 19,
    color: '#AA74FF',
    fontWeight: '500',
  },
});

export default FinishButton;
