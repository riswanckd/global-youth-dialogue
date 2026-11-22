import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0, // Never serve stale cross-session data by default
      gcTime: 0, // Prevent preserving unmounted user queries across sessions
      retry: 1,
    },
  },
});
