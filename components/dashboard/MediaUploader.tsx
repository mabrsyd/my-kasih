'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface MediaUploaderProps {
  onSuccess: (mediaId: string, url: string, fileName: string) => void;
  onError?: (error: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  accept?: string;
  previewUrl?: string;
}

interface FilePreview {
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

export function MediaUploader({
  onSuccess,
  onError,
  onUploadingChange,
  accept = 'image/*',
  previewUrl,
}: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);

  const setLoadingState = (val: boolean) => {
    setLoading(val);
    onUploadingChange?.(val);
  };
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoadingState(true);

    try {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          setPreview({
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
          });
        };
        img.onerror = () => {
          setPreview({ url, name: file.name, size: file.size, type: file.type });
        };
        img.src = url;
      };
      reader.readAsDataURL(file);

      // Upload immediately without waiting for confirm
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
      onSuccess(data.id, data.publicUrl, file.name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setPreview(null);
      onError?.(errorMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoadingState(false);
    }
  };

  const displayUrl = previewUrl || preview?.url;

  // Always render the hidden input so fileInputRef works everywhere
  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      {displayUrl && !loading ? (
        // Show uploaded preview with option to change
        <>
          <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner" style={{ aspectRatio: '16/9' }}>
            <Image
              src={displayUrl}
              alt="Current preview"
              fill
              unoptimized={displayUrl.startsWith('/')}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
          {(preview?.width && preview?.height) && (
            <p className="text-xs text-slate-500 text-center">
              {preview.width} × {preview.height}px · {(preview.size / 1024).toFixed(0)} KB
            </p>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg text-slate-600 font-medium hover:border-pink-400 hover:text-pink-600 hover:border-pink-400 transition-colors text-sm"
          >
            🔄 Ganti Gambar
          </button>
        </>
      ) : (
        // Upload button (also shows spinner while uploading)
        <>
          <button
            type="button"
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
        </>
      )}
    </div>
  );
}
