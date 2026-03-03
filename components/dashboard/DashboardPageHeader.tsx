'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'danger';
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  badge?: string | number;
}

export function DashboardPageHeader({
  title,
  description,
  action,
  secondaryAction,
  badge,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-2">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                action.variant === 'danger'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {action.icon ?? <Plus className="w-4 h-4" />}
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
