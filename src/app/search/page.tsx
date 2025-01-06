// src/app/search/page.tsx

'use client';
import { useSearchParams } from 'next/navigation';
import VideoList from '@/components/video/VideoList';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          Search results for "{query}"
        </h1>
        <VideoList searchQuery={query} />
      </div>
    </div>
  );
}