
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { updateUploadProgress, setUploadStatus } from '../store/imagesSlice';
import Icon from 'react-native-vector-icons/Feather';
import firebase from '../lib/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

interface UploadImagesProps {
  navigation: any;
}

const UploadImages: React.FC<UploadImagesProps> = ({ navigation }) => {
  const { galleryImages, selectedImages, currentFilter } = useAppSelector(state => state.images);
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const selectedImageObjects = galleryImages.filter(img => selectedImages.includes(img.id));

  const uploadToFirebase = async () => {
    if (selectedImageObjects.length === 0) return;
    
    setUploading(true);
    
    try {
      const storage = getStorage(firebase);
      const db = getFirestore(firebase);
      
      for (const image of selectedImageObjects) {
        try {
          // Convert image URI to blob
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          // Create a storage reference
          const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
          
          // Upload the file
          const uploadTask = uploadBytesResumable(storageRef, blob);
          
          // Listen for upload state changes
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              dispatch(updateUploadProgress({ id: image.id, progress }));
            }, 
            (error) => {
              console.error('Upload error:', error);
              dispatch(setUploadStatus({ id: image.id, status: 'error', error: error.message }));
            }, 
            async () => {
              // Upload completed successfully
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Add a document to Firestore
              await addDoc(collection(db, 'images'), {
                url: downloadURL,
                name: image.name,
                description: image.description || '',
                filter: currentFilter,
                createdAt: new Date().toISOString()
              });
              
              dispatch(setUploadStatus({ id: image.id, status: 'success' }));
            }
          );
        } catch (error) {
          console.error('Error processing image:', error);
          dispatch(setUploadStatus({ id: image.id, status: 'error', error: 'Failed to process image' }));
        }
      }
      
      // Set upload complete when all are done
      setUploadComplete(true);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const navigateToGallery = () => {
    navigation.navigate('Index');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Upload Images</Text>
        <Text style={styles.subtitle}>Review your selection before uploading</Text>
        
        <View style={styles.imagesGrid}>
          {selectedImageObjects.map(image => (
            <View key={image.id} style={styles.imageContainer}>
              <Image 
                source={{ uri: image.url }} 
                style={styles.image}
                resizeMode="cover"
              />
              
              {image.uploadProgress !== undefined && (
                <View style={styles.progressWrapper}>
                  <View style={styles.progressContainer}>
                    <View 
                      style={[
                        styles.progressBar,
                        { width: `${image.uploadProgress}%` }
                      ]}
                    />
                  </View>
                  
                  <Text style={styles.progressText}>
                    {image.uploadStatus === 'error' ? 'Error' : 
                     image.uploadStatus === 'success' ? 'Complete' : 
                     `${Math.round(image.uploadProgress)}%`}
                  </Text>
                  
                  {image.uploadStatus === 'success' && (
                    <Icon name="check-circle" size={16} color="#10b981" style={styles.statusIcon} />
                  )}
                  
                  {image.uploadStatus === 'error' && (
                    <Icon name="alert-circle" size={16} color="#ef4444" style={styles.statusIcon} />
                  )}
                </View>
              )}
              
              {image.description && (
                <Text style={styles.imageDescription} numberOfLines={2}>
                  {image.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {!uploadComplete ? (
          <TouchableOpacity 
            style={[styles.uploadButton, uploading && styles.uploadingButton]}
            onPress={uploadToFirebase}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="white" size="small" style={styles.buttonIcon} />
            ) : (
              <Icon name="upload-cloud" size={20} color="white" style={styles.buttonIcon} />
            )}
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload to Firebase'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={navigateToGallery}
          >
            <Icon name="check" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.uploadButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  progressWrapper: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    width: 50,
    textAlign: 'right',
  },
  statusIcon: {
    marginLeft: 4,
  },
  imageDescription: {
    fontSize: 12,
    color: '#4b5563',
    padding: 8,
    paddingTop: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingButton: {
    backgroundColor: '#93c5fd',
  },
  doneButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  }
});

export default UploadImages;
