"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

/**
 * React Query provider for query caching and state management.
 * Provides optimistic updates, background refetching, and automatic cache invalidation.
 * 
 * Default configuration:
 * - staleTime: 5 minutes (data considered fresh for 5 minutes)
 * - cacheTime: 30 minutes (unused data kept in cache for 30 minutes)
 * - refetchOnWindowFocus: true (refetch when user returns to tab)
 * - retry: 1 (retry failed requests once)
 * 
 * @example
 * ```tsx
 * // In app layout
 * <QueryProvider>
 *   <YourApp />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
            refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  )
}
