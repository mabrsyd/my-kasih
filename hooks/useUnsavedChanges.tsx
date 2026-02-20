'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UseUnsavedChangesOptions {
  isDirty: boolean;
  onSave?: () => void;
}

export function useUnsavedChanges({ isDirty, onSave }: UseUnsavedChangesOptions) {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return { showWarning: isDirty, isDirty };
}

interface UnsavedChangesIndicatorProps {
  show: boolean;
  onSave?: () => void;
}

export function UnsavedChangesIndicator({ show, onSave }: UnsavedChangesIndicatorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="font-medium text-sm">Unsaved changes</span>
            {onSave && (
              <button
                onClick={onSave}
                className="ml-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
              >
                Save Now
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AutoSaveDraftOptions<T> {
  key: string;
  data: T;
  enabled: boolean;
  delay?: number;
}

export function useAutoSaveDraft<T>({ key, data, enabled, delay = 2000 }: AutoSaveDraftOptions<T>) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`draft-${key}`, JSON.stringify(data));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, enabled, key, delay]);

  const loadDraft = (): T | null => {
    try {
      const draft = localStorage.getItem(`draft-${key}`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(`draft-${key}`);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  return { loadDraft, clearDraft, lastSaved };
}
