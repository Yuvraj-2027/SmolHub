import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface ModelFormData {
  name: string;
  uniqueId: string;
  file: File | null;
  readme: File | null;
  updateDate: string;
}

function UploadModelPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    uniqueId: '',
    file: null,
    readme: null,
    updateDate: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.file) {
        throw new Error('Please select a model file to upload');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload model file
      const modelFileName = `${formData.uniqueId}/${formData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('models')
        .upload(modelFileName, formData.file);

      if (uploadError) throw uploadError;

      // Process README
      let readmeContent = '';
      if (formData.readme) {
        readmeContent = await formData.readme.text();
      } else {
        readmeContent = `# ${formData.name}\n\nModel ID: ${formData.uniqueId}\nUploaded: ${formData.updateDate}`;
      }

      // Create model record
      const { error: dbError } = await supabase
        .from('models')
        .insert([
          {
            name: formData.name,
            unique_id: formData.uniqueId,
            file_path: modelFileName,
            size_bytes: formData.file.size,
            upload_date: formData.updateDate,
            readme_content: readmeContent,
            uploader_id: user.id
          }
        ]);

      if (dbError) throw dbError;

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      <header className="border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Upload Model</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Model Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Unique ID (e.g., meta-llama/llama3.1)
              </label>
              <input
                type="text"
                value={formData.uniqueId}
                onChange={(e) => setFormData({ ...formData, uniqueId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Model File (max 50MB)
              </label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                accept=".bin,.onnx,.pt,.pth,.safetensors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                README.md (optional)
              </label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, readme: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                accept=".md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Update Date
              </label>
              <input
                type="date"
                value={formData.updateDate}
                onChange={(e) => setFormData({ ...formData, updateDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Model'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UploadModelPage;