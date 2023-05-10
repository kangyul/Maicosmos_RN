import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
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
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!id || !id.trim()) {
      return Alert.alert('알림', '아이디를 입력해주세요.');
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (password.trim() !== password2.trim()) {
      return Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    console.log(email, name, password, id, nick);
    try {
      setLoading(true);
      // http 메서드: get, put, patch, post, delete, head, options
      const response = await axios.post('https://maicosmos.com/RN/user.php', {
        email,
        id,
        name,
        nick,
        password,
        password2,
      });
      console.log('아이디:' + response.data.id);
      console.log('이름:' + response.data.name);
      Alert.alert('알림:', '회원가입 되었습니다.');
      navigation.navigate('SignIn');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigation, loading, email, id, name, nick, password, password2]);

  const canGoNext = email && id && name && password && nick && password2;
  return (
    <DismissKeyboardView style={styles.backGround}>
      <Image
        style={styles.signInImage}
        source={require('../../assets/image/sign_logo.png')}
      />
      <View style={styles.inputWrapper}>
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
            <Text style={styles.loginButtonText}>회원 가입하기</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

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
    fontSize: 16,
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
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default SignUp;
