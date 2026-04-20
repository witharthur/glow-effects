import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Navigation, X } from "lucide-react";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] mx-auto p-0 border-0 bg-white max-h-[85vh] flex flex-col overflow-hidden rounded-[32px] shadow-2xl" style={{ border: 'none' }}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 z-50 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
            {comments.length} комментари{comments.length === 1 ? "й" : comments.length >= 2 && comments.length <= 4 ? "я" : "ев"}
          </h2>
          <button
            onClick={() => setSortNewest(!sortNewest)}
            className="text-[15px] font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Сначала новые
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-none">
          {comments.length === 0 && (
            <p className="text-center text-sm text-white/60 py-10">
              Пока нет комментариев. Будьте первым!
            </p>
          )}

          {shown.map((c) => (
            <div key={c.id} className="flex items-start gap-3.5 animate-fade-in group">
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
                onClick={() => onToggleLike(c.id)}
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
          className="flex items-center gap-3 px-6 py-5 bg-white border-t border-gray-100"
        >
          <div className="flex-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ваш комментарий"
              className="w-full bg-white border border-gray-200 h-[52px] px-5 py-2 rounded-full text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center justify-center text-primary disabled:opacity-30 transition-all hover:scale-110 active:scale-95"
            aria-label="Отправить"
          >
            <Navigation className="h-7 w-7 rotate-[30deg]" fill="currentColor" strokeWidth={0} />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
