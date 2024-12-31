'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                VideoShare
              </span>
            </Link>
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
                  <img 
                    src={user.photoURL || 'https://via.placeholder.com/32'} 
                    alt={user.displayName || user.email || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
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