import React, {useState} from 'react';
import {View, Text, Image, Button, Platform} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

function ImageUpload() {
  const [photo, setPhoto] = useState<ImagePickerResponse | null>(null);

  const handleChoosePhoto = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: true,
      },
      res => {
        console.log('로그: ' + res);
        if (res.didCancel) return;
        setPhoto(res);
      },
    );

    console.log(photo.assets[0].uri);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {photo && (
        <Image
          source={{uri: photo.assets[0].uri}}
          style={{width: 300, height: 300}}
        />
      )}
      <Button title="이미지/동영상을 선택하세요." onPress={handleChoosePhoto} />
    </View>
  );
}

export default ImageUpload;
