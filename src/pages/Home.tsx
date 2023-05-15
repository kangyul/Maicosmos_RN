import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import ArtWork from '../components/Artwork';
import Prop from '../components/Prop';
import DismissKeyboardView from '../components/DismissKeyboardView';

function Home() {
  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      <DismissKeyboardView>
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../assets/image/smallLogo.png')}
            />
            <View style={{left: 0, right: 0}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/image/search.png')}
                  style={{
                    height: 25,
                    width: 25,
                    position: 'absolute',
                    zIndex: 3,
                    left: 20,
                  }}
                />
                <TextInput
                  style={{
                    height: 35,
                    width: '92%',
                    marginHorizontal: 10,
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    backgroundColor: '#f1f2f5',
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#000',
                    paddingLeft: 40,
                  }}
                  placeholderTextColor={'#aaa'}
                  placeholder="다른 학교들과 소통해 보세요!"
                />
              </View>
            </View>
          </View>
          <Swiper style={styles.mainSwiper} activeDotColor="black">
            <View>
              <Image
                style={styles.mainImage}
                source={require('../../assets/image/background01.png')}
              />
            </View>
            <View>
              <Image
                style={styles.mainImage}
                source={require('../../assets/image/background02.png')}
              />
            </View>
            <View>
              <Image
                style={styles.mainImage}
                source={require('../../assets/image/background03.png')}
              />
            </View>
            <View>
              <Image
                style={styles.mainImage}
                source={require('../../assets/image/background04.png')}
              />
            </View>
            <View>
              <Image
                style={styles.mainImage}
                source={require('../../assets/image/background05.png')}
              />
            </View>
          </Swiper>
          <View style={(styles.container, {marginHorizontal: 10})}>
            <Text
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                marginTop: 50,
                marginBottom: 30,
                marginLeft: 10,
              }}>
              이달의 작품들
            </Text>
            <View style={{flexDirection: 'column'}}>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 0}}>
                <ArtWork backgroundColor="#B5EAEA" />
                <ArtWork backgroundColor="lightblue" />
                <ArtWork backgroundColor="#EDF6E5" />
              </View>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 0}}>
                <ArtWork backgroundColor="#FFBCBC" />
                <ArtWork backgroundColor="#F38BA0" />
                <ArtWork backgroundColor="white" />
              </View>
            </View>
          </View>
          <View
            style={
              (styles.container, {marginHorizontal: 10, marginBottom: 50})
            }>
            <Text
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                marginTop: 50,
                marginBottom: 30,
                marginLeft: 10,
              }}>
              새로운 프랍 출시
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column', marginBottom: 0}}>
                <Prop backgroundColor="#F9F7F7" height="300" />
                <Prop backgroundColor="lightblue" height="150" />
              </View>
              <View style={{flex: 1, flexDirection: 'column', marginBottom: 0}}>
                <Prop backgroundColor="#3F72AF" height="150" />
                <Prop backgroundColor="#112D4E" height="150" />
              </View>
            </View>
          </View>
          {/* <View style={styles.container}>
          <Text style={styles.title}>이달의 작품들</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                width: 150,
                height: 150,
                marginRight: 15,
                borderRadius: 8,
                backgroundColor: '#19376D',
              }}
            />
            <View
              style={{
                width: 150,
                height: 150,
                marginRight: 15,
                borderRadius: 8,
                backgroundColor: '#576CBC',
              }}
            />
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 8,
                backgroundColor: '#A5D7E8',
              }}
            />
          </ScrollView>
        </View> */}
        </ScrollView>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainSwiper: {
    height: 360,
  },
  mainImage: {
    width: '100%',
    height: 300,
    marginBottom: 40,
    backgroundColor: '#B2A4FF',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  container: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  containerImg: {
    width: 200,
    height: 200,
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: '#A0D8B3',
  },
});

export default Home;
