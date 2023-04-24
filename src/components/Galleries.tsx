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
      <View style={{paddingHorizontal: 20}}>
        {galleries.map(gallery => (
          <TouchableOpacity>
            <Image
              key={gallery.key}
              style={styles.groupGallery}
              source={{uri: gallery.thumbnail}}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default Galleries;

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  tabTitle: {
    alignContent: 'flex-end',
    marginVertical: 20,
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
    marginBottom: 20,
  },
});
