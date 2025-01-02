'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import VideoList from '@/components/video/VideoList';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
                ?
              </div>
              <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">User Videos</h2>
          <VideoList userId={userId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-6">
            <img 
              src={userData.photoURL || '/default-avatar.png'}
              alt={userData.displayName || 'User'}
              className="w-32 h-32 rounded-full bg-white/10"
            />
            <div>
              <h1 className="text-3xl font-bold">{userData.displayName || userData.email || 'User'}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">User Videos</h2>
        <VideoList userId={userId} />
      </div>
    </div>
  );
}