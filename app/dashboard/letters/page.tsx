'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import { ConfirmDialog, MediaUploader } from '@/components/dashboard';
import { motion } from 'framer-motion';

interface Letter {
  id: string;
  title: string;
  content: string;
  order: number;
  published: boolean;
  imageId?: string;
  image?: {
    publicUrl: string;
  };
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
  });

  const { fetch: fetchLetters } = useFetch<Letter[]>('/api/letters');

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const data = await fetchLetters();
      setLetters(data || []);
    } catch (error) {
      console.error('Failed to load letters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const url = editingId ? `/api/letters/${editingId}` : '/api/letters';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save letter');
      }

      await loadLetters();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', content: '', published: false });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error saving letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch(`/api/letters/${deleteId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'X-Dashboard-Token': token }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete letter');
      }

      await loadLetters();
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting letter:', error);
    }
  };

  const handleEdit = (letter: Letter) => {
    setFormData({
      title: letter.title,
      content: letter.content,
      published: letter.published,
    });
    setSelectedImage(letter.image?.publicUrl || null);
    setEditingId(letter.id);
    setShowForm(true);
  };

  const handleTogglePublish = async (letter: Letter) => {
    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch(`/api/letters/${letter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify({
          title: letter.title,
          content: letter.content,
          published: !letter.published,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update letter');
      }

      await loadLetters();
    } catch (error) {
      console.error('Error updating letter:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Letters</h1>
          <p className="text-slate-600 text-sm mt-1">
            {letters.length} letter{letters.length !== 1 ? 's' : ''}
            {letters.some((l) => l.published) && (
              <span>
                {' '}
                • {letters.filter((l) => l.published).length} published
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', content: '', published: false });
            setSelectedImage(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          {showForm ? '✖️ Cancel' : '➕ New Letter'}
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
                placeholder="Letter title"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your letter here..."
                rows={8}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Publish this letter
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image (Optional)
              </label>
              {selectedImage && (
                <div className="mb-3">
                  <img
                    src={selectedImage}
                    alt="Cover"
                    className="h-32 w-full object-cover rounded-lg"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingId ? 'Update' : 'Create'} Letter
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-4">
        {letters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">No letters yet. Write one!</p>
          </div>
        ) : (
          letters.map((letter) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {letter.image && (
                  <img
                    src={letter.image.publicUrl}
                    alt={letter.title}
                    className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {letter.title}
                        </h3>
                        {letter.published && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {letter.content}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleTogglePublish(letter)}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        {letter.published ? '📪' : '📬'}
                      </button>
                      <button
                        onClick={() => handleEdit(letter)}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(letter.id);
                          setShowConfirm(true);
                        }}
                        className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Letter"
        message="Are you sure you want to delete this letter? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
