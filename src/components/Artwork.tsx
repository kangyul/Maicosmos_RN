import React, {useState} from 'react';
import {Text, View} from 'react-native';

function ArtWork(props) {
  const backgroundColor = props.backgroundColor;

  const [height, setHeight] = useState(0);
  return (
    <View style={{flex: 1}}>
      <View
        onLayout={e => setHeight(e.nativeEvent.layout.width)}
        style={{
          flex: 1,
          height,
          backgroundColor,
          margin: 10,
          borderRadius: 10,
        }}
      />
      {backgroundColor !== 'white' ? (
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 20,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          제목
        </Text>
      ) : null}
    </View>
  );
}

export default ArtWork;
