'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import { ConfirmDialog, MediaUploader } from '@/components/dashboard';
import { motion } from 'framer-motion';

interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  coverId?: string;
  cover?: {
    publicUrl: string;
  };
  publishedAt?: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    emoji: '💕',
  });

  const { fetch: fetchMemories } = useFetch<Memory[]>('/api/memories');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await fetchMemories();
      setMemories(data || []);
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const url = editingId
        ? `/api/memories/${editingId}`
        : '/api/memories';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save memory');
      }

      await loadMemories();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        emoji: '💕',
      });
      setCoverImage(null);
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch(`/api/memories/${deleteId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'X-Dashboard-Token': token }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }

      await loadMemories();
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleEdit = (memory: Memory) => {
    setFormData({
      date: new Date(memory.date).toISOString().split('T')[0],
      title: memory.title,
      description: memory.description,
      emoji: memory.emoji,
    });
    setCoverImage(memory.cover?.publicUrl || null);
    setEditingId(memory.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Memories</h1>
          <p className="text-slate-600 text-sm mt-1">
            {memories.length} memory{memories.length !== 1 ? 'ies' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              date: new Date().toISOString().split('T')[0],
              title: '',
              description: '',
              emoji: '💕',
            });
            setCoverImage(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
        >
          {showForm ? '✖️ Cancel' : '➕ New Memory'}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) =>
                    setFormData({ ...formData, emoji: e.target.value })
                  }
                  maxLength={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

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
                placeholder="Memory title"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                placeholder="Memory details..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image (Optional)
              </label>
              {coverImage && (
                <div className="mb-3">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                </div>
              )}
              <MediaUploader
                onSuccess={(url) => setCoverImage(url)}
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
                className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingId ? 'Update' : 'Create'} Memory
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-4">
        {memories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">No memories yet. Create one!</p>
          </div>
        ) : (
          memories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {memory.cover && (
                  <img
                    src={memory.cover.publicUrl}
                    alt={memory.title}
                    className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{memory.emoji}</span>
                        <h3 className="text-lg font-bold text-slate-900">
                          {memory.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">
                        {new Date(memory.date).toLocaleDateString()}
                      </p>
                      <p className="text-slate-700 text-sm line-clamp-2">
                        {memory.description}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(memory)}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(memory.id);
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
        title="Delete Memory"
        message="Are you sure you want to delete this memory? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
