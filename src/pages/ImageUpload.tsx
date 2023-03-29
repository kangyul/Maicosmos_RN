import axios, {AxiosError} from 'axios';
import React, {useState} from 'react';
import {View, Button, Alert, Image, Platform} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Video from 'react-native-video';

function ImageUpload() {
  // const [name, setName] = useState('');
  // const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState<ImagePickerResponse | null>(null);
  const [isPhoto, setIsPhoto] = useState(true);
  const userId = useSelector((state: RootState) => state.user.email);
  const name = useSelector((state: RootState) => state.user.name);

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: true,
      },
      res => {
        if (res.didCancel) return;
        setPhoto(res);
        if (res.assets[0].type?.includes('video')) {
          setIsPhoto(false);
        } else {
          setIsPhoto(true);
        }
      },
    );
    // console.log(photo.assets[0].uri);
  };

  const handleUpload = async () => {
    // if (!name || !name.trim()) {
    //   return Alert.alert('알림', '작가 이름을 입력해주세요.');
    // }
    // if (!title || !title.trim()) {
    //   return Alert.alert('알림', '작품 제목을 입력해주세요.');
    // }
    try {
      const data = new FormData();
      data.append('photo', {
        name: photo.assets[0].fileName,
        type: photo.assets[0].type,
        uri:
          Platform.OS === 'android'
            ? photo.assets[0].uri
            : photo.assets[0].uri.replace('file://', ''),
      });

      console.log(
        '기존 파일 위치:' + photo.assets[0].uri.replace('file://', ''),
      );

      data.append('userId', userId);
      data.append('name', name);

      // http 메서드: get, put, patch, post, delete, head, options
      const response = await axios.post(
        'https://maicosmos.com/RN/image.php',
        data,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );
      console.log('파일명: ' + response.data.file);
      console.log('메세지: ' + response.data.message);
      console.log('Upload flag: ' + response.data.flag);
      // console.log('파일 타입: ' + response.data.fileType);
      Alert.alert('알림:', '이미지/동영상 업로드 완료!');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setPhoto(null);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {photo && (
        <React.Fragment>
          {isPhoto ? (
            <Image
              source={{uri: photo.assets[0].uri}}
              style={{width: 300, height: 300}}
            />
          ) : (
            <Video
              source={{uri: photo.assets[0].uri}}
              style={{width: 300, height: 300}}
            />
          )}
          <Button title="Upload" onPress={handleUpload} />
        </React.Fragment>
      )}
      <Button title="이미지/동영상을 선택하세요." onPress={handleChoosePhoto} />
    </View>
  );
}

export default ImageUpload;
