import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Profile {
  email: string;
  created_at: string;
  role?: 'admin' | 'user';
}

interface UserProfileProps {
  onClose: () => void;
}

function UserProfile({ onClose }: UserProfileProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, created_at')
          .eq('id', user.id)
          .single();

        // Simplified admin check
        const isRootAdmin = user.email === 'b123153@iiit-bh.ac.in';
        
        if (!profileError && profileData) {
          setProfile({
            ...profileData,
            role: isRootAdmin ? 'admin' : 'user'
          });
          setIsAdmin(isRootAdmin);
        }
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleViewProfile = () => {
    navigate('/profile');
    onClose();
  };

  const handleUploadModel = () => {
    navigate('/upload-model');
    onClose();
  };

  // Add click handler for the parent element
  const handleParentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
    onClose();
  };

  if (!user || !profile) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-800">
      <div 
        className="px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800"
        onClick={handleParentClick}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">{profile.email}</p>
          {isAdmin && (
            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full">
              Admin
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Joined {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
      
      <div className="px-4 py-2">
        <button
          onClick={handleViewProfile}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
        >
          View Profile
        </button>
        {isAdmin && (
          <>
            <Link
              to="/upload-model"
              className="w-full block text-left px-3 py-2 text-sm text-purple-400 hover:bg-gray-800 rounded-md"
              onClick={onClose}
            >
              Upload Model
            </Link>
            <Link
              to="/admin/dashboard"
              className="w-full block text-left px-3 py-2 text-sm text-purple-400 hover:bg-gray-800 rounded-md"
              onClick={onClose}
            >
              Admin Dashboard
            </Link>
          </>
        )}
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default UserProfile;