
import React from 'react';
import { cn } from '@/lib/utils';
import { ImageInfo } from '@/store/imagesSlice';
import { Check } from 'lucide-react';

interface ImageCardProps {
  image: ImageInfo;
  selected: boolean;
  onSelect: () => void;
  selectionMode: 'single' | 'multiple';
  className?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  selected, 
  onSelect, 
  selectionMode,
  className 
}) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg aspect-square cursor-pointer group transition-all duration-200",
        selected ? "ring-2 ring-app-blue" : "hover:opacity-90",
        className
      )}
      onClick={onSelect}
    >
      <img 
        src={image.url} 
        alt={image.name} 
        className="w-full h-full object-cover"
      />
      
      {selected && (
        <div className="absolute top-2 right-2 h-6 w-6 bg-app-blue rounded-full flex items-center justify-center">
          <Check className="text-white" size={16} />
        </div>
      )}
      
      <div className={cn(
        "absolute inset-0 bg-black/0 transition-all duration-200",
        selected && "bg-black/10"
      )} />
      
      {image.uploadProgress !== undefined && image.uploadProgress < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-app-blue transition-all duration-300"
            style={{ width: `${image.uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCard;
