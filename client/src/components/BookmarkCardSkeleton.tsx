function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-gray-200 ${className}`} />;
}

function BookmarkCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-video w-full bg-gray-200" />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col gap-1.5">
          <Bar className="h-3.5 w-11/12" />
          <Bar className="h-3.5 w-3/5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Bar className="h-2 w-full" />
          <Bar className="h-2 w-4/5" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-11 rounded-full bg-gray-200" />
          <div className="h-5 w-9 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default BookmarkCardSkeleton;
