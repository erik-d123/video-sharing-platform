'use client';
import VideoList from '@/components/video/VideoList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to VideoShare</h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Share your stories, experiences, and moments with the world. Join our community of creators and viewers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Trending Videos</h2>
          <div className="flex items-center space-x-4">
            <select className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Most Recent</option>
              <option>Most Viewed</option>
              <option>Most Liked</option>
            </select>
          </div>
        </div>
        <VideoList />
      </div>
    </div>
  );
}