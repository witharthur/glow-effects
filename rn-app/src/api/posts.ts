import { apiFetch } from './client';
import type { ApiPost, PostsPage } from '@/types/api';

/** Normalise whatever shape the API returns into { items, nextCursor } */
function normalise(raw: unknown): PostsPage {
  // Raw array: [ ...posts ]
  if (Array.isArray(raw)) {
    return { items: raw as ApiPost[], nextCursor: null };
  }

  const obj = raw as Record<string, any>;

  let items: any[] = [];
  if (Array.isArray(obj.items)) items = obj.items;
  else if (Array.isArray(obj.data)) items = obj.data;
  else if (Array.isArray(obj.posts)) items = obj.posts;
  else if (obj.data && Array.isArray(obj.data.posts)) items = obj.data.posts;
  else if (obj.data && Array.isArray(obj.data.items)) items = obj.data.items;

  let nextCursor: string | null = null;
  if (typeof obj.nextCursor === 'string') nextCursor = obj.nextCursor;
  else if (typeof obj.next_cursor === 'string') nextCursor = obj.next_cursor;
  else if (typeof obj.cursor === 'string') nextCursor = obj.cursor;
  else if (obj.data && typeof obj.data.nextCursor === 'string') nextCursor = obj.data.nextCursor;
  else if (obj.data && typeof obj.data.next_cursor === 'string') nextCursor = obj.data.next_cursor;
  else if (obj.data && typeof obj.data.cursor === 'string') nextCursor = obj.data.cursor;

  return { items, nextCursor };
}

export async function fetchPosts(params: {
  cursor?: string;
  tier?: 'all' | 'free' | 'paid';
}): Promise<PostsPage> {
  const query = new URLSearchParams();
  if (params.cursor) query.set('cursor', params.cursor);
  if (params.tier && params.tier !== 'all') query.set('tier', params.tier);
  const qs = query.toString();
  const raw = await apiFetch<unknown>(`/posts${qs ? `?${qs}` : ''}`);
  return normalise(raw);
}

export async function fetchPostById(id: string): Promise<ApiPost> {
  const raw = await apiFetch<any>(`/posts/${id}`);
  return raw?.data?.post ?? raw?.post ?? raw;
}

export async function likePost(id: string): Promise<{ likesCount: number; isLiked: boolean }> {
  const raw = await apiFetch<any>(`/posts/${id}/like`, { method: 'POST' });
  return raw?.data?.post ?? raw?.post ?? raw;
}
