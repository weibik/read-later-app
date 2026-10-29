import SkeletonShape from './SkeletonShape';

export default function BookmarkGridSkeleton() {
  return (
    <div className="grid ...">
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonShape key={i}></SkeletonShape>
      ))}
    </div>
  );
}
