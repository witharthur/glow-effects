/** Skeleton placeholder while a post is loading */
export const PostCardSkeleton = () => (
  <article className="bg-card shadow-card overflow-hidden flex flex-col animate-pulse">
    {/* Author row */}
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-9 w-9 rounded-full bg-secondary/80" />
      <div className="h-4 w-28 rounded-full bg-secondary/80" />
    </div>
    {/* Image */}
    <div className="w-full aspect-square bg-secondary/60" />
    {/* Text */}
    <div className="px-4 pt-3 pb-5 flex flex-col gap-2">
      <div className="h-4 w-1/2 rounded-full bg-secondary/80" />
      <div className="h-3 w-full rounded-full bg-secondary/60" />
      <div className="h-3 w-3/4 rounded-full bg-secondary/60" />
    </div>
  </article>
);
