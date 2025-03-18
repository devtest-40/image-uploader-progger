
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setGalleryImages, selectImage } from '@/store/imagesSlice';
import { cn } from '@/lib/utils';
import { ImageInfo } from '@/store/imagesSlice';
import ImageCard from './ImageCard';
import { Button } from '@/components/ui/button';
import { Upload, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ImageGalleryProps {
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ className }) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { galleryImages, selectedImages, multiSelectMode } = useAppSelector(state => state.images);
  const [loadingImages, setLoadingImages] = useState(true);

  // Simulate loading images from device
  useEffect(() => {
    const loadImages = async () => {
      try {
        // In a real app, we would use a native API to access device photos
        // For demo purposes, we're creating fake image data
        const mockImages: ImageInfo[] = Array.from({ length: 20 }, (_, i) => ({
          id: `img-${i}`,
          url: `https://source.unsplash.com/random/400x400?sig=${i}`,
          name: `Image ${i + 1}`,
          selected: false
        }));
        
        // Simulate loading delay
        setTimeout(() => {
          dispatch(setGalleryImages(mockImages));
          setLoadingImages(false);
        }, 1500);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load images from device",
          variant: "destructive"
        });
        setLoadingImages(false);
      }
    };
    
    loadImages();
  }, [dispatch, toast]);

  const handleImageSelect = (id: string) => {
    dispatch(selectImage(id));
  };

  const handleNextStep = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to continue",
        variant: "destructive"
      });
      return;
    }
    navigate('/edit');
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {loadingImages ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 border-4 border-app-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your photos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                selected={selectedImages.includes(image.id)}
                onSelect={() => handleImageSelect(image.id)}
                selectionMode={multiSelectMode ? 'multiple' : 'single'}
              />
            ))}
          </div>
          
          {selectedImages.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-10 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-app-blue flex items-center justify-center text-white">
                  <Check size={20} />
                </div>
                <span className="ml-3 font-medium">
                  {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
                </span>
              </div>
              
              <Button onClick={handleNextStep} className="bg-app-blue hover:bg-app-dark-blue">
                Next <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageGallery;
