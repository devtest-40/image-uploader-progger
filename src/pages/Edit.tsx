
import React from 'react';
import Header from '@/components/Header';
import EditImage from '@/components/EditImage';

const Edit = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Edit Image" showBack={true} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <EditImage />
      </main>
    </div>
  );
};

export default Edit;
