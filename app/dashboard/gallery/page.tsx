'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { fetch: fetchGallery } = useFetch<GalleryItem[]>('/api/gallery');

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
      setCurrentPage(1);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const loadGallery = async () => {
    try {
      const data = await fetchGallery();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!imageId && !editingId) {
      toast.error('Please select an image');
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
        body: JSON.stringify({
          ...formData,
          imageId: imageId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save gallery item');
      }

      await loadGallery();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '' });
      setSelectedImage(null);
      setImageId(null);
      toast.success(editingId ? 'Gallery item updated!' : 'Gallery item created!');
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save item');
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
      toast.success('Gallery item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleBatchDelete = async () => {
    try {
      const token = sessionStorage.getItem('dashboard_token');
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token && { 'X-Dashboard-Token': token }),
            },
          })
        )
      );

      await loadGallery();
      setSelectedItems(new Set());
      setShowBatchConfirm(false);
      toast.success(`${selectedItems.size} items deleted`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete some items');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
    });
    setSelectedImage(item.image.publicUrl);
    setImageId(item.imageId);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleReorder = useCallback(
    async (reorderedItems: GalleryItem[]) => {
      const previousItems = [...items];
      
      // Optimistic update
      const itemsWithNewOrder = reorderedItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      setItems(itemsWithNewOrder);

      try {
        const token = sessionStorage.getItem('dashboard_token');
        const response = await fetch('/api/gallery/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'X-Dashboard-Token': token }),
          },
          body: JSON.stringify({
            items: itemsWithNewOrder.map((item, index) => ({
              id: item.id,
              order: index,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to reorder items');
        }

        toast.success('Gallery reordered');
      } catch (error) {
        // Revert on error
        setItems(previousItems);
        console.error('Error reordering items:', error);
        toast.error('Failed to reorder items');
      }
    },
    [items]
  );

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
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map((item) => item.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  if (initialLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-600 text-sm mt-1">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            {searchQuery && ` (filtered from ${items.length})`}
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
              setFormData({ title: '', description: '' });
              setSelectedImage(null);
              setImageId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
          >
            {showForm ? '✖️ Cancel' : '➕ New Item'}
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search gallery by title or description..."
        onSearch={setSearchQuery}
      />

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-slate-50 rounded-xl border border-slate-200 p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Gallery Item' : 'New Gallery Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
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
                Image *
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
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
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

      {/* Batch Selection */}
      {paginatedItems.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === paginatedItems.length && paginatedItems.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
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

      {/* Grid View with Drag-Drop */}
      {paginatedItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">
            {searchQuery ? 'No items match your search' : 'No gallery items yet. Create one!'}
          </p>
        </div>
      ) : (
        <SortableGrid
          items={paginatedItems}
          onReorder={handleReorder}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          renderItem={(item) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500 bg-white shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Drag Handle Indicator */}
              <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                ⋮⋮ Drag
              </div>

              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={item.image.publicUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {item.description || 'No description'}
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
          )}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
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
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Delete ${selectedItems.size} Items`}
        message={`Are you sure you want to delete ${selectedItems.size} gallery items? This action cannot be undone.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />
    </div>
  );
}
