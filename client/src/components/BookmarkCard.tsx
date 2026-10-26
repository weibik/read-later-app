import type { Bookmark } from '../types';

type BookmarkCardProps = {
  bookmark: Bookmark;
};

function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <div className=" relative overflow-hidden rounded-xl border border-gray-200 bg-white">
      <img
        src={bookmark.image}
        alt=""
        className="aspect-video w-full object-cover"
      />
      <div className="flex flex-col gap-2 p-3">
        <div className="text-base font-medium text-gray-900 line-clamp-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0"
          >
            {bookmark.title}
          </a>
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {bookmark.description}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;

// 4. Card anatomy (BookmarkCard)
//
// Top to bottom, in this order:
//
// Image (og:image), edge to edge, top of the card. Trash button overlaps its top-right corner.
// Title, max 2 lines, ends with "...".
// Description, max 2 lines.
// Tags, small pills in one row, wrapping if needed.
//
// Trash is always in the same top-right corner on every variant. Never in the text area.
//
// Card classes
// Card: relative overflow-hidden rounded-xl border border-gray-200 bg-white
// Image: aspect-video w-full object-cover (use the same aspect-video on the skeleton so nothing jumps)
// Text area: flex flex-col gap-2 p-3
// Title: text-base font-medium text-gray-900 line-clamp-2
// Description: text-sm text-gray-600 line-clamp-2
// Tags wrapper: flex flex-wrap gap-1.5
// Tag pill: rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600
// Trash button: absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-red-600 + aria-label="Delete bookmark"
//
// Icons: lucide-react (free), e.g. Trash2, RefreshCw, AlertCircle, ImageOff, Bookmark. Icon size about 16px.
//
// Clicking
// Whole card opens the URL (new tab), except the trash button.
// Technique ("stretched link"): the title is the real <a href={url} target="_blank" rel="noopener noreferrer"> with after:absolute after:inset-0. The card is relative. Trash is relative z-10 (or z-10 as above) so it sits above the stretched link.
// pending: not clickable (no title yet).
// failed: clickable (opens the URL).
// Tags: not clickable for now (one job per card
