'use client';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import VideoCard from './VideoCard';
import { sampleVideo, getSampleVideoViews } from '@/utils/sampleVideo';

interface Video {
  id: string;
  title: string;
  userName: string;
  userId: string;
  views: number;
  thumbnailUrl?: string;
  likes?: number;
}

interface VideoListProps {
  searchQuery?: string;
  userId?: string;
  sortBy?: string;
}

const VideoList = ({ searchQuery, userId, sortBy = 'recent' }: VideoListProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let allVideos: Video[] = [];

        // Handle sample user profile
        if (userId === 'sample1') {
          allVideos = [{
            ...sampleVideo,
            views: getSampleVideoViews()
          }];
        } else if (userId) {
          // Fetch user's videos
          const videosRef = collection(db, 'videos');
          const q = query(videosRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          allVideos = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(video => video.title && video.userName) as Video[];
        } else {
          // Fetch all videos for main page
          const videosRef = collection(db, 'videos');
          const querySnapshot = await getDocs(videosRef);
          allVideos = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(video => video.title && video.userName) as Video[];

          // Add sample video if no videos exist
          if (allVideos.length === 0 && !searchQuery) {
            allVideos = [{
              ...sampleVideo,
              views: getSampleVideoViews()
            }];
          }
        }

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          allVideos = allVideos.filter(video =>
            video.title.toLowerCase().includes(query) ||
            video.userName.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        switch (sortBy) {
          case 'views':
            allVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
          case 'likes':
            allVideos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
        }

        setVideos(allVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
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

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-600">
          {userId ? 'No videos uploaded yet' : 'No videos found'}
        </h2>
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
          views={video.views}
          thumbnailUrl={video.thumbnailUrl}
        />
      ))}
    </div>
  );
};

export default VideoList;