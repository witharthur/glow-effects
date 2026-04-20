import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "./types";
import { currentUser } from "./data";

export const PostCard = ({
  post,
  onToggleLike,
  onDonate,
  onAddComment,
  onToggleCommentLike,
}: {
  post: Post;
  onToggleLike: (id: string) => void;
  onDonate: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onToggleCommentLike: (postId: string, commentId: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const liked = !!post.liked;
  const commented = post.comments.some((c) => c.author.id === currentUser.id);

  // Detect overflow when collapsed (>2 lines)
  useEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el || expanded) return;
      setIsClamped(el.scrollHeight - 1 > el.clientHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [post.text, expanded]);

  const showMoreBtn = isClamped && !expanded;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  return (
    <article className="bg-card shadow-card overflow-hidden animate-fade-in relative flex flex-col">
      {!post.locked && (
        <header className="flex items-center gap-3 px-4 py-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            loading="lazy"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
          />
          <span className="text-sm font-semibold text-foreground">
            {post.author.name}
          </span>
        </header>
      )}

      {post.locked ? (
        <div className="relative aspect-square overflow-hidden">
          <header className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-white">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              loading="lazy"
              width={40}
              height={40}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
            />
            <span className="text-sm font-semibold text-foreground">
              {post.author.name}
            </span>
          </header>
          {post.image && (
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-70"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-6" style={{
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(32px) saturate(160%)',
          }}>
            <div className="h-14 w-14 bg-primary flex items-center justify-center shadow-button rounded-[11px]">
              <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" strokeWidth={3} />
              </div>
            </div>
            <p
              style={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center',
                color: 'white',
                maxWidth: '236px',
                height: '40px',
                fontVariantNumeric: 'lining-nums tabular-nums',
              }}
            >
              Контент скрыт пользователем.
              <br />
              Доступ откроется после доната
            </p>
            <button
              onClick={() => onDonate(post.id)}
              style={{
                width: '239px',
                height: '42px',
                borderRadius: '14px',
                background: 'rgba(97, 21, 205, 1)',
                color: 'white',
                border: 'none',
                padding: '0 32px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: 1,
              }}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              Отправить донат
            </button>
          </div>
        </div>
      ) : (
        post.image && (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full aspect-square object-cover"
          />
        )
      )}

      {post.locked && (
        <div className="px-4 py-5 flex flex-col gap-2">
          <div className="h-[18px] w-[130px] bg-secondary/80 rounded-full animate-pulse" />
          <div className="h-[18px] w-full bg-secondary/80 rounded-full animate-pulse" />
        </div>
      )}

      {!post.locked && (
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-base font-bold text-foreground mb-1">
            {post.title}
          </h3>
          <p
            ref={textRef}
            className={cn(
              "text-sm text-foreground/80 leading-relaxed",
              !expanded && "line-clamp-2"
            )}
          >
            {post.text}
          </p>
          {showMoreBtn && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1 text-primary text-sm font-semibold hover:underline"
            >
              Показать еще
            </button>
          )}
          {expanded && isClamped && (
            <button
              onClick={() => setExpanded(false)}
              className="mt-1 text-primary text-sm font-semibold hover:underline"
            >
              Свернуть
            </button>
          )}
        </div>
      )}

      {!post.locked && (
        <div className="flex items-center gap-2 px-3 pb-4 pt-1">
          <button
            onClick={() => onToggleLike(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all",
              liked
                ? "bg-like-soft text-like"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart
              className={cn("h-4 w-4 transition-transform", liked && "animate-pop")}
              fill={liked ? "currentColor" : "none"}
              strokeWidth={2.2}
            />
            <span className="tabular-nums">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all",
              showComments || commented
                ? "bg-secondary text-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageCircle
              className={cn("h-4 w-4", (showComments || commented) && "animate-pop")}
              fill={showComments || commented ? "currentColor" : "none"}
              strokeWidth={2.2}
            />
            <span className="tabular-nums">{post.comments.length}</span>
          </button>
        </div>
      )}

      {showComments && !post.locked && (
        <div className="border-t border-gray-100 bg-gray-50/30 animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            {post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5 animate-fade-in">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    {c.author.name}
                  </p>
                  <p className="text-sm text-gray-800 leading-snug mt-0.5">
                    {c.text}
                  </p>
                </div>
                <button
                  onClick={() => onToggleCommentLike(post.id, c.id)}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold transition-colors flex-shrink-0",
                    c.liked ? "text-like" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Heart
                    className={cn("h-3.5 w-3.5", c.liked && "animate-pop")}
                    fill={c.liked ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                  <span className="tabular-nums">{c.likes}</span>
                </button>
              </div>
            ))}

            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-2 pt-2"
            >
              <div className="flex-1 relative">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ваш комментарий"
                  className="w-full bg-white border border-gray-200 h-10 px-4 py-2 rounded-full text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center justify-center text-primary disabled:opacity-30 transition-all hover:scale-110"
              >
                 <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  style={{ width: '18.75px', height: '18.75px', opacity: 1 }}
                >
                  <path d="M21.721,12.036L3.935,2.337C3.514,2.107,3,2.414,3,2.893l0,6.136c0,0.395,0.287,0.73,0.676,0.785l11.756,1.666c0.354,0.05,0.354,0.556,0,0.606 L3.676,13.751C3.287,13.806,3,14.141,3,14.536l0,6.136c0,0.479,0.514,0.786,0.935,0.556l17.786-9.699 C22.143,11.306,22.143,12.266,21.721,12.036z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};
