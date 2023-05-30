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
  const [height, setHeight] = useState(0);
  const [height2, setHeight2] = useState(0);

  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      <DismissKeyboardView>
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../assets/image/smallLogo.png')}
            />
            <View style={{flex: 1}}>
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
                    width: 350,
                    marginHorizontal: 10,
                    borderRadius: 20,
                    backgroundColor: '#f5f5f5',
                    fontSize: 15,
                    color: '#111',
                    paddingLeft: 40,
                    // padding: 0,
                  }}
                  placeholderTextColor={'#757575'}
                  placeholder="다른 학교들과 소통해 보세요!"
                />
              </View>
            </View>
          </View>
          <Swiper
            style={styles.mainSwiper}
            activeDotColor="#3B3E44"
            dotColor="#dbdde0"
            autoplay={true}
            autoplayTimeout={4}>
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
          <View style={{padding: 20}}>
            <Image
              style={{width: '100%', height: undefined, aspectRatio: 786 / 648}}
              source={require('../../assets/image/intro.png')}
            />
          </View>
          <View style={(styles.container, {marginHorizontal: 10})}>
            <Text
              style={{
                fontSize: 21,
                fontWeight: 'bold',
                marginTop: 50,
                marginBottom: 30,
                marginLeft: 10,
                color: '#111',
              }}>
              이달의 작품들
            </Text>
            <View style={{flexDirection: 'column'}}>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 0}}>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image01.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>소풍</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image02.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>집</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image03.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>우리 가족</Text>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 30}}>
                <View style={{flex: 1}}>
                  <View style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image04.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>강아지</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image05.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>무당벌레</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        height,
                        width: height,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/image06.png')}
                    />
                  </View>
                  <Text style={styles.imageText}>버스</Text>
                </View>
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
          <View
            style={
              (styles.container, {marginHorizontal: 10, marginBottom: 50})
            }>
            <Text
              style={{
                fontSize: 21,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 30,
                marginLeft: 10,
              }}>
              새로운 프랍 출시
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column', marginBottom: 0}}>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 582,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop1-1.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 536,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop1-2.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 386,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop1-3.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 386,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop1-4.png')}
                    />
                  </View>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'column', marginBottom: 0}}>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 380,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop2-1.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 528,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop2-2.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 482,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop2-3.png')}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    onLayout={e => setHeight2(e.nativeEvent.layout.width)}
                    style={{margin: 10}}>
                    <Image
                      style={{
                        flex: 1,
                        width: height2,
                        height: undefined,
                        aspectRatio: 386 / 528,
                        borderRadius: 10,
                      }}
                      source={require('../../assets/image/prop2-4.png')}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageText: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
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
    fontSize: 21,
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
