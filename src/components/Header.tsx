
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleMultiSelectMode, clearSelection } from '../store/imagesSlice';
import Icon from 'react-native-vector-icons/Feather';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSelectionToggle?: boolean;
  navigation?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Image Uploader", 
  showBack = false,
  showSelectionToggle = false,
  navigation 
}) => {
  const dispatch = useAppDispatch();
  const { multiSelectMode } = useAppSelector(state => state.images);

  const handleToggleSelectMode = () => {
    dispatch(toggleMultiSelectMode());
  };

  const handleBack = () => {
    if (navigation.getCurrentRoute().name === 'Edit') {
      dispatch(clearSelection());
    }
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showSelectionToggle && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleSelectMode}
        >
          <Icon 
            name={multiSelectMode ? "check-square" : "square"} 
            size={18} 
            color="#3b82f6"
            style={styles.toggleIcon} 
          />
          <Text style={styles.toggleText}>
            {multiSelectMode ? "Multiple" : "Single"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleText: {
    color: '#3b82f6',
  }
});

export default Header;
