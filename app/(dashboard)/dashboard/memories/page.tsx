'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import {
  ConfirmDialog,
  MediaUploader,
  SearchInput,
  Pagination,
  LoadingSpinner,
} from '@/components/dashboard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

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

  useEffect(() => {
    // Filter memories based on search query
    if (searchQuery) {
      const filtered = memories.filter(
        (memory) =>
          memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          memory.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMemories(filtered);
      setCurrentPage(1);
    } else {
      setFilteredMemories(memories);
    }
  }, [searchQuery, memories]);

  const loadMemories = async () => {
    try {
      const data = await fetchMemories();
      setMemories(data || []);
    } catch (error) {
      console.error('Failed to load memories:', error);
      toast.error('Failed to load memories');
    } finally {
      setInitialLoading(false);
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
          coverId: coverId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save memory');
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
      setCoverId(null);
      toast.success(editingId ? 'Memory updated!' : 'Memory created!');
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save memory');
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
      toast.success('Memory deleted');
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error('Failed to delete memory');
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
    setCoverId(memory.coverId || null);
    setEditingId(memory.id);
    setShowForm(true);
  };

  const handleBatchDelete = async () => {
    try {
      const token = sessionStorage.getItem('dashboard_token');
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/memories/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token && { 'X-Dashboard-Token': token }),
            },
          })
        )
      );

      await loadMemories();
      setSelectedItems(new Set());
      setShowBatchConfirm(false);
      toast.success(`${selectedItems.size} memories deleted`);
    } catch (error) {
      console.error('Error deleting memories:', error);
      toast.error('Failed to delete some memories');
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedMemories.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedMemories.map((memory) => memory.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMemories = filteredMemories.slice(startIndex, endIndex);

  if (initialLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Memories</h1>
          <p className="text-slate-600 text-sm mt-1">
            {filteredMemories.length} memory{filteredMemories.length !== 1 ? 'ies' : ''}
            {searchQuery && ` (filtered from ${memories.length})`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.size > 0 && (
            <button
              onClick={() => setShowBatchConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete {selectedItems.size} Selected
            </button>
          )}
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
              setCoverId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            {showForm ? '✖️ Cancel' : '➕ New Memory'}
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search memories by title or description..."
        onSearch={setSearchQuery}
      />

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
                onSuccess={(mediaId, url) => {
                  setCoverId(mediaId);
                  setCoverImage(url);
                  toast.success('Image uploaded');
                }}
                onError={(error) => toast.error(error)}
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

      {/* Batch Selection */}
      {paginatedMemories.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === paginatedMemories.length && paginatedMemories.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Select all on this page
            </span>
          </label>
          {selectedItems.size > 0 && (
            <span className="text-sm text-slate-600">
              {selectedItems.size} selected
            </span>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {paginatedMemories.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">
              {searchQuery ? 'No memories match your search' : 'No memories yet. Create one!'}
            </p>
          </div>
        ) : (
          paginatedMemories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Selection Checkbox */}
                <div className="flex items-start pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(memory.id)}
                    onChange={() => toggleItemSelection(memory.id)}
                    className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />
                </div>

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
                        {new Date(memory.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMemories.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Confirm Delete Single */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Memory"
        message="Are you sure you want to delete this memory? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Delete ${selectedItems.size} Memories`}
        message={`Are you sure you want to delete ${selectedItems.size} memories? This action cannot be undone.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />
    </div>
  );
}
