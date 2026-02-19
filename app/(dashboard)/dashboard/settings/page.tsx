'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
   LoadingOverlay,
} from '@/components/dashboard';
import { H1, H2, P } from '@/components/ui/Typography';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  description?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [heroMessages, setHeroMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchHeroMessages();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { 'X-Dashboard-Token': process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || '' },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroMessages = async () => {
    try {
      const res = await fetch('/api/settings/hero-messages');
      const data = await res.json();
      setHeroMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch hero messages');
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    const updated = [...heroMessages, newMessage];
    try {
      const res = await fetch('/api/settings/hero-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Dashboard-Token': process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || '',
        },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success('Message added');
      setHeroMessages(updated);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  const handleRemoveMessage = async (index: number) => {
    const updated = heroMessages.filter((_, i) => i !== index);
    try {
      const res = await fetch('/api/settings/hero-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Dashboard-Token': process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || '',
        },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success('Message removed');
      setHeroMessages(updated);
    } catch (error) {
      toast.error('Failed to remove message');
    }
  };

  if (loading) return <LoadingOverlay message="Loading settings..." />;

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
          <H1>Site Settings</H1>
          <P className="text-neutral-600 mt-2">Manage site-wide configuration</P>
        </div>

        {/* Hero Messages Section */}
        <motion.div className="border border-slate-200 rounded-lg p-6 space-y-4">
          <H2>Hero Messages</H2>
          <P className="text-neutral-600">Random messages displayed on the home page</P>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
              placeholder="Add a new hero message..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleAddMessage}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Messages List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {heroMessages.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No messages yet</p>
            ) : (
              heroMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-slate-700">{msg}</p>
                  <button
                    onClick={() => handleRemoveMessage(idx)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Other Settings Section */}
        <motion.div className="border border-slate-200 rounded-lg p-6 space-y-4">
          <H2>Configuration</H2>
          <P className="text-neutral-600">Other site settings</P>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {settings
              .filter((s) => s.key !== 'HERO_MESSAGES')
              .map((setting) => (
                <motion.div
                  key={setting.key}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="font-medium text-slate-700">{setting.key}</div>
                  <div className="text-sm text-slate-600 mt-1">{setting.description || 'No description'}</div>
                  <div className="text-sm font-mono text-slate-500 mt-2 break-all">{setting.value}</div>
                </motion.div>
              ))}
            {settings.length === 0 && (
              <p className="text-slate-500 text-center py-8">No settings configured</p>
            )}
          </div>
        </motion.div>
      </div>
  );
}
