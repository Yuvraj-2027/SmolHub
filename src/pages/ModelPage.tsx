import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Star, Download, Share2, Play, Award, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';

function ModelPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
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
                placeholder="Search models, datasets, users..."
                className="bg-gray-900 rounded-md px-4 py-1.5 w-[300px] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            <User className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Model Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Model Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img
              src="https://avatars.githubusercontent.com/u/123456789?v=4"
              alt="Model Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold flex items-center">
                Qwen/Qwen2.5-Omni-7B
                <button className="ml-3 px-2 py-1 text-xs bg-red-500 text-white rounded">Like</button>
                <span className="ml-2 text-sm text-gray-400">1.2k</span>
              </h1>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Any-to-Any
                </span>
                <span className="flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  Transformers
                </span>
                <span>24.3k followers</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Try this model
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Deploy
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-8">
            <button className="px-4 py-2 text-sm border-b-2 border-blue-500 text-blue-500">Model card</button>
            <button className="px-4 py-2 text-sm text-gray-400">Files and versions</button>
            <button className="px-4 py-2 text-sm text-gray-400">Community</button>
          </div>
        </div>

        {/* Model Description */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 mb-6">
            Qwen2.5-Omni is an end-to-end multimodal model designed to perceive diverse modalities,
            including text, images, audio, and video, while simultaneously generating text and natural speech
            responses in a streaming manner.
          </p>

          <h3 className="text-lg font-semibold mb-4">Key Features</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              <strong>Omni and Novel Architecture:</strong> We propose Thinker-Talker architecture, an end-to-end
              multimodal model designed to perceive diverse modalities, including text, images, audio, and
              video, while simultaneously generating text and natural speech responses in a streaming manner.
            </li>
            <li>
              <strong>Real-Time Voice and Video Chat:</strong> Architecture designed for fully real-time interactions,
              supporting chunked input and immediate output.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ModelPage;