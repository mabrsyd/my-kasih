'use client';

import React, { useState, useEffect } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
