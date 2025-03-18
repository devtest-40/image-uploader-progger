
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ImageInfo, setCurrentFilter, setImageDescription } from '@/store/imagesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILTERS = [
  { id: 'none', name: 'Normal', class: '' },
  { id: 'grayscale', name: 'Grayscale', class: 'grayscale' },
  { id: 'sepia', name: 'Sepia', class: 'sepia' },
  { id: 'invert', name: 'Invert', class: 'invert' },
  { id: 'blur', name: 'Blur', class: 'blur-sm' },
  { id: 'saturation', name: 'Saturate', class: 'saturate-150' },
  { id: 'contrast', name: 'Contrast', class: 'contrast-125' },
  { id: 'brightness', name: 'Bright', class: 'brightness-125' },
];

const EditImage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { galleryImages, selectedImages, currentFilter } = useAppSelector(state => state.images);
  const [imageInfo, setImageInfo] = useState<{title: string, description: string}>({
    title: '',
    description: ''
  });

  // Get selected image objects
  const selectedImageObjects = galleryImages.filter(img => selectedImages.includes(img.id));

  const handleFilterChange = (filterId: string) => {
    dispatch(setCurrentFilter(filterId));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageInfo({
      ...imageInfo,
      description: e.target.value
    });
    
    // Update description for all selected images
    selectedImages.forEach(id => {
      dispatch(setImageDescription({ id, description: e.target.value }));
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInfo({
      ...imageInfo,
      title: e.target.value
    });
  };

  const handleProceedToUpload = () => {
    navigate('/upload');
  };

  if (selectedImages.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Preview</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {selectedImageObjects.map(image => (
              <div 
                key={image.id} 
                className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden shadow-md"
              >
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    FILTERS.find(f => f.id === currentFilter)?.class
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter a title"
                  value={imageInfo.title}
                  onChange={handleTitleChange}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Add a description about this image"
                  value={imageInfo.description}
                  onChange={handleDescriptionChange}
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="pt-2">
              <div className="grid grid-cols-4 gap-3">
                {FILTERS.map(filter => (
                  <div
                    key={filter.id}
                    className={cn(
                      "flex flex-col items-center cursor-pointer p-2 rounded-lg",
                      currentFilter === filter.id && "bg-app-light-blue/20"
                    )}
                    onClick={() => handleFilterChange(filter.id)}
                  >
                    <div 
                      className={cn(
                        "w-16 h-16 rounded-lg overflow-hidden border border-gray-200 mb-2",
                        filter.class
                      )}
                    >
                      {selectedImageObjects.length > 0 && (
                        <img 
                          src={selectedImageObjects[0].url} 
                          alt={filter.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-center">{filter.name}</span>
                    
                    {currentFilter === filter.id && (
                      <div className="absolute top-1 right-1 bg-app-blue rounded-full w-4 h-4 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-10">
        <Button 
          onClick={handleProceedToUpload}
          className="w-full bg-app-blue hover:bg-app-dark-blue"
        >
          <Upload size={18} className="mr-2" />
          Continue to Upload
        </Button>
      </div>
    </div>
  );
};

export default EditImage;
