import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';

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
        console.log('uri 로깅' + response.data.image[0].url);
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      }
    };
    getGalleryImages();
  }, [galleryId]);

  return (
    <View>
      {images.map(image => (
        <Image
          key={image.key}
          source={{uri: image.url}}
          style={{width: 100, height: 100}}
        />
      ))}
    </View>
  );
}

export default PersonalGallery;

const styles = StyleSheet.create({});
