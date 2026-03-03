'use client';

import React, { useEffect, useState } from 'react';
import { useFetch, useUnsavedChanges, UnsavedChangesIndicator, useAutoSaveDraft } from '@/hooks';
import {
  ConfirmDialog,
  MediaUploader,
  SortableGrid,
  SearchInput,
  Pagination,
  LoadingSpinner,
  DetailView,
  StatusBadge,
  PublishToggle,
  DashboardEmptyState,
  DashboardPageHeader,
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
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
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

  // Track form changes
  const [originalFormData, setOriginalFormData] = useState(formData);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(originalFormData) && showForm;
  const { showWarning } = useUnsavedChanges({ isDirty });
  const { clearDraft } = useAutoSaveDraft({
    key: editingId || 'new-letter',
    data: formData,
    enabled: isDirty,
  });

  const { fetch: fetchLetters } = useFetch<Letter[]>('/api/letters?published=false');
  const viewingItem = viewingId ? letters.find((l) => l.id === viewingId) : null;

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

    // Client-side guard — content must be at least 20 characters
    if (formData.content.length < 20) {
      toast.error('Content must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      const url = editingId ? `/api/letters/${editingId}` : '/api/letters';

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
        const errorData = await response.json();
        if (errorData.details?.length) {
          const messages = errorData.details.map((d: { path: string; message: string }) =>
            d.path ? `${d.path}: ${d.message}` : d.message
          ).join(', ');
          throw new Error(messages);
        }
        throw new Error(errorData.error || 'Failed to save letter');
      }

      await loadLetters();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', content: '', published: false });
      setOriginalFormData({ title: '', content: '', published: false });
      setSelectedImage(null);
      setImageId(null);
      clearDraft();
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
      const response = await fetch(`/api/letters/${deleteId}`, {
        method: 'DELETE',
        headers: {
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
    const newFormData = {
      title: letter.title,
      content: letter.content,
      published: letter.published,
    };
    setFormData(newFormData);
    setOriginalFormData(newFormData);
    setSelectedImage(letter.image?.publicUrl || null);
    setImageId(letter.imageId || null);
    setEditingId(letter.id);
    setShowForm(true);
  };

  const handleTogglePublish = async (letter: Letter) => {
    try {
      const response = await fetch(`/api/letters/${letter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/letters/${id}`, {
            method: 'DELETE',
            headers: {
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
      const response = await fetch('/api/letters/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
      <DashboardPageHeader
        title="Surat Cinta"
        description={`${filteredLetters.length} surat${(searchQuery || filterPublished !== 'all') ? ` (dari ${letters.length})` : ''} • ${letters.filter((l) => l.published).length} diterbitkan`}
        badge={letters.length}
        action={
          showForm
            ? undefined
            : {
                label: 'Surat Baru',
                onClick: () => {
                  setEditingId(null);
                  setFormData({ title: '', content: '', published: false });
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
                onClick: () => { setShowForm(false); setEditingId(null); },
              }
            : selectedItems.size > 0
            ? {
                label: `Hapus ${selectedItems.size} Dipilih`,
                onClick: () => setShowBatchConfirm(true),
              }
            : undefined
        }
      />

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Cari surat berdasarkan judul atau isi..."
            onSearch={setSearchQuery}
          />
        </div>
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'draft')}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
        >
          <option value="all">Semua Surat</option>
          <option value="published">Sudah Diterbitkan</option>
          <option value="draft">Draft Saja</option>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Judul <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Judul surat..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Isi Surat <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Tulis suratmu di sini..."
                rows={8}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
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
                  className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Terbitkan surat ini
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Foto Sampul (opsional)
              </label>
              <MediaUploader
                previewUrl={selectedImage || undefined}
                onUploadingChange={setIsImageUploading}
                onSuccess={(mediaId, url) => {
                  setImageId(mediaId);
                  setSelectedImage(url);
                  toast.success('Foto diunggah');
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
                {isImageUploading ? 'Mengunggah...' : editingId ? 'Simpan Perubahan' : 'Buat Surat'}
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

      {/* List with Drag-Drop */}
      <div className="space-y-4">
        {paginatedLetters.length === 0 ? (
          <DashboardEmptyState
            icon={searchQuery || filterPublished !== 'all' ? '🔍' : '✉️'}
            title={searchQuery || filterPublished !== 'all' ? 'Tidak ditemukan' : 'Belum ada surat'}
            description={
              searchQuery || filterPublished !== 'all'
                ? 'Tidak ada surat yang cocok. Coba ubah pencarian atau filter.'
                : 'Tulis surat cinta pertamamu dengan penuh perasaan.'
            }
            actionLabel={searchQuery || filterPublished !== 'all' ? undefined : 'Tulis Surat Pertama'}
            onAction={
              searchQuery || filterPublished !== 'all'
                ? undefined
                : () => {
                    setEditingId(null);
                    setFormData({ title: '', content: '', published: false });
                    setOriginalFormData({ title: '', content: '', published: false });
                    setSelectedImage(null);
                    setImageId(null);
                    setShowForm(true);
                  }
            }
          />
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
                      className="h-24 w-24 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">
                            {letter.title}
                          </h3>
                          <PublishToggle
                            id={letter.id}
                            published={letter.published}
                            endpoint="/api/letters"
                            onSuccess={() => loadLetters()}
                          />
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {letter.content}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => setViewingId(letter.id)}
                          className="px-3 py-2 text-sm font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                        >
                          Lihat
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(letter.id);
                            setShowConfirm(true);
                          }}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Hapus
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
        title="Hapus Surat"
        message="Yakin ingin menghapus surat ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Hapus ${selectedItems.size} Surat`}
        message={`Yakin ingin menghapus ${selectedItems.size} surat? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />

      {/* Detail View */}
      {viewingItem && (
        <DetailView
          isOpen={!!viewingItem}
          onClose={() => setViewingId(null)}
          title={viewingItem.title}
          imageUrl={viewingItem.image?.publicUrl}
          publicUrl={`/letter#${viewingItem.id}`}
          fields={[
            { label: 'Isi Surat', value: viewingItem.content, fullWidth: true },
            { label: 'Status', value: viewingItem.published, type: 'boolean' },
            { label: 'Urutan Tampil', value: `Posisi #${viewingItem.order + 1}` },
          ]}
          onEdit={() => { handleEdit(viewingItem); setViewingId(null); }}
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
