import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

function Edit({navigation}) {
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

    try {
      setLoading(true);
      const response = await axios.post(
        'https://maicosmos.com/RN/editUserInfo.php',
        {
          userId: idDefault,
          password: password,
          nick: nick,
        },
      );

      dispatch(userSlice.actions.setNick(response.data.nick));

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
  }, [idDefault, loading, navigation, nick, password, password2]);

  const canGoNext = password && nick && password2;

  return (
    <DismissKeyboardView style={styles.backGround}>
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
  signInImage: {
    width: 124,
    height: 124,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: '5%',
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
