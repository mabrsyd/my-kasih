/**
 * Zustand Store - UI State Management
 * Best Practice: Global state ringan untuk UI (sidebar, toast, modal)
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Loading global
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    { name: 'ui-store' }
  )
);
