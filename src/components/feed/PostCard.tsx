import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "./types";
import { currentUser } from "./data";

export const PostCard = ({
  post,
  onToggleLike,
  onDonate,
  onOpenComments,
}: {
  post: Post;
  onToggleLike: (id: string) => void;
  onDonate: (id: string) => void;
  onOpenComments: (id: string) => void;
}) => {
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

  return (
    <article className="bg-card  shadow-card overflow-hidden animate-fade-in">
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

      {post.locked ? (
        <div className="relative aspect-square">
          {post.image && (
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover blur-xl scale-110 opacity-50"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-5" style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%)',
            backdropFilter: 'blur(15px)',
          }}>
            <div className="h-14 w-14 bg-primary flex items-center justify-center shadow-button rounded-2xl">
              <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" strokeWidth={2.75} />
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
                verticalAlign: 'middle',
                color: 'rgba(255, 255, 255, 1)',
                maxWidth: '236px',
              }}
            >
              Контент скрыт пользователем.
              <br />
              Доступ откроется после доната
            </p>
            <button
              onClick={() => onDonate(post.id)}
              style={{
                width: '236px',
                height: '40px',
                borderRadius: '14px',
                padding: '16px 32px',
                background: 'rgba(97, 21, 205, 1)',
                color: 'white',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: 1,
                boxSizing: 'border-box',
              }}
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
            onClick={() => onOpenComments(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all",
              commented
                ? "bg-secondary text-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageCircle
              className={cn("h-4 w-4", commented && "animate-pop")}
              fill={commented ? "currentColor" : "none"}
              strokeWidth={2.2}
            />
            <span className="tabular-nums">{post.comments.length}</span>
          </button>
        </div>
      )}
    </article>
  );
};
