// src/app/upload/page.tsx
'use client';
import UploadForm from '@/components/video/UploadForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="bg-indigo-600 text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Upload Video</h1>
          <p className="text-indigo-100">Share your content with our community</p>
        </div>
      </div>
      <UploadForm />
    </ProtectedRoute>
  );
}