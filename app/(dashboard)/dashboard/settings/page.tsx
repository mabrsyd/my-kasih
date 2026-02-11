'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website Title
              </label>
              <input
                type="text"
                defaultValue="My Kasih"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website Description
              </label>
              <textarea
                defaultValue="A romantic content management system"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">API Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Memories Endpoint</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Gallery Endpoint</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Letters Endpoint</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Media Upload</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Configured
              </span>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            API Documentation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Base URL</h3>
              <code className="block bg-slate-100 p-3 rounded text-sm text-slate-700">
                /api
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Authentication
              </h3>
              <p className="text-slate-600 text-sm mb-2">
                All endpoints require X-Dashboard-Token header
              </p>
              <code className="block bg-slate-100 p-3 rounded text-sm text-slate-700">
                X-Dashboard-Token: your-token-here
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoints</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    GET /memories
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    POST /memories
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    PATCH /memories/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    DELETE /memories/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    GET /gallery
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    POST /gallery
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    PATCH /gallery/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    DELETE /gallery/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    GET /letters
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    POST /letters
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    PATCH /letters/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    DELETE /letters/[id]
                  </code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    POST /media/upload
                  </code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
