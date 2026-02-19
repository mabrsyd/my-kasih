'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MediaUploaderProps {
  onSuccess: (mediaId: string, url: string, fileName: string) => void;
  onError?: (error: string) => void;
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
  accept = 'image/*',
  previewUrl,
}: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        
        // Get image dimensions
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
          setShowConfirm(true);
        };
        img.onerror = () => {
          setPreview({
            url,
            name: file.name,
            size: file.size,
            type: file.type,
          });
          setShowConfirm(true);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to preview image';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleConfirmUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !preview) return;

    const file = fileInputRef.current.files[0];
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
      onSuccess(data.id, data.publicUrl, file.name);
      setPreview(null);
      setShowConfirm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setShowConfirm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Show existing preview
  if (previewUrl && !showConfirm) {
    return (
      <div className="space-y-3">
        <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt="Current preview"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg text-slate-600 font-medium hover:border-slate-400 transition-colors disabled:opacity-50 text-sm"
        >
          🔄 Change Image
        </button>
      </div>
    );
  }

  // Preview dialog
  if (showConfirm && preview) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-4">
          {/* Image Preview */}
          <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden mb-4">
            <Image
              src={preview.url}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>

          {/* File Details */}
          <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-600">📄 File Name:</span>
              <span className="font-medium text-slate-900 truncate ml-2">{preview.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">💾 File Size:</span>
              <span className="font-medium text-slate-900">{formatFileSize(preview.size)}</span>
            </div>
            {preview.width && preview.height && (
              <div className="flex justify-between">
                <span className="text-slate-600">📐 Dimensions:</span>
                <span className="font-medium text-slate-900">{preview.width} × {preview.height} px</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">🎨 Type:</span>
              <span className="font-medium text-slate-900">{preview.type || 'Image'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirmUpload}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>✅ Upload</>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-600 font-medium rounded-lg hover:border-slate-400 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">❌ {error}</p>}
      </div>
    );
  }

  // Initial upload button
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
            Processing...
          </>
        ) : (
          <>📤 Choose Image</>
        )}
      </button>

      {error && <p className="text-red-600 text-sm mt-2">❌ {error}</p>}
    </div>
  );
}
