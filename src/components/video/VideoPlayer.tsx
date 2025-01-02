'use client';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import VideoInteraction from './VideoInteraction';
import Link from 'next/link';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleVideo, getSampleVideoViews, incrementSampleVideoViews, viewsEmitter } from '@/utils/sampleVideo';

interface VideoPlayerProps {
  videoId: string;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewsEmitter) return;

    const updateViews = (newViews: number) => {
      if (videoData?.id === 'sample_video') {
        setVideoData(prev => ({ ...prev, views: newViews }));
      }
    };

    viewsEmitter.on('viewsUpdated', updateViews);
    return () => {
      viewsEmitter.off('viewsUpdated', updateViews);
    };
  }, [videoData?.id]);

  useEffect(() => {
    const fetchVideo = async () => {
      const hasViewIncremented = sessionStorage.getItem(`video_view_${videoId}`);
      
      if (videoId === 'sample_video') {
        if (!hasViewIncremented) {
          const newViews = incrementSampleVideoViews();
          sessionStorage.setItem(`video_view_${videoId}`, 'true');
          setVideoData({
            ...sampleVideo,
            views: newViews
          });
        } else {
          setVideoData({
            ...sampleVideo,
            views: getSampleVideoViews()
          });
        }
        setLoading(false);
        return;
      }

      const videoRef = doc(db, 'videos', videoId);
      const videoDoc = await getDoc(videoRef);
      
      if (videoDoc.exists()) {
        const video = { id: videoDoc.id, ...videoDoc.data() };
        
        if (!hasViewIncremented) {
          await updateDoc(videoRef, {
            views: increment(1)
          });
          sessionStorage.setItem(`video_view_${videoId}`, 'true');
          setVideoData({
            ...video,
            views: (video.views || 0) + 1
          });
        } else {
          setVideoData(video);
        }
      }
      
      setLoading(false);
    };

    fetchVideo();
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