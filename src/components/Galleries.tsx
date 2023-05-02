import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function Galleries(props) {
  const galleries = props.galleries;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.tabTitle}>
        <Text style={styles.tabTitleText}>학급 갤러리</Text>
      </View>
      {galleries.length !== 0 ? (
        <View style={{paddingHorizontal: 20}}>
          {galleries.map(gallery => (
            <TouchableOpacity key={gallery.key} style={{marginBottom: 20}}>
              <Image
                style={styles.groupGallery}
                source={{uri: 'https://www.maicosmos.com' + gallery.thumbnail}}
              />
              <View style={{alignItems: 'center'}}>
                <Text style={styles.galleryNameText}>{gallery.name}</Text>
                <Text style={styles.galleryOwnerText}>{gallery.owner}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>학급 갤러리가 없습니다</Text>
        </View>
      )}
    </ScrollView>
  );
}

export default Galleries;

const styles = StyleSheet.create({
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
});
