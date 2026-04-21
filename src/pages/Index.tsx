import { useMemo, useState, useEffect } from "react";

import { FilterTabs } from "@/components/feed/FilterTabs";
import { PostCard } from "@/components/feed/PostCard";
import { PostCardSkeleton } from "@/components/feed/PostCardSkeleton";
import { DonateSheet } from "@/components/feed/DonateSheet";
import { EmptyState } from "@/components/feed/EmptyState";
import { initialPosts, currentUser } from "@/components/feed/data";
import type { FilterKey, Post } from "@/components/feed/types";
import { Loader2 } from "lucide-react";
import { usePosts, useLikePost } from "@/hooks/usePosts";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [donateOpen, setDonateOpen] = useState(false);
  const [view, setView] = useState<"feed" | "loading" | "error">("feed");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(filter);
  const { mutate: likePost } = useLikePost();

  const mappedPosts = useMemo(() => {
    const seen = new Set<string>();
    let globalIndex = 0;
    return (data?.pages ?? []).flatMap((page) =>
      (page?.items ?? []).filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }).map((p): Post => {
        const mockImg = initialPosts[globalIndex % initialPosts.length]?.image;
        const mockAvatar = initialPosts[globalIndex % initialPosts.length]?.author?.avatar;
        globalIndex++;
        return {
          id: p.id,
          author: {
            id: p.author.id,
            name: p.author.displayName || p.author.username,
            avatar: mockAvatar || p.author.avatarUrl,
          },
          image: mockImg || p.coverUrl,
          title: p.title,
          text: p.body || p.preview,
          likes: p.likesCount,
          // We set a fake array here just for the comments count in the UI. 
          // PostCard will fetch actual comments itself.
          comments: Array.from({ length: p.commentsCount }).map(() => ({} as any)),
          liked: p.isLiked,
          locked: p.tier === "paid",
          long: false,
        };
      })
    );
  }, [data]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Sync state view
  useEffect(() => {
    if (isLoading) setView("loading");
    else if (isError) setView("error");
    else setView("feed");
  }, [isLoading, isError]);

  const toggleLike = (id: string) => likePost(id);

  // We leave these as no-ops since PostCard handles its own comments now
  const addComment = () => {};
  const toggleCommentLike = () => {};

  const handleDonate = (_id: string) => setDonateOpen(true);

  const reload = () => {
    setView("loading");
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md min-h-screen bg-secondary/40 relative">

        {view === "feed" && (
          <>
            {mappedPosts.length > 0 && <FilterTabs value={filter} onChange={setFilter} />}
            {mappedPosts.length === 0 ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <EmptyState
                  message="По вашему запросу ничего не найдено"
                  cta="На главную"
                  onCta={() => setFilter("all")}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-24" style={{ borderRadius: '0px' }}>
                {mappedPosts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    onToggleLike={toggleLike}
                    onDonate={handleDonate}
                    onAddComment={addComment}
                    onToggleCommentLike={toggleCommentLike}
                  />
                ))}
                
                {isFetchingNextPage && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  </div>
                )}
              </div>
            )}

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-card/90 backdrop-blur rounded-full px-1.5 py-1.5 shadow-card border border-border max-w-[calc(100%-1.5rem)]">

              <button
                onClick={() => setView("error")}
                className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground whitespace-nowrap transition-colors"
              >
                Ошибка
              </button>
              <button
                onClick={() => setFilter("free")}
                className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground whitespace-nowrap transition-colors"
              >
                Бесплатные
              </button>
              <button
                onClick={reload}
                className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground whitespace-nowrap transition-colors"
              >
                Сброс
              </button>
            </div>
          </>
        )}

        {view === "loading" && (
          <div className="flex flex-col gap-3 pb-24 animate-fade-in" style={{ borderRadius: '0px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {view === "error" && (
          <>
            <header className="flex items-center gap-3 px-4 pt-4 pb-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                width={40}
                height={40}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
              />
              <span
                style={{
                  width: '96px',
                  height: '20px',
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  lineHeight: '20px',
                  letterSpacing: '0px',
                  color: 'rgba(17, 20, 22, 1)',
                }}
              >
                Петр Федько
              </span>
            </header>
            <EmptyState
              message="Не удалось загрузить публикацию"
              cta="Повторить"
              onCta={reload}
            />
          </>
        )}

        <DonateSheet open={donateOpen} onOpenChange={setDonateOpen} />
      </div>
    </main>
  );
};

export default Index;
