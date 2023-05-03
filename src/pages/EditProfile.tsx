import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Edit({navigation}) {
  const dispatch = useAppDispatch();

  const idDefault = useSelector((state: RootState) => state.user.id);
  const nickDefault = useSelector((state: RootState) => state.user.nick);
  const aboutDefault = useSelector((state: RootState) => state.user.desc);
  const imgDefault = useSelector((state: RootState) => state.user.img);

  const [loading, setLoading] = useState(false);
  const [nick, setNick] = useState(nickDefault);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [about, setAbout] = useState(aboutDefault);
  const passwordRef = useRef<TextInput | null>(null);
  const password2Ref = useRef<TextInput | null>(null);
  const nickRef = useRef<TextInput | null>(null);

  const [profilePic, setProfileImage] = useState(imgDefault);

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onChangePassword2 = useCallback(text => {
    setPassword2(text.trim());
  }, []);
  const onChangeNick = useCallback(text => {
    setNick(text.trim());
  }, []);
  const onChangeAbout = useCallback(text => {
    setAbout(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    if (password !== password2) {
      Alert.alert('알림', '패스워드가 일치하지 않습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', idDefault);
    formData.append('password', password);
    formData.append('nick', nick);
    formData.append('about', about);

    if (image) {
      formData.append('photo', {
        name: image!.name,
        type: image!.type,
        uri: image!.uri,
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://maicosmos.com/RN/editUserInfo.php',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );

      dispatch(userSlice.actions.setNick(response.data.nick));
      dispatch(userSlice.actions.setImg(response.data.img));
      dispatch(userSlice.actions.setDesc(response.data.about));

      console.log('바뀐 닉네임: ' + nickDefault);

      Alert.alert('알림', response.data.message);

      navigation.goBack(); // \프로필 페이지로 이동하기
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [
    about,
    dispatch,
    idDefault,
    image,
    loading,
    navigation,
    nick,
    nickDefault,
    password,
    password2,
  ]);

  const canGoNext = password && nick && password2;

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      256,
      256,
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

      setProfileImage(r.uri);
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

  return (
    <DismissKeyboardView style={styles.backGround}>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity onPress={onChangeImageFile}>
          <View
            style={{
              height: 200,
              width: 200,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={{
                uri: profilePic,
              }}
              style={{height: 200, width: 200}}
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
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="닉네임"
          placeholderTextColor="#666"
          onChangeText={onChangeNick}
          value={nick}
          textContentType="nickname"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nickRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={{paddingHorizontal: 20, paddingVertical: 5}}>
        <TextInput
          style={styles.textInput}
          placeholder="자기소개 글"
          placeholderTextColor="#666"
          clearButtonMode="while-editing"
          value={about}
          onChangeText={onChangeAbout}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호"
          placeholderTextColor="#666"
          onChangeText={onChangePassword}
          value={password}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          secureTextEntry={true}
          textContentType="oneTimeCode"
          blurOnSubmit={false}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={() => password2Ref.current?.focus()}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호 확인"
          placeholderTextColor="#666"
          onChangeText={onChangePassword2}
          value={password2}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          secureTextEntry={true}
          textContentType="oneTimeCode"
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={password2Ref}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="blue" />
          ) : (
            <Text style={styles.loginButtonText}>정보수정</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

export default Edit;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#fff',
  },
  textInput: {
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(224, 224, 224, 1)',
    height: 50,
    fontSize: 15,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
    width: '90%',
  },
  loginButtonActive: {
    backgroundColor: 'rgba(0, 196, 255, 1)',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  cameraIconView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
});
