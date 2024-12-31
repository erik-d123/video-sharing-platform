'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import VideoList from '@/components/video/VideoList';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching user data
    setUser({
      id: userId,
      name: defaultVideos.find(v => v.userId === userId)?.userName || 'User',
      joinDate: '2024-01-01',
      subscribers: 1200,
      totalViews: 45000
    });
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="mt-2 space-y-1 text-indigo-100">
                <p>{user.subscribers.toLocaleString()} subscribers</p>
                <p>{user.totalViews.toLocaleString()} total views</p>
                <p>Joined {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Uploaded Videos</h2>
        <VideoList userId={userId} />
      </div>
    </div>
  );
}