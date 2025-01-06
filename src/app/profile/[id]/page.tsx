'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import VideoList from '@/components/video/VideoList';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleUser } from '@/utils/sampleVideo';

// Using DiceBear as a consistent default avatar service
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avatars/svg?seed=default';

interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId === 'sample1') {
          setUserData(sampleUser);
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData({
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL || DEFAULT_AVATAR
          });
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Profile not found'}
          </h2>
          <p className="text-gray-600">
            The requested profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 rounded-full bg-white/10 overflow-hidden">
              <img
                src={userData.photoURL || DEFAULT_AVATAR}
                alt={userData.displayName || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_AVATAR;
                }}
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">
                {userData.displayName || userData.email?.split('@')[0] || 'User'}
              </h1>
              {userData.email && (
                <p className="text-indigo-100 mt-1">{userData.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Videos</h2>
        <VideoList userId={userId} />
      </div>
    </div>
  );
}