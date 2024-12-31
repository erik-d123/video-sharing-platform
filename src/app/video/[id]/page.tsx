'use client';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/video/VideoPlayer';

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <VideoPlayer videoId={videoId} />
    </div>
  );
}