'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import VideoCard from './VideoCard';
import { sampleVideo, getSampleVideoViews, viewsEmitter } from '@/utils/sampleVideo';

interface Video {
  id: string;
  title: string;
  userName: string;
  createdAt: string;
  views: number;
  thumbnailUrl?: string;
  videoUrl: string;
}

interface VideoListProps {
  searchQuery?: string;
  userId?: string;
  sortBy?: string;
}

export default function VideoList({ searchQuery, userId, sortBy = 'recent' }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewsEmitter) return;

    const updateViews = (newViews: number) => {
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === 'sample_video' 
            ? { ...video, views: newViews }
            : video
        )
      );
    };

    viewsEmitter.on('viewsUpdated', updateViews);
    return () => {
      viewsEmitter.off('viewsUpdated', updateViews);
    };
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosRef = collection(db, 'videos');
        const q = query(videosRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const uploadedVideos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Video[];

        const allVideos = [...uploadedVideos];
        
        if (uploadedVideos.length === 0) {
          allVideos.push({
            ...sampleVideo,
            views: getSampleVideoViews()
          });
        }

        let filteredVideos = allVideos;
        if (searchQuery) {
          filteredVideos = allVideos.filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.userName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (userId) {
          filteredVideos = filteredVideos.filter(video => video.userId === userId);
        }

        switch (sortBy) {
          case 'views':
            filteredVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
          case 'likes':
            filteredVideos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
          default:
            filteredVideos.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        setVideos(filteredVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, userId, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          userName={video.userName}
          createdAt={video.createdAt}
          views={video.views}
          thumbnailUrl={video.thumbnailUrl}
        />
      ))}
    </div>
  );
}