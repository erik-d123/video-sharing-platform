'use client';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import VideoInteraction from './VideoInteraction';
import Link from 'next/link';

interface VideoPlayerProps {
  videoId: string;
}

const defaultVideos = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    userName: 'Blender Foundation',
    userId: 'blender1',
    createdAt: new Date().toISOString(),
    views: 1520,
    thumbnailUrl: 'https://via.placeholder.com/640x360/123456/ffffff?text=Big+Buck+Bunny',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.'
  },
  {
    id: '2',
    title: 'Nature Relaxation',
    userName: 'Nature Channel',
    userId: 'nature1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    views: 892,
    thumbnailUrl: 'https://via.placeholder.com/640x360/654321/ffffff?text=Nature+Video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Relax with this beautiful nature footage.'
  },
  {
    id: '3',
    title: 'Tech Tutorial',
    userName: 'Tech Guru',
    userId: 'tech1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    views: 2341,
    thumbnailUrl: 'https://via.placeholder.com/640x360/234567/ffffff?text=Tech+Tutorial',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Learn the latest technology trends.'
  }
];

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = defaultVideos.find(v => v.id === videoId);
    if (video) {
      setVideoData(video);
    }
    setLoading(false);
  }, [videoId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="aspect-video bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
        <p className="mt-2 text-gray-600">The video you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          controls
          className="w-full h-full"
          poster={videoData.thumbnailUrl}
          src={videoData.videoUrl}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{videoData.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Link 
                href={`/profile/${videoData.userId}`}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium"
              >
                {videoData.userName}
              </Link>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {videoData.views.toLocaleString()} views
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(videoData.createdAt))} ago
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4">
          <p className="text-gray-700 whitespace-pre-wrap">{videoData.description}</p>
        </div>

        <VideoInteraction videoId={videoId} />
      </div>
    </div>
  );
}