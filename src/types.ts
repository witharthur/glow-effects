export type Author = {
  id: string;
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  author: Author;
  text: string;
  likes: number;
  liked?: boolean;
};

export type Post = {
  id: string;
  author: Author;
  image?: string;
  title: string;
  text: string;
  likes: number;
  comments: Comment[];
  liked?: boolean;
  locked?: boolean;
  long?: boolean;
};

export type FilterKey = "all" | "free" | "paid";
