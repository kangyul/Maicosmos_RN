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
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

import {
  login,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import ResultView from '../components/IntroView';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const idRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  // 카카오 결과 확인
  const [result, setResult] = useState<string>('');

  // 카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      // setResult(JSON.stringify(token));
      const profile = await getKakaoProfile();
      const provider = 'kakao';
      const identifier = profile.id;

      try {
        setLoading(true);
        const response = await axios.post(
          'https://maicosmos.com/RN/socialLogin.php',
          {
            provider,
            identifier,
          },
        );
        Alert.alert('알림', '로그인 되었습니다.');
        dispatch(
          userSlice.actions.setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            desc: response.data.desc,
            nick: response.data.nick,
            accessToken: response.data.accessToken,
            img: response.data.img,
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

      // setResult(JSON.stringify(profile));
    } catch (err) {
      console.error('login err', err);
    }
  };

  const onDevelopment = useCallback(text => {
    Alert.alert('알림', '개발중인 기능입니다.');
  }, []);

  const onChangeId = useCallback(text => {
    setUserId(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!userId || !userId.trim()) {
      return Alert.alert('알림', '아이디를 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post('https://maicosmos.com/RN/login.php', {
        userId,
        password,
      });
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          desc: response.data.desc,
          nick: response.data.nick,
          accessToken: response.data.accessToken,
          img: response.data.img,
        }),
      );
      console.log(response.data.refreshToken);
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
  }, [loading, dispatch, userId, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = userId && password;
  return (
    <DismissKeyboardView style={styles.backGround}>
      <Image
        style={styles.signInImage}
        source={require('../../assets/image/sign_logo.png')}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeId}
          placeholder="아이디"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          autoComplete="username"
          textContentType="username"
          value={userId}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={idRef}
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
            <Text style={styles.loginButtonText}>로그인하기</Text>
          )}
        </Pressable>
        <View style={styles.optionZone}>
          <Pressable style={styles.searchPressable} onPress={onDevelopment}>
            <Text style={styles.searchText}>비밀번호 찾기</Text>
          </Pressable>
          <Pressable style={styles.searchPressable} onPress={onDevelopment}>
            <Text style={styles.searchText}>아이디 찾기</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text style={styles.signUpText}>회원가입 </Text>
          </Pressable>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            width: '90%',
            marginVertical: 20,
            borderColor: 'rgba(218, 218, 218, 1)',
          }}></View>
        <TouchableOpacity
          style={[styles.socialBtn, styles.google]}
          onPress={onDevelopment}>
          <Image
            style={styles.socialIcon}
            source={require('../../assets/image/google_logo.png')}
          />
          <Text style={styles.socialText}>Google로 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, styles.kakao]}
          onPress={() => {
            signInWithKakao();
          }}>
          <Image
            style={styles.socialIcon}
            source={require('../../assets/image/kakao_logo.png')}
          />
          <Text style={styles.socialText}>카카오로 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, styles.naver]}
          onPress={onDevelopment}>
          <Image
            style={styles.socialIcon}
            source={require('../../assets/image/naver_logo.png')}
          />
          <Text style={[styles.socialText, styles.naverText]}>
            네이버로 시작하기
          </Text>
        </TouchableOpacity>
        <ResultView result={result} />
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
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(224, 224, 224, 1)',
    height: 50,
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#AA74FF',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionZone: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  signUpText: {
    color: '#AA74FF',
    fontSize: 15,
    fontWeight: '500',
  },
  searchPressable: {
    borderRightWidth: 1,
    borderColor: 'rgba(218, 218, 218, 1)',
    paddingRight: 20,
    marginRight: 20,
  },
  searchText: {
    marginRight: 0,
    color: '#757575',
    fontSize: 15,
    fontWeight: '500',
  },
  signInImage: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginTop: '30%',
    marginBottom: '5%',
  },
  google: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(218, 218, 218, 1)',
  },
  kakao: {
    backgroundColor: '#F9E000',
  },
  naver: {
    backgroundColor: '#19CE60',
  },
  socialIcon: {
    alignSelf: 'center',
    width: 20,
    height: 20,
    position: 'absolute',
    left: 20,
  },
  socialBtn: {
    borderRadius: 5,
    height: 50,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialText: {
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
  },
  naverText: {
    color: '#FFFFFF',
  },
});

export default SignIn;
