import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ModelFormData {
  name: string;
  file: File | null;
  readmeFile: File | null;
  updateDate: string;
}

function UploadModelPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    file: null,
    readmeFile: null,
    updateDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateUniqueId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.file) {
        throw new Error('Please select a model file');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if bucket exists first
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError) throw bucketsError;

      const modelsBucketExists = buckets?.some(b => b.name === 'models');
      if (!modelsBucketExists) {
        throw new Error('Storage not configured. Please contact administrator.');
      }

      // Generate unique ID
      const uniqueId = generateUniqueId(formData.name);

      // Upload model file
      const modelFileName = `${uniqueId}/${formData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('models')
        .upload(modelFileName, formData.file);

      if (uploadError) throw uploadError;

      // Generate or process README
      let readmeContent = '';
      if (formData.readmeFile) {
        readmeContent = await formData.readmeFile.text();
      } else {
        readmeContent = `# ${formData.name}

## Overview
This model was uploaded to SmolHub.

## Details
- Model Name: ${formData.name}
- Upload Date: ${formData.updateDate}
- Size: ${(formData.file.size / 1024 / 1024).toFixed(2)} MB
- Unique ID: ${uniqueId}

## Usage
To download this model using smolhub_hub:

\`\`\`python
from smolhub_hub import download_model

model_path = download_model("${uniqueId}")
\`\`\`
`;
      }

      // Create model record
      const { error: dbError } = await supabase
        .from('models')
        .insert([
          {
            name: formData.name,
            unique_id: uniqueId,
            file_path: modelFileName,
            size_bytes: formData.file.size,
            update_date: formData.updateDate,
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Upload Model</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Model Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model File (max 50MB)</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700"
              required
              accept=".bin,.onnx,.pt,.pth,.safetensors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">README.md (optional)</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, readmeFile: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700"
              accept=".md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Update Date</label>
            <input
              type="date"
              value={formData.updateDate}
              onChange={(e) => setFormData({ ...formData, updateDate: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload Model</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default UploadModelPage;