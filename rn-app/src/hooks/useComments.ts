import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { createComment, fetchComments } from '@/api/comments';
import type { CommentsPage } from '@/types/api';

// ─── Comments (infinite scroll) ──────────────────────────────────────────────

export function useComments(postId: string, enabled = false) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) =>
      fetchComments(postId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: CommentsPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: 60_000,
  });
}

// ─── Create comment ──────────────────────────────────────────────────────────
// We do NOT manually append — the WS comment_added event does that to avoid
// duplicates.

export function useCreateComment(postId: string) {
  return useMutation({
    mutationFn: (text: string) => createComment(postId, text),
    onError: () => {
      Alert.alert('Ошибка', 'Не удалось отправить комментарий');
    },
  });
}
