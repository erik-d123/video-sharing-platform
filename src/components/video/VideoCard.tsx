'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VideoCardProps {
  id: string;
  title: string;
  userName: string;
  views: number;
  thumbnailUrl?: string;
}

const VideoCard = ({ 
  id, 
  title, 
  userName, 
  views: initialViews = 0, // Provide default value
  thumbnailUrl 
}: VideoCardProps) => {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (id === 'sample_video') {
      const storedViews = localStorage.getItem('sample_video_views');
      if (storedViews) {
        setViews(parseInt(storedViews, 10));
      }
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'videos', id), (doc) => {
      if (doc.exists()) {
        setViews(doc.data()?.views || 0);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const defaultThumbnail = id === 'sample_video' 
    ? 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217'
    : 'https://via.placeholder.com/640x360';

  // Format views with safe check
  const formattedViews = typeof views === 'number' ? views.toLocaleString() : '0';

  return (
    <div className="group">
      <Link href={`/video/${id}`}>
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="aspect-video bg-gray-200 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-200">
            <img
              src={thumbnailUrl || defaultThumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
              {formattedViews} views
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{userName}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;