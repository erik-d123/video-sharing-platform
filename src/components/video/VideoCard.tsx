'use client';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  id: string;
  title: string;
  userName: string;
  createdAt: string;
  views: number;
  thumbnailUrl?: string;
}

export default function VideoCard({ id, title, userName, createdAt, views, thumbnailUrl }: VideoCardProps) {
  return (
    <div className="group">
      <Link href={`/video/${id}`}>
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="aspect-video bg-gray-200 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-200">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">No thumbnail</span>
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
              {formatViews(views)} views
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{userName}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span>{formatDistanceToNow(new Date(createdAt))} ago</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}