
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setGalleryImages, selectImage } from '../store/imagesSlice';
import { ImageInfo } from '../store/imagesSlice';
import ImageCard from './ImageCard';
import Icon from 'react-native-vector-icons/Feather';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid, Platform } from 'react-native';

interface ImageGalleryProps {
  navigation: any;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { galleryImages, selectedImages, multiSelectMode } = useAppSelector(state => state.images);
  const [loadingImages, setLoadingImages] = useState(true);

  const requestPhotoPermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    
    try {
      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Load images from device
  useEffect(() => {
    const loadImages = async () => {
      try {
        const hasPermission = await requestPhotoPermission();
        
        if (hasPermission) {
          const result = await CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
          });
          
          const deviceImages: ImageInfo[] = result.edges.map((edge, index) => ({
            id: `img-${index}`,
            url: edge.node.image.uri,
            name: `Image ${index + 1}`,
            selected: false
          }));
          
          dispatch(setGalleryImages(deviceImages));
        } else {
          console.log('Permission denied');
          // For demo purposes, fall back to mock data if permission is denied
          const mockImages: ImageInfo[] = Array.from({ length: 20 }, (_, i) => ({
            id: `img-${i}`,
            url: `https://source.unsplash.com/random/400x400?sig=${i}`,
            name: `Image ${i + 1}`,
            selected: false
          }));
          
          dispatch(setGalleryImages(mockImages));
        }
        
        setLoadingImages(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoadingImages(false);
      }
    };
    
    loadImages();
  }, [dispatch]);

  const handleImageSelect = (id: string) => {
    dispatch(selectImage(id));
  };

  const handleNextStep = () => {
    if (selectedImages.length === 0) {
      // Handle case when no images selected
      console.log('No images selected');
      return;
    }
    navigation.navigate('Edit');
  };

  const renderItem = ({ item }: { item: ImageInfo }) => (
    <ImageCard
      image={item}
      selected={selectedImages.includes(item.id)}
      onSelect={() => handleImageSelect(item.id)}
      selectionMode={multiSelectMode ? 'multiple' : 'single'}
    />
  );

  return (
    <View style={styles.container}>
      {loadingImages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your photos...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={galleryImages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
          />
          
          {selectedImages.length > 0 && (
            <View style={styles.selectionFooter}>
              <View style={styles.selectionInfo}>
                <View style={styles.checkCircle}>
                  <Icon name="check" size={20} color="white" />
                </View>
                <Text style={styles.selectionText}>
                  {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNextStep}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="chevron-right" size={16} color="white" style={styles.nextIcon} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#4b5563',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 80, // Extra padding for footer
  },
  selectionFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionText: {
    marginLeft: 12,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  nextIcon: {
    marginLeft: 8,
  }
});

export default ImageGallery;
