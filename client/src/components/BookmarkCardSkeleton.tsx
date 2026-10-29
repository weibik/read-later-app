import DeleteButton from './DeleteButton';
import SkeletonShape from './SkeletonShape';

type BookmarkCardSkeletonProps = {
  id: number;
  onDelete: (id: number) => void;
};

function BookmarkCardSkeleton({ id, onDelete }: BookmarkCardSkeletonProps) {
  return (
    <SkeletonShape>
      <DeleteButton id={id} onDelete={onDelete} />
    </SkeletonShape>
  );
}

export default BookmarkCardSkeleton;
