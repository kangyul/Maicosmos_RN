import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {createThumbnail} from 'react-native-create-thumbnail';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Video from 'react-native-video';
import DismissKeyboardView from '../components/DismissKeyboardView';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function ImageUpload({navigation}) {
  const [isPhoto, setIsPhoto] = useState<boolean>(true);
  const [preview, setPreview] = useState<{uri: string}>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [video, setVideo] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [thumbnail, setThumbnail] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const userId = useSelector((state: RootState) => state.user.id);
  const name = useSelector((state: RootState) => state.user.name);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleRef = useRef<TextInput | null>(null);
  const descriptionRef = useRef<TextInput | null>(null);

  const imageBackGroundURI = image
    ? image.uri
    : 'https://www.maicosmos.com/Mobile/starry_night.jpg';

  const onChangeTitle = useCallback(text => {
    setTitle(text);
  }, []);

  const onChangeDescription = useCallback(text => {
    setDescription(text);
  }, []);

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });

      setIsPhoto(true);
    });
  }, []);

  const onChangeImageFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      cropping: true,
      mediaType: 'any',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const createVideoThumbnail = useCallback(async response => {
    setVideo({
      uri: response.path,
      name: response.filename,
      type: response.mime,
    });
    createThumbnail({
      url: response.path,
      timeStamp: 0,
    })
      .then(thumb => {
        setThumbnail({
          uri: thumb.path,
          name: 'thumbnail.jpeg',
          type: thumb.mime,
        });
      })
      .catch(err => console.log({err}));
    setIsPhoto(false);
  }, []);

  const onChangeVideoFile = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(createVideoThumbnail);
  }, [createVideoThumbnail]);

  const onFileUpload = useCallback(async () => {
    if (!image && !video) {
      Alert.alert('알림', '파일을 업로드 해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('description', description);

    if (isPhoto) {
      formData.append('photo', {
        name: image!.name,
        type: image!.type,
        uri: image!.uri,
      });
    } else {
      formData.append('video', {
        name: video!.name,
        type: video!.type,
        uri: video!.uri,
      });

      formData.append('photo', {
        name: thumbnail?.name,
        type: thumbnail?.type,
        uri: thumbnail?.uri,
      });
    }

    try {
      console.log('테스트 로깅');
      const response = await axios.post(
        'https://maicosmos.com/RN/image.php',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );

      Alert.alert('알림:', '이미지/동영상 업로드 완료!');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      // setPhoto(null);
      // navigate to Settings.tsx
      navigation.navigate('SettingsStackScreen', {
        screen: 'Settings',
      });
      setTitle('');
      setDescription('');
    }
  }, [
    description,
    image,
    isPhoto,
    name,
    navigation,
    thumbnail?.name,
    thumbnail?.type,
    thumbnail?.uri,
    title,
    userId,
    video,
  ]);
  return (
    <DismissKeyboardView>
      <SafeAreaView>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 20,
          }}>
          {isPhoto ? (
            <TouchableOpacity onPress={onChangeImageFile}>
              <View style={styles.imageView}>
                <ImageBackground
                  source={{
                    uri: imageBackGroundURI,
                  }}
                  style={{height: 300, width: 300}}
                  imageStyle={{borderRadius: 15}}>
                  <View style={styles.cameraIconView}>
                    <Icon
                      name="camera"
                      size={50}
                      color="#fff"
                      style={styles.cameraIcon}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          ) : (
            <Video
              source={{uri: video.uri}}
              style={{width: 300, height: 300, alignSelf: 'center'}}
            />
          )}
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity style={styles.tag} onPress={onChangeImageFile}>
              <Text>이미지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tag} onPress={onChangeVideoFile}>
              <Text>동영상</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.tag} onPress={onFileUpload}>
            <Text>업로드</Text>
          </TouchableOpacity>
        </View>
        {/* <Button title="이미지 선택" onPress={onChangeImageFile} />
      <Button title="동영상 선택" onPress={onChangeVideoFile} /> */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>작품 제목</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeTitle}
            placeholder="예) 별이 빛나는 밤"
            placeholderTextColor="#666"
            value={title}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={titleRef}
            onSubmitEditing={() => descriptionRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>작품 설명</Text>
          <TextInput
            style={styles.textInput}
            placeholder="예) 빈센트 반 고흐의 가장 널리 알려진 작품"
            placeholderTextColor="#666"
            onChangeText={onChangeDescription}
            value={description}
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={descriptionRef}
            onSubmitEditing={onFileUpload}
          />
        </View>
      </SafeAreaView>
    </DismissKeyboardView>
  );
}

export default ImageUpload;

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  cameraIcon: {
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  cameraIconView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: 300,
    width: 300,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    // backgroundColor: SOCIAL_BLUE,
    borderColor: '#727477',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
