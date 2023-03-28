import axios, {AxiosError} from 'axios';
import React, {useState} from 'react';
import {View, Text, Image, Button, Platform, Alert} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';

function ImageUpload() {
  const [photo, setPhoto] = useState<ImagePickerResponse | null>(null);
  const userId = useSelector((state: RootState) => state.user.email);

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
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

    // console.log(photo.assets[0].uri);
  };

  const handleUpload = async () => {
    try {
      const data = new FormData();
      data.append('photo', {
        name: photo.assets[0].fileName,
        type: photo.assets[0].type,
        uri: photo.assets[0].uri.replace('file://', ''),
      });

      data.append('userId', userId);

      // http 메서드: get, put, patch, post, delete, head, options
      const response = await axios.post(
        'https://maicosmos.com/RN/image.php',
        data,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );
      console.log('파일명: ' + response.data.file);
      console.log('What happened?' + response.data.message);
      Alert.alert('알림:', '이미지/동영상 업로드 완료!');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {photo && (
        <React.Fragment>
          <Image
            source={{uri: photo.assets[0].uri}}
            style={{width: 300, height: 300}}
          />
          <Button title="Upload" onPress={handleUpload} />
        </React.Fragment>
      )}
      <Button title="이미지/동영상을 선택하세요." onPress={handleChoosePhoto} />
    </View>
  );
}

export default ImageUpload;
