import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPostById, fetchPosts, likePost } from '@/api/posts';
import type { ApiPost, PostsPage } from '@/types/api';
import type { FilterKey } from '@/components/feed/types';

// ─── Feed (infinite scroll) ───────────────────────────────────────────────────

export function usePosts(tier: FilterKey) {
  return useInfiniteQuery({
    queryKey: ['posts', tier],
    queryFn: ({ pageParam }) =>
      fetchPosts({ cursor: pageParam as string | undefined, tier }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PostsPage) => lastPage.nextCursor ?? undefined,
    staleTime: 60_000,
  });
}

// ─── Single post ──────────────────────────────────────────────────────────────

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    staleTime: 60_000,
  });
}

// ─── Like (optimistic) ───────────────────────────────────────────────────────

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,

    onMutate: async (postId: string) => {
      // Cancel in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Snapshot previous state for rollback
      const filters: FilterKey[] = ['all', 'free', 'paid'];
      const prevFeeds = filters.map((tier) => ({
        tier,
        data: queryClient.getQueryData<{ pages: PostsPage[] }>(['posts', tier]),
      }));
      const prevPost = queryClient.getQueryData<ApiPost>(['post', postId]);

      // Optimistically toggle in feeds
      filters.forEach((tier) => {
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
                    ? {
                        ...p,
                        isLiked: !p.isLiked,
                        likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                      }
                    : p
                ),
              })),
            };
          }
        );
      });

      // Optimistically toggle in post detail
      queryClient.setQueryData<ApiPost>(['post', postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !old.isLiked,
          likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      return { prevFeeds, prevPost, postId };
    },

    onError: (_err, _postId, context) => {
      // Rollback feeds
      context?.prevFeeds.forEach(({ tier, data }) => {
        if (data) queryClient.setQueryData(['posts', tier], data);
      });
      // Rollback post detail
      if (context?.prevPost) {
        queryClient.setQueryData(['post', context.postId], context.prevPost);
      }
      toast.error('Не удалось поставить лайк');
    },
  });
}
