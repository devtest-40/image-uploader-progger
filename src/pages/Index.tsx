
import React from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import ImageGallery from '@/components/ImageGallery';
import Header from '@/components/Header';

const Index = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showSelectionToggle={true} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <ImageGallery />
      </main>
    </div>
  );
};

export default Index;
