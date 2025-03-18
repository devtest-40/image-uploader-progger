
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { ImageInfo, setCurrentFilter, setImageDescription } from '../store/imagesSlice';
import Icon from 'react-native-vector-icons/Feather';

interface EditImageProps {
  navigation: any;
}

const FILTERS = [
  { id: 'none', name: 'Normal', style: {} },
  { id: 'grayscale', name: 'Grayscale', style: { filter: 'grayscale(1)' } },
  { id: 'sepia', name: 'Sepia', style: { filter: 'sepia(1)' } },
  { id: 'invert', name: 'Invert', style: { filter: 'invert(1)' } },
  { id: 'blur', name: 'Blur', style: { filter: 'blur(4px)' } },
  { id: 'brightness', name: 'Bright', style: { filter: 'brightness(1.5)' } },
];

const EditImage: React.FC<EditImageProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { galleryImages, selectedImages, currentFilter } = useAppSelector(state => state.images);
  const [activeTab, setActiveTab] = useState('info');
  const [imageInfo, setImageInfo] = useState<{title: string, description: string}>({
    title: '',
    description: ''
  });

  // Get selected image objects
  const selectedImageObjects = galleryImages.filter(img => selectedImages.includes(img.id));

  const handleFilterChange = (filterId: string) => {
    dispatch(setCurrentFilter(filterId));
  };

  const handleDescriptionChange = (text: string) => {
    setImageInfo({
      ...imageInfo,
      description: text
    });
    
    // Update description for all selected images
    selectedImages.forEach(id => {
      dispatch(setImageDescription({ id, description: text }));
    });
  };

  const handleTitleChange = (text: string) => {
    setImageInfo({
      ...imageInfo,
      title: text
    });
  };

  const handleProceedToUpload = () => {
    navigation.navigate('Upload');
  };

  if (selectedImages.length === 0) {
    navigation.navigate('Index');
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.previewScroll}
            >
              {selectedImageObjects.map(image => (
                <View key={image.id} style={styles.previewContainer}>
                  <Image 
                    source={{ uri: image.url }} 
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsHeader}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'info' && styles.activeTab]} 
                onPress={() => setActiveTab('info')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'info' && styles.activeTabText]}>
                  Information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'filters' && styles.activeTab]} 
                onPress={() => setActiveTab('filters')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'filters' && styles.activeTabText]}>
                  Filters
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeTab === 'info' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter a title"
                    value={imageInfo.title}
                    onChangeText={handleTitleChange}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Add a description about this image"
                    value={imageInfo.description}
                    onChangeText={handleDescriptionChange}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            )}
            
            {activeTab === 'filters' && (
              <View style={styles.tabContent}>
                <View style={styles.filtersGrid}>
                  {FILTERS.map(filter => (
                    <TouchableOpacity
                      key={filter.id}
                      style={[
                        styles.filterOption,
                        currentFilter === filter.id && styles.selectedFilter
                      ]}
                      onPress={() => handleFilterChange(filter.id)}
                    >
                      <View style={styles.filterPreview}>
                        {selectedImageObjects.length > 0 && (
                          <Image 
                            source={{ uri: selectedImageObjects[0].url }} 
                            style={styles.filterThumbnail}
                          />
                        )}
                      </View>
                      <Text style={styles.filterName}>{filter.name}</Text>
                      
                      {currentFilter === filter.id && (
                        <View style={styles.selectedFilterCheck}>
                          <Icon name="check" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleProceedToUpload}
        >
          <Icon name="upload" size={18} color="white" style={styles.buttonIcon} />
          <Text style={styles.continueButtonText}>Continue to Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  previewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  previewScroll: {
    paddingRight: 16,
  },
  previewContainer: {
    width: 250,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  tabContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterOption: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  selectedFilter: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  filterPreview: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  filterThumbnail: {
    width: '100%',
    height: '100%',
  },
  filterName: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedFilterCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
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
  continueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  }
});

export default EditImage;
