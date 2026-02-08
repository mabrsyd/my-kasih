'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import { ConfirmDialog, MediaUploader } from '@/components/dashboard';
import { motion } from 'framer-motion';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  order: number;
  imageId: string;
  image: {
    publicUrl: string;
  };
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { fetch: fetchGallery } = useFetch<GalleryItem[]>('/api/gallery');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await fetchGallery();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedImage && !editingId) {
      alert('Please select an image');
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save gallery item');
      }

      await loadGallery();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '' });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error saving gallery item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'X-Dashboard-Token': token }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await loadGallery();
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
    });
    setSelectedImage(item.image.publicUrl);
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-600 text-sm mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '' });
            setSelectedImage(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
        >
          {showForm ? '✖️ Cancel' : '➕ New Item'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Gallery item title"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Item details..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image
              </label>
              {selectedImage && (
                <div className="mb-3">
                  <img
                    src={selectedImage}
                    alt="Gallery"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                </div>
              )}
              <MediaUploader
                onSuccess={(url) => setSelectedImage(url)}
                onError={(error) => console.error(error)}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingId ? 'Update' : 'Create'} Item
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">No gallery items yet. Create one!</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={item.image.publicUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item.id);
                      setShowConfirm(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
