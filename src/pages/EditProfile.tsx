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

function Edit({navigation, route}) {
  const {profImg} = route.params;

  const dispatch = useAppDispatch();

  const idDefault = useSelector((state: RootState) => state.user.id);
  const nameDefault = useSelector((state: RootState) => state.user.name);
  const emailDefault = useSelector((state: RootState) => state.user.email);
  const nickDefault = useSelector((state: RootState) => state.user.nick);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(emailDefault);
  const [id, setId] = useState(idDefault);
  const [name, setName] = useState(nameDefault);
  const [nick, setNick] = useState(nickDefault);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const idRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const password2Ref = useRef<TextInput | null>(null);
  const nickRef = useRef<TextInput | null>(null);

  const [profilePic, setProfileImage] = useState(profImg);
  const [preview, setPreview] = useState<{uri: string}>();

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangeId = useCallback(text => {
    setId(text.trim());
  }, []);
  const onChangeName = useCallback(text => {
    setName(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onChangePassword2 = useCallback(text => {
    setPassword2(text.trim());
  }, []);
  const onChangeNick = useCallback(text => {
    setNick(text.trim());
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
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={{
                uri: profilePic,
              }}
              style={{height: 100, width: 100}}
              imageStyle={{borderRadius: 15}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="camera"
                  size={35}
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
      {/* <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일"
          placeholderTextColor="#666"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => idRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeId}
          placeholder="아이디"
          placeholderTextColor="#666"
          textContentType="username"
          value={id}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={idRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
          editable={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="이름"
          placeholderTextColor="#666"
          onChangeText={onChangeName}
          value={name}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
          onSubmitEditing={() => nickRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View> */}
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
});
