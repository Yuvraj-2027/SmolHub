import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Star, Database, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import UserProfile from '../components/UserProfile';

function HomePage() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-1.5 rounded-md hover:bg-gray-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigate(1)}
                  className="p-1.5 rounded-md hover:bg-gray-800"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl">🚀</span>
                <span className="ml-2 font-semibold">SmolHub</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search models, datasets..."
                  className="bg-gray-900 rounded-md px-4 py-1.5 w-[300px] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-sm hover:text-white">Models</a>
              <a href="#" className="text-sm hover:text-white">Datasets</a>
              <a href="#" className="text-sm hover:text-white">Documentation</a>
            </nav>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-1.5 rounded-md hover:bg-gray-800 focus:outline-none"
                >
                  <User className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
                {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Model Cards */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Link to="/model/meta-llama-2-7b" key={i} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-blue-400">meta-llama/Llama-2-7b</h3>
                  <p className="text-xs text-gray-400 mt-1">Updated 2 days ago • 1.8k • ⭐ 234</p>
                </div>
                <Star className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">Previous</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-sm">1</button>
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">2</button>
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">3</button>
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">100</button>
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">Next</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white">System Status</a>
            <a href="#" className="hover:text-white">TOS</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Jobs</a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🚀</span>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="hover:text-white">Models</a>
              <a href="#" className="hover:text-white">Datasets</a>
              <a href="#" className="hover:text-white">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;