'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useFetch, useUnsavedChanges, UnsavedChangesIndicator, useAutoSaveDraft } from '@/hooks';
import {
  ConfirmDialog,
  MediaUploader,
  SortableGrid,
  SearchInput,
  Pagination,
  LoadingSpinner,
  DetailView,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardCard,
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
  const [viewingId, setViewingId] = useState<string | null>(null);
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
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Track form changes for unsaved warning
  const [originalFormData, setOriginalFormData] = useState(formData);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(originalFormData) && showForm;
  const { showWarning } = useUnsavedChanges({ isDirty });

  // Auto-save draft
  const { clearDraft } = useAutoSaveDraft({
    key: editingId || 'new-gallery',
    data: formData,
    enabled: isDirty,
  });

  const { fetch: fetchGallery } = useFetch<GalleryItem[]>('/api/gallery');

  const viewingItem = viewingId ? items.find((i) => i.id === viewingId) : null;

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
      toast.error('Gagal memuat galeri');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!imageId && !editingId) {
      toast.error('Pilih foto terlebih dahulu');
      setLoading(false);
      return;
    }

    try {
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageId: imageId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan foto');
      }

      await loadGallery();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '' });
      setOriginalFormData({ title: '', description: '' });
      setSelectedImage(null);
      setImageId(null);
      clearDraft();
      toast.success(editingId ? 'Foto berhasil diperbarui!' : 'Foto berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan foto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
        headers: {
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus foto');
      }

      await loadGallery();
      setShowConfirm(false);
      setDeleteId(null);
      toast.success('Foto berhasil dihapus');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Gagal menghapus foto');
    }
  };

  const handleBatchDelete = async () => {
    try {
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
            headers: {
              },
          })
        )
      );

      await loadGallery();
      setSelectedItems(new Set());
      setShowBatchConfirm(false);
      toast.success(`${selectedItems.size} foto berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Gagal menghapus beberapa foto');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    const newFormData = {
      title: item.title,
      description: item.description,
    };
    setFormData(newFormData);
    setOriginalFormData(newFormData);
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
          const response = await fetch('/api/gallery/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
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

        toast.success('Urutan galeri disimpan');
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
      <DashboardPageHeader
        title="Galeri Foto"
        description={`${filteredItems.length} foto${searchQuery ? ` (dari ${items.length})` : ''}`}
        badge={items.length}
        action={
          showForm
            ? undefined
            : {
                label: 'Foto Baru',
                onClick: () => {
                  setEditingId(null);
                  setFormData({ title: '', description: '' });
                  setOriginalFormData({ title: '', description: '' });
                  setSelectedImage(null);
                  setImageId(null);
                  setShowForm(true);
                },
              }
        }
        secondaryAction={
          showForm
            ? {
                label: 'Batalkan',
                onClick: () => {
                  setShowForm(false);
                  setEditingId(null);
                },
              }
            : selectedItems.size > 0
            ? {
                label: `Hapus ${selectedItems.size} Dipilih`,
                onClick: () => setShowBatchConfirm(true),
              }
            : undefined
        }
      />

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
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h2 className="text-base font-semibold text-slate-900 mb-5">
            {editingId ? 'Edit Foto' : 'Tambah Foto Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Judul <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Judul foto..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Cerita singkat tentang foto ini..."
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Foto <span className="text-red-400">*</span>
              </label>
              <MediaUploader
                previewUrl={selectedImage || undefined}
                onUploadingChange={setIsImageUploading}
                onSuccess={(mediaId, url) => {
                  setImageId(mediaId);
                  setSelectedImage(url);
                  toast.success('Foto berhasil diunggah');
                }}
                onError={(error) => toast.error(error)}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || isImageUploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {(loading || isImageUploading) && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isImageUploading ? 'Mengunggah...' : editingId ? 'Simpan Perubahan' : 'Tambah Foto'}
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
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Pilih semua di halaman ini
            </span>
          </label>
          {selectedItems.size > 0 && (
            <span className="text-sm text-slate-600">
              {selectedItems.size} dipilih
            </span>
          )}
        </div>
      )}

      {/* Grid View with Drag-Drop */}
      {paginatedItems.length === 0 ? (
        <DashboardEmptyState
          icon={searchQuery ? '🔍' : '🖼️'}
          title={searchQuery ? 'No items found' : 'No gallery items yet'}
          description={
            searchQuery
              ? `No gallery items match "${searchQuery}". Try a different search term.`
              : 'Create your first gallery item to showcase beautiful moments.'
          }
          actionLabel={searchQuery ? undefined : '➕ Create First Item'}
          onAction={
            searchQuery
              ? undefined
              : () => {
                  setEditingId(null);
                  setFormData({ title: '', description: '' });
                  setOriginalFormData({ title: '', description: '' });
                  setSelectedImage(null);
                  setImageId(null);
                  setShowForm(true);
                }
          }
        />
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
                <h3 className="font-semibold text-slate-900 mb-1.5 line-clamp-2 text-sm">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                  {item.description || 'Tidak ada deskripsi'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingId(item.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item.id);
                      setShowConfirm(true);
                    }}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Hapus
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
        title="Hapus Foto"
        message="Yakin ingin menghapus foto ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Hapus ${selectedItems.size} Foto`}
        message={`Yakin ingin menghapus ${selectedItems.size} foto? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />

      {/* Detail View */}
      {viewingItem && (
        <DetailView
          isOpen={!!viewingItem}
          onClose={() => setViewingId(null)}
          title={viewingItem.title}
          imageUrl={viewingItem.image.publicUrl}
          publicUrl={`/gallery#${viewingItem.id}`}
          fields={[
            { label: 'Description', value: viewingItem.description || 'No description', fullWidth: true },
            { label: 'Display Order', value: `Position #${viewingItem.order + 1}` },
          ]}
          onEdit={() => handleEdit(viewingItem)}
          onDelete={() => {
            setDeleteId(viewingItem.id);
            setShowConfirm(true);
          }}
        />
      )}

      {/* Unsaved Changes Warning */}
      <UnsavedChangesIndicator show={showWarning} />
    </div>
  );
}
