
import React from 'react';
import Header from '@/components/Header';
import UploadImages from '@/components/UploadImages';

const Upload = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Upload Images" showBack={true} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <UploadImages />
      </main>
    </div>
  );
};

export default Upload;
