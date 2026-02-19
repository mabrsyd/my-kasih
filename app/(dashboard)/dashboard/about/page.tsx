'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ConfirmDialog,
  LoadingOverlay,
  SearchInput,
} from '@/components/dashboard';
import { H1, P } from '@/components/ui/Typography';
import toast from 'react-hot-toast';

interface AboutChapter {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

export default function AboutPage() {
  const [chapters, setChapters] = useState<AboutChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ icon: '', title: '', content: '', order: 0 });

  // Fetch chapters
  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      setChapters(data);
    } catch (error) {
      toast.error('Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.icon || !formData.title || !formData.content) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/about/${editingId}` : '/api/about';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Dashboard-Token': process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || '' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast.success(editingId ? 'Chapter updated' : 'Chapter created');
      setShowForm(false);
      setEditingId(null);
      setFormData({ icon: '', title: '', content: '', order: 0 });
      fetchChapters();
    } catch (error) {
      toast.error('Failed to save chapter');
    }
  };

  const handleEdit = (chapter: AboutChapter) => {
    setFormData(chapter);
    setEditingId(chapter.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/about/${deleteId}`, {
        method: 'DELETE',
        headers: { 'X-Dashboard-Token': process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || '' },
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Chapter deleted');
      setShowConfirm(false);
      setDeleteId(null);
      fetchChapters();
    } catch (error) {
      toast.error('Failed to delete chapter');
    }
  };

  if (loading) return <LoadingOverlay message="Loading chapters..." />;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <H1>Tentang Kita</H1>
            <P className="text-neutral-600 mt-2">Manage the story chapters that appear on the About page</P>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ icon: '', title: '', content: '', order: 0 });
            }}
            className="px-4 py-2 bg-purple-accent text-white rounded-lg font-medium hover:bg-purple-secondary transition-colors"
          >
            + Add Chapter
          </button>
        </div>

        {/* Search */}
        <SearchInput onSearch={setSearchQuery} placeholder="Search chapters..." />

        {/* Form Modal */}
        {showForm && (
          <motion.div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-6 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-rose-700">
                {editingId ? 'Edit Chapter' : 'Add Chapter'}
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Icon/Emoji</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="✦"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Chapter title..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Chapter story..."
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {/* Chapters Grid */}
        <div className="grid gap-4">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No chapters found</div>
          ) : (
            filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="text-4xl">{chapter.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-rose-700">{chapter.title}</h3>
                      <p className="text-neutral-600 mt-1 line-clamp-2">{chapter.content}</p>
                      <div className="text-xs text-slate-500 mt-2">Order: {chapter.order}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(chapter)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(chapter.id);
                        setShowConfirm(true);
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Confirm Delete Dialog */}
        {showConfirm && (
          <ConfirmDialog
            isOpen={showConfirm}
            title="Delete Chapter"
            message="Are you sure you want to delete this chapter? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={() => {
              setShowConfirm(false);
              setDeleteId(null);
            }}
            isDangerous
          />
        )}
      </div>
  );
}
