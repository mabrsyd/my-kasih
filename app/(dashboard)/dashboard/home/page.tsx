'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function HomeDashboardPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/settings/hero-messages');
      const data = await res.json();
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch {
      toast.error('Failed to load hero messages');
    } finally {
      setLoading(false);
    }
  };

  const saveMessages = async (updated: string[]) => {
    setSaving(true);
    try {
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('dashboard_token')
          : '';
      const res = await fetch('/api/settings/hero-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setMessages(updated);
      toast.success('Hero messages saved!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) {
      toast.error('Message cannot be empty');
      return;
    }
    if (messages.includes(trimmed)) {
      toast.error('This message already exists');
      return;
    }
    const updated = [...messages, trimmed];
    setNewMessage('');
    saveMessages(updated);
  };

  const handleEdit = (index: number, value: string) => {
    const updated = messages.map((m, i) => (i === index ? value : m));
    setMessages(updated);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = messages[index]?.trim();
    if (!trimmed) {
      toast.error('Message cannot be empty');
      return;
    }
    saveMessages([...messages]);
  };

  const handleDelete = (index: number) => {
    const updated = messages.filter((_, i) => i !== index);
    saveMessages(updated);
  };

  const handleClearAll = () => {
    if (!confirm('Are you sure you want to clear ALL hero messages?')) return;
    saveMessages([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading hero messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home Page</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage hero messages displayed on the homepage. A random message is
            picked each time a visitor loads the page.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={saving}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Add new message */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
          Add New Message
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder='e.g. "You are my greatest adventure"'
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={200}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newMessage.trim()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : '+ Add'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {newMessage.length}/200 characters
        </p>
      </div>

      {/* Messages list */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
          Current Messages ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-slate-500 font-medium">No hero messages yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              Add your first message above to display it on the homepage.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 group hover:border-blue-300 transition-colors"
              >
                <span className="text-slate-400 text-xs font-mono w-6 text-center shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleEdit(index, e.target.value)}
                  onBlur={() => handleSaveEdit(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                  className="flex-1 text-sm text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5"
                  maxLength={200}
                />
                <button
                  onClick={() => handleDelete(index)}
                  disabled={saving}
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                  title="Delete message"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {messages.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-purple-700 mb-3 uppercase tracking-wider">
            Preview (random)
          </h2>
          <p className="text-purple-800 italic font-serif text-base">
            &ldquo;{messages[Math.floor(Math.random() * messages.length)]}&rdquo;
          </p>
          <p className="text-purple-400 text-xs mt-2">
            ↑ This is what a random visitor sees on the homepage
          </p>
        </div>
      )}
    </div>
  );
}
