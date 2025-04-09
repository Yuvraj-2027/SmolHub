import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  email: string;
  created_at: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('email, created_at')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <span className="text-yellow-400 text-2xl">🚀</span>
              <span className="ml-2 font-semibold">SmolHub</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          
          <div className="px-8 py-6">
            {/* Profile Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center ring-4 ring-gray-900">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Profile Details</h1>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="w-5 h-5" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors text-left"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/auth');
                    }}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;