import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function Galleries(props) {
  const [galleries, setGalleries] = useState([]);
  const [temp, setTemp] = useState([]);
  const [gallerySet, setGallerySet] = useState([]);
  const galleryCnt = props.galleries.length;

  const [activeTagIndex, setActiveTagIndex] = useState(0);

  const _renderItem = ({item, index}) => {
    return (
      <Pressable
        style={[styles.tag, activeTagIndex === index && styles.activeTag]}
        onPress={() => {
          setActiveTagIndex(index);
          if (gallerySet[index] === '전체') {
            setGalleries([...temp]);
          } else {
            setGalleries(
              temp.filter(gallery => gallery.date.includes(gallerySet[index])),
            );
          }
        }}
        key={index}>
        <Text
          style={[
            styles.tagText,
            activeTagIndex === index && styles.activeText,
          ]}>
          {gallerySet[index]}
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    setGalleries(props.galleries);
    setTemp(props.galleries);
    setGallerySet(props.gallerySet);
  }, [props.galleries, props.gallerySet]);

  return (
    <View style={styles.backGround}>
      <ScrollView>
        <FlatList
          data={gallerySet}
          renderItem={_renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{padding: 20}}
          // keyExtractor={item => item.key}
        />
        {galleryCnt > 0
          ? galleries.map(gallery => (
              <View key={gallery.key}>
                <TouchableOpacity
                // onPress={() =>
                //   navigate('PersonalGallery', {galleryId: gallery.key})
                // }
                >
                  <Image
                    style={styles.personalGallery}
                    source={{
                      uri: 'https://www.maicosmos.com' + gallery.thumbnail,
                    }}
                  />
                </TouchableOpacity>
                <View style={styles.galleryInfoContainer}>
                  <Text style={styles.galleryTitle}>{gallery.name}</Text>
                  <Text style={styles.galleryDate}>{gallery.date}</Text>
                </View>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
}

export default Galleries;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#fff',
  },
  personalGallery: {
    width: '100%',
    height: 240,
  },
  galleryInfoContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  galleryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  galleryDate: {
    fontSize: 16,
    color: '#aaa',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  galleryNameText: {
    fontWeight: 'bold',
  },
  galleryOwnerText: {},
  scrollView: {
    width: '100%',
    height: '100%',
  },
  tabTitle: {
    alignContent: 'flex-end',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  tabTitleText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  groupGallery: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    marginBottom: 10,
  },
  tag: {
    // backgroundColor: SOCIAL_BLUE,
    borderColor: '#727477',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTag: {
    backgroundColor: '#111',
  },
  activeText: {
    color: '#fff',
  },
});
