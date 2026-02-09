'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import {
  ConfirmDialog,
  MediaUploader,
  SortableGrid,
  SearchInput,
  Pagination,
  LoadingSpinner,
} from '@/components/dashboard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
  });

  const { fetch: fetchLetters } = useFetch<Letter[]>('/api/letters');

  useEffect(() => {
    loadLetters();
  }, []);

  useEffect(() => {
    let filtered = letters;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (letter) =>
          letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by published status
    if (filterPublished === 'published') {
      filtered = filtered.filter((letter) => letter.published);
    } else if (filterPublished === 'draft') {
      filtered = filtered.filter((letter) => !letter.published);
    }

    setFilteredLetters(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterPublished, letters]);

  const loadLetters = async () => {
    try {
      const data = await fetchLetters();
      setLetters(data || []);
    } catch (error) {
      console.error('Failed to load letters:', error);
      toast.error('Failed to load letters');
    } finally {
      setInitialLoading(false);
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
        body: JSON.stringify({
          ...formData,
          imageId: imageId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save letter');
      }

      await loadLetters();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', content: '', published: false });
      setSelectedImage(null);
      setImageId(null);
      toast.success(editingId ? 'Letter updated!' : 'Letter created!');
    } catch (error) {
      console.error('Error saving letter:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save letter');
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
      toast.success('Letter deleted');
    } catch (error) {
      console.error('Error deleting letter:', error);
      toast.error('Failed to delete letter');
    }
  };

  const handleEdit = (letter: Letter) => {
    setFormData({
      title: letter.title,
      content: letter.content,
      published: letter.published,
    });
    setSelectedImage(letter.image?.publicUrl || null);
    setImageId(letter.imageId || null);
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
      toast.success(letter.published ? 'Letter unpublished' : 'Letter published');
    } catch (error) {
      console.error('Error updating letter:', error);
      toast.error('Failed to update letter');
    }
  };

  const handleBatchDelete = async () => {
    try {
      const token = sessionStorage.getItem('dashboard_token');
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/letters/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token && { 'X-Dashboard-Token': token }),
            },
          })
        )
      );

      await loadLetters();
      setSelectedItems(new Set());
      setShowBatchConfirm(false);
      toast.success(`${selectedItems.size} letters deleted`);
    } catch (error) {
      console.error('Error deleting letters:', error);
      toast.error('Failed to delete some letters');
    }
  };

  const handleReorder = async (reorderedLetters: Letter[]) => {
    const previousLetters = [...letters];
    
    // Optimistic update
    const lettersWithNewOrder = reorderedLetters.map((letter, index) => ({
      ...letter,
      order: index,
    }));
    setLetters(lettersWithNewOrder);

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch('/api/letters/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify({
          items: lettersWithNewOrder.map((letter, index) => ({
            id: letter.id,
            order: index,
          })),
        }),
      });

      if (! response.ok) {
        throw new Error('Failed to reorder letters');
      }

      toast.success('Letters reordered');
    } catch (error) {
      // Revert on error
      setLetters(previousLetters);
      console.error('Error reordering letters:', error);
      toast.error('Failed to reorder letters');
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
    if (selectedItems.size === paginatedLetters.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedLetters.map((letter) => letter.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLetters = filteredLetters.slice(startIndex, endIndex);

  if (initialLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Letters</h1>
          <p className="text-slate-600 text-sm mt-1">
            {filteredLetters.length} letter{filteredLetters.length !== 1 ? 's' : ''}
            {(searchQuery || filterPublished !== 'all') && ` (filtered from ${letters.length})`}
            {letters.some((l) => l.published) && (
              <span> • {letters.filter((l) => l.published).length} published</span>
            )}
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
              setFormData({ title: '', content: '', published: false });
              setSelectedImage(null);
              setImageId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            {showForm ? '✖️ Cancel' : '➕ New Letter'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search letters by title or content..."
            onSearch={setSearchQuery}
          />
        </div>
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'draft')}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Letters</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts Only</option>
        </select>
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
                onSuccess={(mediaId, url) => {
                  setImageId(mediaId);
                  setSelectedImage(url);
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

      {/* Batch Selection */}
      {paginatedLetters.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === paginatedLetters.length && paginatedLetters.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
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

      {/* List with Drag-Drop */}
      <div className="space-y-4">
        {paginatedLetters.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">
              {searchQuery || filterPublished !== 'all'
                ? 'No letters match your filters'
                : 'No letters yet. Write one!'}
            </p>
          </div>
        ) : (
          <SortableGrid
            items={paginatedLetters}
            onReorder={handleReorder}
            className="space-y-4"
            renderItem={(letter) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex gap-4">
                  {/* Selection Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(letter.id)}
                      onChange={() => toggleItemSelection(letter.id)}
                      className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Drag Handle Indicator */}
                  <div className="flex items-center">
                    <span className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                      ⋮⋮
                    </span>
                  </div>

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
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">
                            {letter.title}
                          </h3>
                          {letter.published ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              ✓ Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">
                              Draft
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
                          title={letter.published ? 'Unpublish' : 'Publish'}
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
            )}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLetters.length}
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
        title="Delete Letter"
        message="Are you sure you want to delete this letter? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Delete ${selectedItems.size} Letters`}
        message={`Are you sure you want to delete ${selectedItems.size} letters? This action cannot be undone.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />
    </div>
  );
}
