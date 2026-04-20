import { useMemo, useState } from "react";

import { FilterTabs } from "@/components/feed/FilterTabs";
import { PostCard } from "@/components/feed/PostCard";
import { DonateSheet } from "@/components/feed/DonateSheet";
import { EmptyState } from "@/components/feed/EmptyState";
import { initialPosts, currentUser } from "@/components/feed/data";
import type { FilterKey, Post } from "@/components/feed/types";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [donateOpen, setDonateOpen] = useState(false);
  const [view, setView] = useState<"feed" | "loading" | "error">("feed");

  const filtered = useMemo(() => {
    if (filter === "free") return posts.filter((p) => !p.locked);
    if (filter === "paid") return posts.filter((p) => p.locked);
    return posts;
  }, [posts, filter]);

  const toggleLike = (id: string) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

  const addComment = (postId: string, text: string) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c-${Date.now()}`,
                author: currentUser,
                text,
                likes: 0,
              },
            ],
          }
          : p
      )
    );

  const toggleCommentLike = (postId: string, commentId: string) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            comments: p.comments.map((c) =>
              c.id === commentId
                ? {
                  ...c,
                  liked: !c.liked,
                  likes: c.liked ? c.likes - 1 : c.likes + 1,
                }
                : c
            ),
          }
          : p
      )
    );

  const handleDonate = (_id: string) => setDonateOpen(true);

  const reload = () => {
    setView("loading");
    setTimeout(() => {
      setPosts(initialPosts);
      setFilter("all");
      setView("feed");
    }, 900);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md min-h-screen bg-secondary/40 relative">

        {view === "feed" && (
          <>
            {filtered.length > 0 && <FilterTabs value={filter} onChange={setFilter} />}
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <EmptyState
                  message="По вашему запросу ничего не найдено"
                  cta="На главную"
                  onCta={() => setFilter("all")}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-24" style={{ borderRadius: '0px' }}>
                {filtered.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    onToggleLike={toggleLike}
                    onDonate={handleDonate}
                    onAddComment={addComment}
                    onToggleCommentLike={toggleCommentLike}
                  />
                ))}
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
                onClick={() => setPosts([])}
                className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground whitespace-nowrap transition-colors"
              >
                Пусто
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
          <div className="flex items-center justify-center py-32 animate-fade-in">
            <Loader2 className="h-10 w-10 text-primary animate-spin-slow" />
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
