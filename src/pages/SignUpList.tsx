import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';

type SignUpListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpList'
>;

function SignUpList({navigation}: SignUpListScreenProps) {
  const onDevelopment = useCallback(() => {
    Alert.alert('알림', '개발중인 기능입니다.');
  }, []);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <SafeAreaView style={{alignItems: 'center', backgroundColor: '#fff'}}>
      <Image
        style={styles.signInImage}
        source={require('../../assets/image/sign_logo.png')}
      />
      <TouchableOpacity
        style={[styles.socialBtn, styles.maicosmos]}
        onPress={toSignUp}>
        <Image
          style={styles.socialIcon}
          source={require('../../assets/image/google_logo.png')}
        />
        <Text style={[styles.socialText, styles.whiteText]}>
          마이코스모스로 가입하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialBtn, styles.google]}
        onPress={onDevelopment}>
        <Image
          style={styles.socialIcon}
          source={require('../../assets/image/google_logo.png')}
        />
        <Text style={styles.socialText}>Google로 가입하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialBtn, styles.kakao]}
        onPress={onDevelopment}>
        <Image
          style={styles.socialIcon}
          source={require('../../assets/image/kakao_logo.png')}
        />
        <Text style={styles.socialText}>카카오로 가입하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialBtn, styles.naver]}
        onPress={onDevelopment}>
        <Image
          style={styles.socialIcon}
          source={require('../../assets/image/naver_logo.png')}
        />
        <Text style={[styles.socialText, styles.whiteText]}>
          네이버로 가입하기
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: '5%',
  },
  maicosmos: {
    backgroundColor: '#AA74FF',
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
  whiteText: {
    color: '#FFFFFF',
  },
});

export default SignUpList;
