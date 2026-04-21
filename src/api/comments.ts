import { apiFetch } from './client';
import type { ApiComment, CommentsPage } from '@/types/api';

export async function fetchComments(
  postId: string,
  cursor?: string
): Promise<CommentsPage> {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);
  const qs = query.toString();
  const raw = await apiFetch<any>(`/posts/${postId}/comments${qs ? `?${qs}` : ''}`);
  
  let items = raw?.data?.comments ?? raw?.comments ?? raw?.items ?? [];
  if (!Array.isArray(items)) items = [];
  
  const nextCursor = raw?.data?.nextCursor ?? raw?.nextCursor ?? raw?.cursor ?? null;
  return { items, nextCursor };
}

export async function createComment(
  postId: string,
  text: string
): Promise<ApiComment> {
  const raw = await apiFetch<any>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return raw?.data?.comment ?? raw?.comment ?? raw;
}
