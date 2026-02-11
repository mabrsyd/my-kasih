'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface DetailField {
  label: string;
  value: string | number | boolean | null | undefined;
  type?: 'text' | 'date' | 'boolean' | 'emoji' | 'image';
  fullWidth?: boolean;
}

interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
  imageUrl?: string;
  publicUrl?: string;
  onEdit: () => void;
  onDelete: () => void;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
  };
}

export function DetailView({
  isOpen,
  onClose,
  title,
  fields,
  imageUrl,
  publicUrl,
  onEdit,
  onDelete,
  metadata,
}: DetailViewProps) {
  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '—';
    
    switch (type) {
      case 'date':
        return new Date(value).toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'boolean':
        return value ? '✅ Yes' : '❌ No';
      case 'emoji':
        return <span className="text-3xl">{value}</span>;
      default:
        return String(value);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-900">Detail View</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview - Full Width */}
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 shadow-lg"
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                  Title
                </h3>
                <p className="text-2xl font-bold text-slate-900">{title}</p>
              </motion.div>

              {/* Fields Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 gap-6"
              >
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className={`${field.fullWidth ? 'col-span-1' : ''}`}
                  >
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">
                      {field.label}
                    </label>
                    <div className="text-slate-900 leading-relaxed">
                      {field.type === 'image' && field.value ? (
                        <img
                          src={String(field.value)}
                          alt={field.label}
                          className="w-full max-w-md rounded-lg"
                        />
                      ) : (
                        formatValue(field.value, field.type)
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Metadata */}
              {metadata && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-6 border-t border-slate-200 space-y-3"
                >
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Metadata
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {metadata.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Created:</span>
                        <span className="text-slate-700 font-medium">
                          {formatValue(metadata.createdAt, 'date')}
                        </span>
                      </div>
                    )}
                    {metadata.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Last Updated:</span>
                        <span className="text-slate-700 font-medium">
                          {formatValue(metadata.updatedAt, 'date')}
                        </span>
                      </div>
                    )}
                    {metadata.publishedAt !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Published:</span>
                        <span className="text-slate-700 font-medium">
                          {metadata.publishedAt
                            ? formatValue(metadata.publishedAt, 'date')
                            : 'Not published'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Public Preview Link */}
              {publicUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <p className="text-sm text-purple-700 mb-2 font-medium">
                    🌐 Public Page Preview
                  </p>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 hover:underline text-sm flex items-center gap-1"
                  >
                    View on public website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky bottom-0 bg-white pt-6 pb-2 flex gap-3"
              >
                <button
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit This Item
                </button>

                <button
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
