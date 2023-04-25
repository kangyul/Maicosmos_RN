import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  Alert,
  Image,
  Text,
  StyleSheet,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  ImageBackground,
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

function ImageUpload() {
  const [isPhoto, setIsPhoto] = useState(true);
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
  }, []);

  const onChangeVideoFile = useCallback(() => {
    setIsPhoto(false);
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
      const response = await axios.post(
        'https://maicosmos.com/RN/image.php',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );

      console.log('파일 이름: ' + response.data.name);

      Alert.alert('알림:', '이미지/동영상 업로드 완료!');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      // setPhoto(null);
    }
  }, [
    image,
    isPhoto,
    name,
    thumbnail?.name,
    thumbnail?.type,
    thumbnail?.uri,
    userId,
    video,
  ]);
  return (
    <DismissKeyboardView>
      {(image || video) && (
        <React.Fragment>
          {isPhoto ? (
            <Image
              source={{uri: image.uri}}
              style={{width: 300, height: 300, alignSelf: 'center'}}
            />
          ) : (
            <Video
              source={{uri: video.uri}}
              style={{width: 300, height: 300, alignSelf: 'center'}}
            />
          )}
          <Button title="Upload" onPress={onFileUpload} />
        </React.Fragment>
      )}
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity onPress={onChangeImageFile}>
          <View
            style={{
              height: 300,
              width: 300,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={{
                uri: 'https://www.maicosmos.com/g5/data/member_image/yu/yulkang.gif?1682394385',
              }}
              style={{height: 300, width: 300}}
              imageStyle={{borderRadius: 15}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="camera"
                  size={50}
                  color="#fff"
                  style={{
                    opacity: 0.7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 10,
                  }}
                />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>
      {/* <Button title="이미지 선택" onPress={onChangeImageFile} />
      <Button title="동영상 선택" onPress={onChangeVideoFile} /> */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>작품제목</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeTitle}
          placeholder="작품제목"
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
        <Text style={styles.label}>작품설명</Text>
        <TextInput
          style={styles.textInput}
          placeholder="작품설명"
          placeholderTextColor="#666"
          onChangeText={onChangeDescription}
          value={description}
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={descriptionRef}
          onSubmitEditing={onFileUpload}
        />
      </View>
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
});
