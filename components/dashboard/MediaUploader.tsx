'use client';

import React, { useState, useRef } from 'react';

interface MediaUploaderProps {
  onSuccess: (url: string, fileName: string) => void;
  onError?: (error: string) => void;
  accept?: string;
}

export function MediaUploader({
  onSuccess,
  onError,
  accept = 'image/*',
}: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onSuccess(data.publicUrl, file.name);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 font-medium hover:border-slate-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>📤 Choose Image</>
        )}
      </button>

      {error && <p className="text-red-600 text-sm mt-2">❌ {error}</p>}
    </div>
  );
}
