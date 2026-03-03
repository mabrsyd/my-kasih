/**
 * React Query Hooks - Dashboard Data Fetching
 * Best Practice: Centralized data fetching dengan caching & revalidasi otomatis
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// === Query Keys (centralized untuk konsistensi) ===
export const queryKeys = {
  memories: (published?: boolean) => ['memories', { published }] as const,
  memory: (id: string) => ['memories', id] as const,
  gallery: () => ['gallery'] as const,
  galleryItem: (id: string) => ['gallery', id] as const,
  letters: (published?: boolean) => ['letters', { published }] as const,
  letter: (id: string) => ['letters', id] as const,
  about: () => ['about'] as const,
  settings: () => ['settings'] as const,
  stats: () => ['stats'] as const,
} as const;

// === Fetcher Helper ===
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// === Dashboard Stats ===
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: async () => {
      const [memories, gallery, letters] = await Promise.all([
        apiFetch<unknown[]>('/api/memories?published=false'),
        apiFetch<unknown[]>('/api/gallery'),
        apiFetch<Array<{ published: boolean }>>('/api/letters?published=false'),
      ]);
      return {
        totalMemories: memories.length,
        totalGallery: gallery.length,
        totalLetters: letters.length,
        publishedLetters: letters.filter((l) => l.published).length,
      };
    },
    staleTime: 30 * 1000, // 30 detik
  });
}

// === Memories ===
export function useMemories(published?: boolean) {
  return useQuery({
    queryKey: queryKeys.memories(published),
    queryFn: () => {
      const param = published === undefined ? '' : `?published=${published}`;
      return apiFetch<unknown[]>(`/api/memories${param}`);
    },
  });
}

export function useMemory(id: string) {
  return useQuery({
    queryKey: queryKeys.memory(id),
    queryFn: () => apiFetch(`/api/memories/${id}`),
    enabled: !!id,
  });
}

// === Gallery ===
export function useGallery() {
  return useQuery({
    queryKey: queryKeys.gallery(),
    queryFn: () => apiFetch<unknown[]>('/api/gallery'),
  });
}

// === Letters ===
export function useLetters(published?: boolean) {
  return useQuery({
    queryKey: queryKeys.letters(published),
    queryFn: () => {
      const param = published === undefined ? '' : `?published=${published}`;
      return apiFetch<unknown[]>(`/api/letters${param}`);
    },
  });
}

// === Generic Delete Mutation ===
export function useDeleteItem(entityKey: keyof typeof queryKeys) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpoint, id }: { endpoint: string; id: string }) =>
      apiFetch(`${endpoint}/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      // Invalidate semua query terkait entity
      queryClient.invalidateQueries({ queryKey: [entityKey] });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats() });
    },
  });
}

// === Publish Toggle Mutation ===
export function usePublishToggle(endpoint: string, entityQueryKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiFetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityQueryKey] });
    },
  });
}
