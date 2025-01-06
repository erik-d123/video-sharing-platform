'use client';
import { useState, useEffect, useRef } from 'react';
import VideoInteraction from './VideoInteraction';
import Link from 'next/link';
import { doc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleVideo, incrementSampleVideoViews, getSampleVideoViews } from '@/utils/sampleVideo';

interface VideoData {
  id: string;
  title: string;
  userName: string;
  userId: string;
  views: number;
  thumbnailUrl?: string;
  videoUrl: string;
  description: string;
}

interface VideoPlayerProps {
  videoId: string;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    let unsubscribe: () => void;

    const handleVideo = async () => {
      try {
        // Reset the increment flag on each mount/refresh
        hasIncrementedView.current = false;

        // Handle sample video
        if (videoId === 'sample_video') {
          incrementSampleVideoViews();
          setVideoData({
            ...sampleVideo,
            views: getSampleVideoViews()
          });
          setLoading(false);
          return;
        }

        // Set up real-time listener for regular videos
        const videoRef = doc(db, 'videos', videoId);
        unsubscribe = onSnapshot(videoRef, async (doc) => {
          if (doc.exists()) {
            const data = doc.data() as VideoData;
            setVideoData({ id: doc.id, ...data });

            // Increment view count if not already done for this component instance
            if (!hasIncrementedView.current) {
              hasIncrementedView.current = true;
              await updateDoc(videoRef, { views: increment(1) });
            }
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error handling video:', error);
        setLoading(false);
      }
    };

    handleVideo();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
                {videoData.views?.toLocaleString()} views
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