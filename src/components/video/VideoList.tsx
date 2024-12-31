'use client';
import { useEffect, useState } from 'react';
import VideoCard from './VideoCard';

interface Video {
  id: string;
  title: string;
  userName: string;
  userId: string;
  createdAt: string;
  views: number;
  likes: number;
  thumbnailUrl?: string;
  videoUrl: string;
  description: string;
}

const defaultVideos: Video[] = [
  {
    id: '1',
    title: 'Jungle Sunset Safari',
    userName: 'Wildlife Explorer',
    userId: 'wildlife1',
    createdAt: new Date().toISOString(),
    views: 1520,
    likes: 450,
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'Experience a breathtaking sunset safari through the African jungle, featuring rare wildlife in their natural habitat.'
  },
  {
    id: '2',
    title: 'Snowboarding the Alps',
    userName: 'Extreme Sports',
    userId: 'sports1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    views: 892,
    likes: 220,
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    description: 'Professional snowboarder tackles the most challenging slopes in the Swiss Alps. Pure adrenaline and stunning mountain views.'
  },
  {
    id: '3',
    title: 'Urban Parkour Challenge',
    userName: 'City Runners',
    userId: 'parkour1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    views: 2341,
    likes: 890,
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    description: 'Watch as expert parkour athletes navigate through urban obstacles in this high-energy compilation.'
  }
];

interface VideoListProps {
  searchQuery?: string;
  userId?: string;
  sortBy?: string;
}

export default function VideoList({ searchQuery, userId, sortBy = 'recent' }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);

  useEffect(() => {
    let result = [...videos];

    if (searchQuery) {
      result = result.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (userId) {
      result = result.filter(video => video.userId === userId);
    }

    switch (sortBy) {
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        result.sort((a, b) => b.likes - a.likes);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, userId, sortBy]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVideos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
      {filteredVideos.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No videos found</p>
        </div>
      )}
    </div>
  );
}