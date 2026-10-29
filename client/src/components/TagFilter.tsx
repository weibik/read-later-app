type TagFilterProps = {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
};

export default function TagFilter({
  tags,
  selected,
  onSelect,
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {[null, ...tags].map((tag) => (
        <button
          key={tag ?? 'all'}
          type="button"
          onClick={() => onSelect(tag)}
          className={
            tag === selected
              ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full border border-indigo-600 bg-indigo-600 px-3 py-1 text-sm text-white'
              : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100'
          }
        >
          {tag ?? 'All'}
        </button>
      ))}
    </div>
  );
}
