import React, {useState} from 'react';
import {Text, View} from 'react-native';

function Prop(props) {
  const backgroundColor = props.backgroundColor;
  const heightProp = Number(props.height);

  // const [height, setHeight] = useState(0);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          height: heightProp,
          backgroundColor,
          margin: 10,
          borderRadius: 10,
        }}
      />
    </View>
  );
}

export default Prop;
