import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comment } from "./types";
import { currentUser } from "./data";

const PAGE = 3;

export const CommentsSheet = ({
  open,
  onOpenChange,
  comments,
  onAdd,
  onToggleLike,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  comments: Comment[];
  onAdd: (text: string) => void;
  onToggleLike: (id: string) => void;
}) => {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const [sortNewest, setSortNewest] = useState(true);

  const shown = sortNewest 
    ? comments.slice(0, visible).reverse()
    : comments.slice(0, visible);
  const hasMore = visible < comments.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    onAdd(v);
    setText("");
    setVisible((n) => Math.max(n, PAGE) + 1);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-0 max-w-md mx-auto p-0 h-[85vh] flex flex-col bg-background"
      >
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
          <SheetTitle className="text-sm font-semibold text-left text-foreground">
            {comments.length} комментари{comments.length === 1 ? "й" : "я"}
          </SheetTitle>
          <button
            onClick={() => setSortNewest(!sortNewest)}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Сначала новые
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              Пока нет комментариев. Будьте первым!
            </p>
          )}

          {shown.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5 py-2 animate-fade-in">
              <img
                src={c.author.avatar}
                alt={c.author.name}
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {c.author.name}
                </p>
                <p className="text-sm text-foreground/70 leading-snug mt-0.5">
                  {c.text}
                </p>
              </div>
              <button
                onClick={() => onToggleLike(c.id)}
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold transition-colors flex-shrink-0",
                  c.liked ? "text-like" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart
                  className={cn("h-4 w-4", c.liked && "animate-pop")}
                  fill={c.liked ? "currentColor" : "none"}
                  strokeWidth={2.2}
                />
                <span className="tabular-nums">{c.likes}</span>
              </button>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => setVisible((n) => n + PAGE)}
              className="block mx-auto px-4 py-2 rounded-full text-primary text-xs font-semibold hover:text-primary/80 transition-colors"
            >
              Показать еще
            </button>
          )}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2.5 px-4 py-3 border-t border-border bg-background"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш комментарий"
            className="flex-1 px-0 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-40 transition-colors"
            aria-label="Отправить"
          >
            <Navigation className="h-5 w-5 rotate-[30deg]" fill="currentColor" strokeWidth={2} />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
