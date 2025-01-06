'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';

// Using DiceBear as a consistent default avatar service
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avatars/svg?seed=default';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              VideoShare
            </span>
          </Link>

          <div className="flex-1 mx-8">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Upload Video
                </Link>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/profile/${user.uid}`}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={user.photoURL || DEFAULT_AVATAR}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_AVATAR;
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}