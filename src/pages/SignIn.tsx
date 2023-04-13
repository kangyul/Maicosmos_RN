import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '아이디를 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post('https://maicosmos.com/RN/login.php', {
        email,
        password,
      });
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.name,
          email: response.data.email,
          accessToken: response.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.refreshToken,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = email && password;
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
          placeholder="아이디"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          onChangeText={onChangePassword}
          value={password}
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
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
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>아이디로 로그인</Text>
          )}
        </Pressable>
        <View style={styles.optionZone}>
          <Pressable style={styles.searchPressable}>
            <Text style={styles.searchText}>비밀번호 찾기</Text>
          </Pressable>
          <Pressable style={styles.searchPressable}>
            <Text style={styles.searchText}>아이디 찾기</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text style={styles.signUpText}>회원가입 </Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

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
    paddingVertical: 8,
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
  optionZone: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'rgba(0, 196, 255, 1)',
    fontSize: 15,
    fontWeight: '500',
  },
  searchPressable: {
    borderRightWidth: 1,
    borderColor: 'rgba(218, 218, 218, 1)',
    paddingRight: 10,
    marginRight: 10,
  },
  searchText: {
    marginRight: 0,
    color: '#757575',
    fontSize: 15,
    fontWeight: '500',
  },
  signInImage: {
    width: 124,
    height: 124,
    alignSelf: 'center',
    marginTop: '30%',
    marginBottom: '5%',
  },
});

export default SignIn;
