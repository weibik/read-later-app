import { Trash2 } from 'lucide-react';

type DeleteButtonProps = {
  id: number;
  onDelete: (id: number) => void;
};

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  return (
    <button
      type="button"
      aria-label="Delete bookmark"
      onClick={() => onDelete(id)}
      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-red-600"
    >
      <Trash2 size={16} />
    </button>
  );
}
