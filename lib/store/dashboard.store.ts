/**
 * Zustand Store - Dashboard Content State
 * Best Practice: Manage selected items, filters, pagination state
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DashboardState {
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected items (untuk bulk operations)
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Active section
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Selection
      selectedIds: new Set<string>(),
      toggleSelect: (id) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          next.has(id) ? next.delete(id) : next.add(id);
          return { selectedIds: next };
        }),
      selectAll: (ids) =>
        set({ selectedIds: new Set(ids) }),
      clearSelection: () =>
        set({ selectedIds: new Set<string>() }),

      // Active section
      activeSection: 'dashboard',
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    { name: 'dashboard-store' }
  )
);
