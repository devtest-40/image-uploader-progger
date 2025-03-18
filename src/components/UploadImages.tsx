
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { updateUploadProgress, setUploadStatus } from '@/store/imagesSlice';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Upload, Check, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadImages: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { galleryImages, selectedImages, currentFilter } = useAppSelector(state => state.images);
  
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Get selected image objects
  const selectedImageObjects = galleryImages.filter(img => selectedImages.includes(img.id));

  const uploadToFirebase = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    let completedUploads = 0;
    let failedUploads = 0;

    // We'd fetch the actual file in a real app
    // For this demo, we'll simulate it with a fetch
    for (const imageId of selectedImages) {
      const imageObj = galleryImages.find(img => img.id === imageId);
      
      if (!imageObj) continue;
      
      try {
        // Simulate getting the image file from URL
        dispatch(updateUploadProgress({ id: imageId, progress: 10 }));
        
        // In a real app, we'd use the actual file from the device
        const response = await fetch(imageObj.url);
        const blob = await response.blob();
        
        // Create a storage reference
        const storageRef = ref(storage, `images/${Date.now()}_${imageObj.name}`);
        
        // Upload the file with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            dispatch(updateUploadProgress({ id: imageId, progress }));
            
            // Update overall progress
            completedUploads = selectedImages.length > 1 
              ? (failedUploads + completedUploads + progress / 100) / selectedImages.length * 100
              : progress;
            setOverallProgress(completedUploads);
          },
          (error) => {
            // Handle errors
            console.error("Upload error:", error);
            dispatch(setUploadStatus({ 
              id: imageId, 
              status: 'error', 
              error: 'Failed to upload' 
            }));
            failedUploads++;
            toast({
              title: "Upload failed",
              description: `Failed to upload ${imageObj.name}`,
              variant: "destructive",
            });
          },
          async () => {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Store image metadata in Firestore
            await addDoc(collection(db, 'images'), {
              name: imageObj.name,
              description: imageObj.description || '',
              filter: currentFilter,
              downloadURL,
              uploadedAt: new Date(),
            });
            
            dispatch(setUploadStatus({ id: imageId, status: 'success' }));
            completedUploads++;
            
            // If all uploads are completed
            if (completedUploads + failedUploads === selectedImages.length) {
              setUploading(false);
              setUploadComplete(true);
              setOverallProgress(100);
              
              toast({
                title: "Upload complete",
                description: "All images have been successfully uploaded",
              });
            }
          }
        );
      } catch (error) {
        console.error("Error preparing upload:", error);
        dispatch(setUploadStatus({ 
          id: imageId, 
          status: 'error', 
          error: 'Failed to prepare upload' 
        }));
        failedUploads++;
        
        if (completedUploads + failedUploads === selectedImages.length) {
          setUploading(false);
        }
      }
    }
  };

  const handleBackToGallery = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-6">Upload Images</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} ready to upload
          </p>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-right text-sm text-gray-500 mt-1">
            {Math.round(overallProgress)}%
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          {selectedImageObjects.map(image => (
            <div key={image.id} className="flex items-center p-3 border rounded-lg">
              <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-800 truncate">{image.name}</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                  <div 
                    className={`h-full rounded-full ${
                      image.uploadStatus === 'error' ? 'bg-red-500' : 'bg-app-blue'
                    }`}
                    style={{ 
                      width: `${image.uploadProgress || 0}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="ml-4 w-8 flex-shrink-0">
                {image.uploadStatus === 'success' && (
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
                
                {image.uploadStatus === 'error' && (
                  <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                    <X size={14} className="text-white" />
                  </div>
                )}
                
                {image.uploadStatus === 'uploading' && (
                  <RefreshCw size={18} className="text-app-blue animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-10">
        {!uploading && !uploadComplete ? (
          <Button 
            onClick={uploadToFirebase}
            className="w-full bg-app-blue hover:bg-app-dark-blue"
            disabled={uploading}
          >
            <Upload size={18} className="mr-2" />
            Start Upload
          </Button>
        ) : uploadComplete ? (
          <Button 
            onClick={handleBackToGallery}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Check size={18} className="mr-2" />
            Back to Gallery
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full"
          >
            <RefreshCw size={18} className="mr-2 animate-spin" />
            Uploading...
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadImages;
