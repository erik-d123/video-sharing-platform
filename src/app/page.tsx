'use client';
import { useState } from 'react';
import VideoList from '@/components/video/VideoList';

export default function HomePage() {
  const [sortBy, setSortBy] = useState('recent');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to VideoShare</h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Share your stories, experiences, and moments with the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Videos</h2>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
        <VideoList sortBy={sortBy} />
      </div>
    </div>
  );
}