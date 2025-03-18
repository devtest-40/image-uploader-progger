
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImageInfo {
  id: string;
  url: string;
  name: string;
  selected: boolean;
  filter?: string;
  description?: string;
  uploadProgress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface ImagesState {
  galleryImages: ImageInfo[];
  selectedImages: string[];
  multiSelectMode: boolean;
  isLoading: boolean;
  currentFilter: string;
  error: string | null;
}

const initialState: ImagesState = {
  galleryImages: [],
  selectedImages: [],
  multiSelectMode: false,
  isLoading: false,
  currentFilter: 'none',
  error: null,
};

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setGalleryImages: (state, action: PayloadAction<ImageInfo[]>) => {
      state.galleryImages = action.payload;
    },
    toggleMultiSelectMode: (state) => {
      state.multiSelectMode = !state.multiSelectMode;
      if (!state.multiSelectMode) {
        state.selectedImages = state.selectedImages.slice(0, 1);
      }
    },
    selectImage: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      
      if (state.multiSelectMode) {
        const index = state.selectedImages.indexOf(imageId);
        if (index > -1) {
          state.selectedImages.splice(index, 1);
        } else {
          state.selectedImages.push(imageId);
        }
      } else {
        state.selectedImages = [imageId];
      }
      
      // Update selected status in galleryImages
      state.galleryImages = state.galleryImages.map(img => ({
        ...img,
        selected: state.selectedImages.includes(img.id)
      }));
    },
    clearSelection: (state) => {
      state.selectedImages = [];
      state.galleryImages = state.galleryImages.map(img => ({
        ...img,
        selected: false
      }));
    },
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.currentFilter = action.payload;
    },
    setImageDescription: (state, action: PayloadAction<{id: string, description: string}>) => {
      const { id, description } = action.payload;
      state.galleryImages = state.galleryImages.map(img => 
        img.id === id ? { ...img, description } : img
      );
    },
    updateUploadProgress: (state, action: PayloadAction<{id: string, progress: number}>) => {
      const { id, progress } = action.payload;
      state.galleryImages = state.galleryImages.map(img => 
        img.id === id ? { ...img, uploadProgress: progress, uploadStatus: 'uploading' } : img
      );
    },
    setUploadStatus: (state, action: PayloadAction<{id: string, status: 'idle' | 'uploading' | 'success' | 'error', error?: string}>) => {
      const { id, status, error } = action.payload;
      state.galleryImages = state.galleryImages.map(img => 
        img.id === id ? { ...img, uploadStatus: status, error } : img
      );
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setGalleryImages, 
  toggleMultiSelectMode, 
  selectImage, 
  clearSelection, 
  setCurrentFilter,
  setImageDescription,
  updateUploadProgress,
  setUploadStatus,
  setLoadingState,
  setError
} = imagesSlice.actions;

export default imagesSlice.reducer;
