import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePost, useLikePost } from "@/hooks/usePosts";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { EmptyState } from "@/components/feed/EmptyState";
import { useMemo, useState, useCallback } from "react";
import { DonateSheet } from "@/components/feed/DonateSheet";

const CommentSendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    className="h-7 w-7 shrink-0" fill="currentColor" aria-hidden>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [donateOpen, setDonateOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading, isError, refetch } = usePost(id!);
  const { mutate: likePost } = useLikePost();

  const locked = post?.tier === "paid";

  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(id!, !!post && !locked);

  const { mutate: sendComment, isPending: commentSending } = useCreateComment(id!);

  const allComments = useMemo(
    () => commentsData?.pages.flatMap((p) => p.items) ?? [],
    [commentsData]
  );

  const canSend = commentText.trim().length > 0;

  const handleLike = useCallback(() => likePost(id!), [likePost, id]);
  const handleComment = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const v = commentText.trim();
      if (!v || commentSending) return;
      sendComment(v, { onSuccess: () => setCommentText("") });
    },
    [commentText, commentSending, sendComment]
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-md min-h-screen bg-secondary/40">
          <EmptyState message="Не удалось загрузить публикацию" cta="Повторить" onCta={() => refetch()} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md min-h-screen bg-secondary/40">

        {/* Nav */}
        <div className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img src={post.author.avatar} alt={post.author.name} className="h-8 w-8 rounded-full object-cover" />
          <span className="font-semibold text-sm">{post.author.name}</span>
        </div>

        {/* Cover */}
        {locked ? (
          <div className="relative aspect-square overflow-hidden">
            {post.coverUrl && (
              <img src={post.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-70" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-6"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(32px) saturate(160%)" }}>
              <div className="h-14 w-14 bg-primary flex items-center justify-center shadow-button rounded-[11px]">
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" strokeWidth={3} />
                </div>
              </div>
              <p style={{ fontFamily: '"Manrope",sans-serif', fontWeight: 600, fontSize: "15px", color: "white", maxWidth: "236px" }}>
                Контент скрыт пользователем.<br />Доступ откроется после доната
              </p>
              <button
                onClick={() => setDonateOpen(true)}
                style={{ width: "239px", height: "42px", borderRadius: "14px", background: "rgba(97,21,205,1)", color: "white", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
                className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Отправить донат
              </button>
            </div>
          </div>
        ) : (
          post.coverUrl && (
            <img src={post.coverUrl} alt={post.title} className="w-full aspect-square object-cover" />
          )
        )}

        {/* Body */}
        {locked ? (
          <div className="px-4 py-5 flex flex-col gap-2">
            <div className="h-[18px] w-[130px] bg-secondary/80 rounded-full animate-pulse" />
            <div className="h-[18px] w-full bg-secondary/80 rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="px-4 pt-4 pb-3">
            <h1 className="text-lg font-bold text-foreground mb-2">{post.title}</h1>
            <p className="text-sm text-foreground/80 leading-relaxed">{post.body}</p>
          </div>
        )}

        {/* Actions */}
        {!locked && (
          <div className="flex items-center gap-2 px-3 pb-4 pt-1">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all",
                post.isLiked ? "bg-like-soft text-like" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", post.isLiked && "animate-pop")} fill={post.isLiked ? "currentColor" : "none"} strokeWidth={2.2} />
              <span className="tabular-nums">{post.likesCount}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-secondary text-muted-foreground">
              <MessageCircle className="h-4 w-4" fill="none" strokeWidth={2.2} />
              <span className="tabular-nums">{post.commentsCount}</span>
            </button>
          </div>
        )}

        {/* Comments */}
        {!locked && (
          <div className="border-t border-gray-100 bg-gray-50/30">
            <div className="px-4 pt-3 pb-2">
              <p className="text-[15px] font-medium text-[#5F6368]">Комментарии</p>
            </div>
            <div className="px-4 pb-24 space-y-4">
              {commentsLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!commentsLoading && allComments.length === 0 && (
                <p className="text-center text-sm text-[#5F6368] py-6">Пока нет комментариев. Будьте первым!</p>
              )}
              {allComments.map((c) => (
                <div key={c.id} className="flex items-start gap-3.5 animate-fade-in">
                  <img src={c.author.avatar} alt={c.author.name} width={44} height={44} loading="lazy" className="h-[44px] w-[44px] rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[17px] font-bold text-gray-900 leading-tight">{c.author.name}</p>
                    <p className="text-[15px] text-gray-800 leading-[1.3] mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
              {hasNextPage && (
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
                  className="w-full text-sm text-primary font-semibold hover:underline py-2">
                  {isFetchingNextPage ? "Загрузка..." : "Показать еще"}
                </button>
              )}
              <form onSubmit={handleComment} className="flex items-center gap-3 pt-2 sticky bottom-4">
                <div className="flex-1">
                  <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ваш комментарий"
                    className="w-full bg-white border border-gray-200 h-[52px] px-5 py-2 rounded-full text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm" />
                </div>
                <button type="submit" disabled={!canSend || commentSending}
                  className={cn("flex items-center justify-center transition-[color,transform] duration-200",
                    commentSending && "pointer-events-none text-[#4C1D95]",
                    !commentSending && !canSend && "text-[#D6CFFF]",
                    !commentSending && canSend && "text-[#8B5CF6] hover:text-[#6D28D9] hover:scale-110 active:scale-95"
                  )} aria-label="Отправить">
                  <CommentSendIcon />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <DonateSheet open={donateOpen} onOpenChange={setDonateOpen} />
    </main>
  );
};

export default PostDetail;
