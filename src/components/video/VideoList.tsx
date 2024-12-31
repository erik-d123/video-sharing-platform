'use client';
import { useEffect, useState } from 'react';
import VideoCard from './VideoCard';

// Sample video data
const defaultVideos = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    userName: 'Blender Foundation',
    createdAt: new Date().toISOString(),
    views: 1520,
    thumbnailUrl: 'https://via.placeholder.com/640x360/123456/ffffff?text=Big+Buck+Bunny',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    title: 'Nature Relaxation',
    userName: 'Nature Channel',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    views: 892,
    thumbnailUrl: 'https://via.placeholder.com/640x360/654321/ffffff?text=Nature+Video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: '3',
    title: 'Tech Tutorial',
    userName: 'Tech Guru',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    views: 2341,
    thumbnailUrl: 'https://via.placeholder.com/640x360/234567/ffffff?text=Tech+Tutorial',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  }
];

export default function VideoList() {
  const [videos, setVideos] = useState(defaultVideos);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
      {videos.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No videos found</p>
        </div>
      )}
    </div>
  );
}