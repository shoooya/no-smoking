'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{user.displayName || user.email}</span>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return null;
}
