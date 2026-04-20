import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "./types";
import { currentUser } from "./data";

const PAGE = 3;

const formatCommentCount = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  const w =
    m10 === 1 && m100 !== 11
      ? "комментарий"
      : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)
        ? "комментария"
        : "комментариев";
  return `${n} ${w}`;
};

const CommentSendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-7 w-7 shrink-0"
    fill="currentColor"
    aria-hidden
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

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
  const [sortNewest, setSortNewest] = useState(true);
  const [visible, setVisible] = useState(PAGE);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [commentSending, setCommentSending] = useState(false);
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

  useEffect(() => {
    if (showComments) setVisible(PAGE);
  }, [showComments]);

  const shown = sortNewest
    ? [...post.comments].reverse()
    : post.comments;
  const canSendComment = commentText.trim().length > 0;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const v = commentText.trim();
    if (!v || commentSending) return;
    setCommentSending(true);
    onAddComment(post.id, v);
    setCommentText("");
    setVisible((n) => Math.max(n, PAGE) + 1);
    window.setTimeout(() => setCommentSending(false), 320);
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
          <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3 min-h-[24px]">
            <p className="text-[15px] font-medium text-[#5F6368] leading-5">
              {formatCommentCount(post.comments.length)}
            </p>
            <button
              type="button"
              onClick={() => setSortNewest(!sortNewest)}
              className="text-[15px] font-medium text-[#6200EE] hover:opacity-90 transition-opacity shrink-0"
            >
              {sortNewest ? "Сначала новые" : "Сначала старые"}
            </button>
          </div>

          <div className="px-4 pb-4 space-y-4">
            {post.comments.length === 0 && (
              <p className="text-center text-sm text-[#5F6368] py-6">
                Пока нет комментариев. Будьте первым!
              </p>
            )}

            {shown.map((c) => (
              <div key={c.id} className="flex items-start gap-3.5 animate-fade-in">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-[44px] w-[44px] rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[17px] font-bold text-gray-900 leading-tight">
                    {c.author.name}
                  </p>
                  <p className="text-[15px] text-gray-800 leading-[1.3] mt-0.5">
                    {c.text}
                  </p>
                </div>
                <button
                  onClick={() => onToggleCommentLike(post.id, c.id)}
                  className={cn(
                    "flex items-center gap-1.5 pt-1 text-sm font-medium transition-all flex-shrink-0",
                    c.liked ? "text-like" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {c.liked ? (
                    <Heart className="h-5 w-5 animate-pop" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Heart className="h-5 w-5" strokeWidth={2} />
                  )}
                  <span className="tabular-nums pt-0.5">{c.likes}</span>
                </button>
              </div>
            ))}


            <form onSubmit={handleAddComment} className="flex items-center gap-3 pt-2">
              <div className="flex-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ваш комментарий"
                  className="w-full bg-white border border-gray-200 h-[52px] px-5 py-2 rounded-full text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!canSendComment || commentSending}
                className={cn(
                  "flex items-center justify-center transition-[color,transform] duration-200",
                  commentSending && "pointer-events-none text-[#4C1D95]",
                  !commentSending &&
                    !canSendComment &&
                    "text-[#D6CFFF]",
                  !commentSending &&
                    canSendComment &&
                    "text-[#8B5CF6] hover:text-[#6D28D9] hover:scale-110 active:text-[#5B21B6] active:scale-95"
                )}
                aria-label="Отправить"
              >
                <CommentSendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};
