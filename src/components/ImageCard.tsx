
import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Dimensions } from 'react-native';
import { ImageInfo } from '../store/imagesSlice';
import Icon from 'react-native-vector-icons/Feather';

interface ImageCardProps {
  image: ImageInfo;
  selected: boolean;
  onSelect: () => void;
  selectionMode: 'single' | 'multiple';
}

const { width } = Dimensions.get('window');
const cardSize = (width - 48) / 2; // 2 columns with 16px padding and 16px gap

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  selected, 
  onSelect, 
  selectionMode
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        selected ? styles.selected : null
      ]}
      onPress={onSelect}
    >
      <Image 
        source={{ uri: image.url }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {selected && (
        <View style={styles.checkmark}>
          <Icon name="check" size={16} color="white" />
        </View>
      )}
      
      <View style={[
        styles.overlay,
        selected && styles.overlaySelected
      ]} />
      
      {image.uploadProgress !== undefined && image.uploadProgress < 100 && (
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${image.uploadProgress}%` }
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: cardSize,
    height: cardSize,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  overlaySelected: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#e5e7eb',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  }
});

export default ImageCard;
