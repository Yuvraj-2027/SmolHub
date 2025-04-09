import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Profile {
  email: string;
  created_at: string;
  role?: string;
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

        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!profileError && profileData) {
          setProfile({
            ...profileData,
            role: roleData?.role || 'user'
          });
          setIsAdmin(roleData?.role === 'admin');
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

  if (!user || !profile) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">{profile.email}</p>
          {isAdmin && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">
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
          <button
            onClick={handleUploadModel}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
          >
            Upload Model
          </button>
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