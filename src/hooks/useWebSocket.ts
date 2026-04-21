import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService } from '@/services/ws';
import type { WsEvent, PostsPage, CommentsPage, ApiPost } from '@/types/api';
import type { FilterKey } from '@/components/feed/types';

const FILTERS: FilterKey[] = ['all', 'free', 'paid'];

/** Starts the WebSocket and wires cache updates. Mount once at app root. */
export function useWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    wsService.connect();

    const unsub = wsService.subscribe((event: WsEvent) => {
      if (event.type === 'like_updated') {
        const { postId, likesCount, isLiked } = event;

        // Update in all feed pages (all filter variants)
        FILTERS.forEach((tier) => {
          queryClient.setQueryData<{ pages: PostsPage[]; pageParams: unknown[] }>(
            ['posts', tier],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  items: (page.items ?? []).map((p) =>
                    p.id === postId ? { ...p, likesCount, isLiked } : p
                  ),
                })),
              };
            }
          );
        });

        // Update in post detail cache
        queryClient.setQueryData<ApiPost>(['post', postId], (old) => {
          if (!old) return old;
          return { ...old, likesCount, isLiked };
        });
      }

      if (event.type === 'comment_added') {
        const { postId, comment } = event;

        // Append comment to comments cache (deduplicate by id)
        queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(
          ['comments', postId],
          (old) => {
            if (!old) return old;
            const allIds = new Set(
              old.pages.flatMap((p) => (p.items ?? []).map((c) => c.id))
            );
            if (allIds.has(comment.id)) return old; // already present

            const pages = [...old.pages];
            const last = pages[pages.length - 1];
            pages[pages.length - 1] = {
              ...last,
              items: [...(last.items ?? []), comment],
            };
            return { ...old, pages };
          }
        );

        // Bump commentsCount in feeds
        FILTERS.forEach((tier) => {
          queryClient.setQueryData<{ pages: PostsPage[]; pageParams: unknown[] }>(
            ['posts', tier],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  items: (page.items ?? []).map((p) =>
                    p.id === postId
                      ? { ...p, commentsCount: p.commentsCount + 1 }
                      : p
                  ),
                })),
              };
            }
          );
        });
      }
    });

    return unsub;
  }, [queryClient]);
}
