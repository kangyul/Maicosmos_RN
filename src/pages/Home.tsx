import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';

function Home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{margin: 20}}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../assets/image/smallLogo.png')}
          />
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
        <View style={styles.container}>
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
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>새로운 프랍 출시</Text>
          <Swiper style={{height: 300}}>
            <Image source={require('../../assets/image/props01.png')} />
            <Image source={require('../../assets/image/props02.png')} />
            <Image source={require('../../assets/image/props03.png')} />
            <Image source={require('../../assets/image/props04.png')} />
          </Swiper>
        </View>
      </ScrollView>
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
