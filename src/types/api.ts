/** API response types matching the Mecenate Test API contract */

export interface ApiAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface ApiPost {
  id: string;
  author: ApiAuthor;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: 'free' | 'paid';
  createdAt: string;
}

export interface PostsPage {
  items: ApiPost[];
  nextCursor: string | null;
}

export interface ApiComment {
  id: string;
  postId: string;
  author: ApiAuthor;
  text: string;
  createdAt: string;
}

export interface CommentsPage {
  items: ApiComment[];
  nextCursor: string | null;
}

// WebSocket event payloads
export interface WsLikeUpdated {
  type: 'like_updated';
  postId: string;
  likesCount: number;
  isLiked: boolean;
}

export interface WsCommentAdded {
  type: 'comment_added';
  postId: string;
  comment: ApiComment;
}

export type WsEvent = WsLikeUpdated | WsCommentAdded;
