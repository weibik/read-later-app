import SkeletonShape from './SkeletonShape';

export default function BookmarkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonShape key={i} />
      ))}
    </div>
  );
}
