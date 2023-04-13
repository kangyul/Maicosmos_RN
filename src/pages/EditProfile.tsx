import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

function Edit() {
  return (
    <View style={styles.container}>
      <Text>프로필 변경</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked!')} />
    </View>
  );
}

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
