import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const numColumns = 3;

const formatData = (data, numColumns) => {
  let numberOfElementsLastRow = data.length % 3;
  let cnt = 0;

  while (
    numberOfElementsLastRow !== 0 &&
    numberOfElementsLastRow !== numColumns
  ) {
    data.push({
      key: 'blank' + cnt,
      empty: true,
    });
    numberOfElementsLastRow++;
    cnt++;
  }

  return data;
};

function PersonalGallery({navigation: {navigate}, route}) {
  const [galleryId, setGalleryId] = useState(route.params.galleryId);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const response = await axios.post(
          'https://maicosmos.com/RN/personalGallery.php',
          {
            id: galleryId,
          },
        );
        setImages(response.data.image);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getGalleryImages();
  }, [galleryId]);

  const renderItem = ({item}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <Image style={styles.personalImage} source={{uri: item.url}} />
      </View>
    );
  };

  return (
    <FlatList
      data={formatData(images, numColumns)}
      renderItem={renderItem}
      numColumns={3}
      key={3}
    />
  );
}

export default PersonalGallery;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  personalImage: {
    width: '100%',
    height: Dimensions.get('window').width / numColumns,
  },
});
